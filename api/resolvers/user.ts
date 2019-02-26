import { Resolver, Mutation, Arg, Ctx, Info, Query } from 'type-graphql';
import { UserInput, User } from '../schema/user';
import { Context } from '../index';
import simpleProjection from '../utils/simple-projection';


@Resolver()
export class UserResolver {
  @Query(returns => User)
  user(
    @Arg('email') email: string,
    @Ctx() context: Context,
    @Info() info
  ): Promise<User> {
    const { users_col } = context;

    return users_col
      .findOne({ email }, simpleProjection(info))
      // large integer is not Int in grqphql, needs to be converted to string
      .then(user => Object.assign(user, { createdAt: new Date(user.createdAt) }));
  }

  @Mutation(returns => User)
  addUser(
    @Arg("data") args: UserInput,
    @Ctx() context: Context,
  ): any {
    console.log(args);
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
        .findOne({ email, password });

      session.user = user;

      return user;
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