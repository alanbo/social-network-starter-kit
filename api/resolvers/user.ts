import uuid from 'uuid/v4';
import bcrypt from 'bcrypt';
import { GraphQLResolveInfo } from 'graphql';

import {
  Resolver,
  Mutation,
  Arg,
  Ctx,
  Info,
  Query,
  Root,
  FieldResolver,
} from 'type-graphql';

import { UserInput, User, UpdatePasswordInput, UserBasic, UserInputOpt } from '../schema/user';
import { Context } from '../index';
import simpleProjection from '../utils/simple-projection';

export interface UserMongo extends UserInput {
  createdAt: Date,
  _id: string,
  password: string,
  friend_requests?: string[],
  friends?: string[]
}


@Resolver(of => User)
export class UserResolver {
  @Query(returns => User, { nullable: true })
  async user(
    @Arg('email', { nullable: true }) email: string,
    @Ctx() context: Context,
    @Info() info: GraphQLResolveInfo
  ): Promise<UserMongo | Error> {
    const { users_col, session } = context;

    // Checking other users than the one that is logged in is not allowed.
    // TO DO: allow checking users that have friends connection.
    // with restriction to a subset of fields.
    if (!session.user) {
      return new Error('NOT_LOGGED_IN');
    } else if (email && email !== session.user.email) {
      return new Error('NOT_AUTHORIZED');
    }

    const user = users_col
      .findOne({ email: email || session.user.email }, simpleProjection(info))
      .then(u => {
        if (u) {
          u.createdAt = new Date(u.createdAt);
        }

        return u;
      });


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

      delete to_insert.password;

      session.user = to_insert;

      return to_insert;

    } catch (e) {
      return e;
    }
  }

  @Mutation(returns => User)
  async updateUser(
    @Arg("data") data: UserInputOpt,
    @Ctx() context: Context,
    @Info() info: GraphQLResolveInfo
  ): Promise<UserMongo | Error> {
    const { session, users_col } = context;

    try {
      const result = users_col
        .findOneAndUpdate(
          { _id: session.user._id },
          { $set: data },
          { returnOriginal: false, projection: simpleProjection(info) }
        )
        .then(result => result.value);

      return result;
    } catch (e) {
      return e;
    }
  }

  @Mutation(returns => Boolean)
  async updatePassword(
    @Arg("data") data: UpdatePasswordInput,
    @Ctx() context: Context,
  ): Promise<Boolean | Error> {
    const { session, users_col } = context;
    const { old_password, new_password } = data;

    if (!session.user) {
      return new Error('The user needs to be logged in');
    }
    try {
      const user = await users_col
        .findOne({ _id: session.user._id }, { projection: { password: 1 } });

      const match = await bcrypt.compare(old_password, user.password);

      if (!match) {
        return false;
      }

      const hashed_password = await bcrypt.hash(new_password, 10);

      await users_col.updateOne({ _id: session.user._id }, { $set: { password: hashed_password } });

      return true;
    } catch (e) {
      return e;
    }
  }


  @Mutation(returns => Boolean)
  async refuseFriendRequest(
    @Arg('id') id: string,
    @Ctx() context: Context,
  ): Promise<Boolean | Error> {
    const { session, users_col } = context;

    if (!session.user) {
      return new Error('The user needs to be logged in');
    }

    try {
      await users_col.updateOne(
        { _id: session.user._id },
        { $pull: { friend_requests: id as any } }
      );
    } catch (e) {
      return e;
    }

    return true;
  }

  @Mutation(returns => Boolean)
  async removeFriend(
    @Arg('id') id: string,
    @Ctx() context: Context,
  ): Promise<Boolean | Error> {
    const { session, users_col } = context;

    if (!session.user) {
      return new Error('The user needs to be logged in');
    }
    // e

    try {
      await users_col.updateOne(
        { _id: session.user._id },
        { $pull: { friends: id as any } }
      )
    } catch (e) {
      return e;
    }

    // TO DO: there should be a transaction or some implementation of transaction logic.
    // if the first operation succeeds and the second fails there would be incosistency of data. 

    try {
      await users_col.updateOne(
        { _id: id },
        { $pull: { requested_friends: session.user._id as any } }
      );
    } catch (e) {
      return e;
    }

    return true;
  }

  @Mutation(returns => Boolean)
  async acceptFriendRequest(
    @Arg('id') id: string,
    @Ctx() context: Context,
  ): Promise<Boolean | Error> {
    const { session, users_col } = context;

    if (!session.user) {
      return new Error('The user needs to be logged in');
    }

    const { friend_requests } = await users_col.findOne(
      { _id: session.user._id },
      { projection: { friend_requests: 1 } }
    );

    // Makes suer user can't update if id doesn't exist in friend_requests.
    // It is crucial, otherwise users would be able to add any person.
    if (!friend_requests || !friend_requests.includes(id)) {
      return false;
    }

    try {
      await users_col.updateOne(
        { _id: session.user._id },
        { $addToSet: { friends: id }, $pull: { friend_requests: id as any } }
      )
    } catch (e) {
      return e;
    }

    // TO DO: there should be a transaction or some implementation of transaction logic.
    // if the first operation succeeds and the second fails there would be incosistency of data. 

    try {
      await users_col.updateOne(
        { _id: id },
        { $addToSet: { friends: id }, $pull: { requested_friends: session.user._id as any } }
      );
    } catch (e) {
      return e;
    }

    return true;
  }

  @Query(returns => [UserBasic])
  async searchUser(
    @Arg('search') search: string,
    @Ctx() context: Context,
  ): Promise<UserBasic[] | Error> | null {
    const { users_col, session } = context;

    if (!session.user) {
      return new Error('The user needs to be logged in');
    }

    // TO DO: consider regex search. Text index only allows for searching full words.
    // May be not performant enough. 
    const query = { $text: { $search: search } };

    const projection = {
      first_name: 1,
      last_name: 1,
      _id: 1,
      // TO DO:
      // Reconsider displaying email. In general should be hidden from non-friends.
      email: 1
    }

    const users = await users_col.find(query, { projection }).toArray();

    return users;
  }

  @Mutation(returns => User)
  async login(
    @Arg('password') password: string,
    @Arg('email') email: string,
    @Ctx() context: Context,
  ): Promise<UserMongo | Error> {
    const { session, users_col } = context;

    try {
      const user = await users_col
        .findOne({ email });

      const match = await bcrypt.compare(password, user && user.password);

      delete user.password;

      user.createdAt = new Date(user.createdAt);

      if (match) {
        session.user = user;

        return user;
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

  @FieldResolver()
  posts(
    @Root() user: User,
    @Ctx() context: Context
  ) {
    return context.posts_col.find({
      user: user._id
    }).toArray();
  }

  @FieldResolver()
  friends(
    @Root() user: User,
    @Ctx() context: Context
  ) {
    if (!user.friends) {
      return null;
    }

    return context.users_col.find({
      _id: { '$in': user.friends }
    }).toArray();
  }

  @FieldResolver()
  friend_requests(
    @Root() user: User,
    @Ctx() context: Context
  ) {
    if (!user.friend_requests) {
      return null;
    }

    return context.users_col.find({
      _id: { '$in': user.friend_requests }
    }).toArray();
  }
}