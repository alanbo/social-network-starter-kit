import uuid from 'uuid/v4';
import bcrypt from 'bcrypt';
import { GraphQLResolveInfo } from 'graphql';
import { PostMongo } from './post';

import { sortArrayOfObjByArrayOfIds } from '../utils';

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

import { User, UserBasic } from '../schema/user';
import { Context } from '../index';
import simpleProjection from '../utils/simple-projection';

export interface UserMongo {
  _id: string;
  given_name: string;
  family_name: string;
  email: string;
  phone_number: string;
  gender: string;
  birthdate: string;
  friends?: string[];
  friend_requests?: string[];
}


@Resolver(of => User)
export class UserResolver {
  @Query(returns => User, { nullable: true })
  async user(
    @Ctx() context: Context,
    @Info() info: GraphQLResolveInfo
  ): Promise<UserMongo | Error> {
    const { users_col, user } = context;

    const user_mongo = users_col
      .findOne({ email: user.email }, simpleProjection(info))

    return user_mongo;
  }


  @Mutation(returns => Boolean)
  async refuseFriendRequest(
    @Arg('id') id: string,
    @Ctx() context: Context,
  ): Promise<Boolean | Error> {
    const { user, users_col } = context;

    try {
      await users_col.updateOne(
        { _id: user.sub },
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
    const { user, users_col } = context;

    try {
      await users_col.updateOne(
        { _id: user.sub },
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
        { $pull: { requested_friends: user.sub as any } }
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
    const { user, users_col } = context;

    const { friend_requests } = await users_col.findOne(
      { _id: user.sub },
      { projection: { friend_requests: 1 } }
    );

    // Makes suer user can't update if id doesn't exist in friend_requests.
    // It is crucial, otherwise users would be able to add any person.
    if (!friend_requests || !friend_requests.includes(id)) {
      return false;
    }

    try {
      await users_col.updateOne(
        { _id: user.sub },
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
        { $addToSet: { friends: id }, $pull: { requested_friends: user.sub as any } }
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
    const { users_col } = context;

    // TO DO: consider regex search. Text index only allows for searching full words.
    // May be not performant enough. 
    const query = { $text: { $search: search } };

    const projection = {
      given_name: 1,
      family_name: 1,
      _id: 1,
      // TO DO:
      // Reconsider displaying email. In general should be hidden from non-friends.
      email: 1
    }

    const users = await users_col.find(query, { projection }).toArray();

    return users;
  }


  @FieldResolver()
  async posts(
    @Root() user: User,
    @Ctx() context: Context
  ) {
    const posts = await context.posts_col.find({
      user: user._id
    }).toArray();

    posts.forEach((post: PostMongo) => {
      post.createdAt = new Date(post.createdAt);
    });

    return posts;
  }

  @FieldResolver()
  friends(
    @Root() user: UserMongo,
    @Ctx() context: Context
  ) {
    if (!user.friends) {
      return null;
    }

    return context.users_col.find({
      _id: { '$in': user.friends }
    }).toArray()
      .then(friends => sortArrayOfObjByArrayOfIds(user.friends, friends));
  }

  @FieldResolver()
  friend_requests(
    @Root() user: UserMongo,
    @Ctx() context: Context
  ) {
    if (!user.friend_requests) {
      return null;
    }

    return context.users_col.find({
      _id: { '$in': user.friend_requests }
    }).toArray()
      .then(friend_req => sortArrayOfObjByArrayOfIds(user.friend_requests, friend_req));
  }
}
