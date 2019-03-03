import uuid from 'uuid/v4';
import bcrypt from 'bcrypt';

import {
  Resolver,
  Mutation,
  Arg,
  Ctx,
  Info,
  Query,
  Root,
  FieldResolver
} from 'type-graphql';

import { PostInput, Post } from '../schema/post';
import { Context } from '../index';
import simpleProjection from '../utils/simple-projection';
import { UserMongo } from './user';

export interface PostMongo extends PostInput {
  createdAt: Date,
  _id: string,
}

@Resolver(of => Post)
export class PostResolver {
  @Query(returns => [Post])
  async posts(
    @Ctx() context: Context,
    @Info() info
  ): Promise<PostMongo[] | Error> {
    if (!context.session.user) {
      return new Error('The user must be logged in');
    }

    const { _id } = context.session.user;

    // TO DO: need to add pagination.
    return context.posts_col.find({ visible_to: _id }, simpleProjection(info)).toArray();
  };

  @FieldResolver()
  user(
    @Root() post: Post,
    @Ctx() context: Context,
    @Info() info
  ): Promise<UserMongo> {
    return context.users_col.findOne({
      _id: post.user
    }, simpleProjection(info));
  }

  @FieldResolver()
  async visible_to(
    @Root() post: Post,
    @Ctx() context: Context
  ) {

    const visible_to = await context.users_col.find({
      _id: { $in: post.visible_to }
    }).toArray();

    return visible_to;
  }
}