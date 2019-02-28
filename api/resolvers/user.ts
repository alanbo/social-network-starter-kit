import uuid from 'uuid/v4';
import bcrypt from 'bcrypt';
import { Resolver, Mutation, Arg, Ctx, Info, Query } from 'type-graphql';
import { UserInput, User } from '../schema/user';
import { Context } from '../index';
import simpleProjection from '../utils/simple-projection';

export interface UserMongo extends UserInput {
  createdAt: Date,
  _id: string
}

@Resolver()
export class UserResolver {
  @Query(returns => User)
  async user(
    @Arg('email') email: string,
    @Ctx() context: Context,
    @Info() info
  ): Promise<User | Error> {
    const { users_col, session } = context;

    // Checking other users than the one that is logged in is not allowed.
    // TO DO: allow checking users that have friends connection.
    if (!session.user) {
      return new Error('User not logged in');
    } else if (email !== session.user.email) {
      return new Error('Not autorized to view this user');
    }

    const user = users_col
      .findOne({ email }, simpleProjection(info));

    return user;
  }

  @Mutation(returns => User)
  async addUser(
    @Arg("data") args: UserInput,
    @Ctx() context: Context,
  ): Promise<User> {
    const { session, users_col } = context;
    const to_insert = { ...args, createdAt: new Date(), _id: uuid() };

    try {
      const hashed_password = await bcrypt.hash(args.password, 10);
      await users_col.insertOne(Object.assign(to_insert, { password: hashed_password }));

      session.user = to_insert;

      return to_insert;

    } catch (e) {
      return e;
    }
  }

  @Mutation(returns => User)
  async login(
    @Arg('password') password: string,
    @Arg('email') email: string,
    @Ctx() context: Context,
  ): Promise<User | Error> {
    const { session, users_col } = context;

    try {
      const user = await users_col
        .findOne({ email });

      const match = await bcrypt.compare(password, user.password);

      delete user.password;

      if (match) {
        session.user = user;
        return <User>user;
      } else {
        return new Error('The password doesn\'t match');
      }
    } catch (e) {
      return e;
    }
  }

  @Mutation(returns => Boolean)
  logout(
    @Ctx() context: Context
  ): Promise<Boolean> {
    const session = context.session;

    return (new Promise((resolve, reject) => {
      session.destroy(err => {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      });
    }));
  }
}