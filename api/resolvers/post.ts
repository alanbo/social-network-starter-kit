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
  FieldResolver,
} from 'type-graphql';

import { PostInput, Post } from '../schema/post';
import { Context } from '../index';
import simpleProjection from '../utils/simple-projection';
import { UserMongo } from './user';

export interface PostMongo extends PostInput {
  createdAt: Date,
  _id: string,
}

interface PostsQuery {
  visible_to: string,
  tags?: { $all: string[] },
  $text?: { $search: string }
}

@Resolver(of => Post)
export class PostResolver {
  @Query(returns => [Post], { nullable: true })
  async posts(
    @Ctx() context: Context,
    @Info() info,
    @Arg('tags', type => [String], { nullable: true }) tags?: string[],
    @Arg('search', type => String, { nullable: true }) search?: string,
  ): Promise<PostMongo[] | Error> {

    // User must be logged in to search posts.
    if (!context.session.user) {
      return new Error('The user must be logged in');
    }

    const { _id } = context.session.user;

    const query: PostsQuery = { visible_to: _id };

    // Narrow down posts based on tags.
    if (tags) {
      query.tags = { $all: tags };
    }

    // Search posts based on text string.
    if (search) {
      query.$text = { $search: search };
    }

    // TO DO: need to add pagination.
    return context.posts_col.find(query, simpleProjection(info)).toArray();
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