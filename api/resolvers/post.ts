import { GraphQLResolveInfo } from 'graphql';
import uuid from 'uuid/v4';

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

import { PostInput, Post, PostInputUpdate } from '../schema/post';
import { Context } from '../index';
import simpleProjection from '../utils/simple-projection';
import { UserMongo } from './user';

import { UpdateQuery } from 'mongodb';

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
    @Info() info: GraphQLResolveInfo,
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

  @Mutation(returns => Post)
  async deletePost(
    @Ctx() context: Context,
    @Info() info: GraphQLResolveInfo,
    @Arg('id', type => String) id: string,
  ): Promise<PostMongo | Error> {

    const { session, posts_col } = context;

    if (!session.user) {
      return new Error('User must be logged in');
    }

    try {
      return posts_col.findOneAndDelete(
        { _id: id, user: session.user._id },
        { projection: simpleProjection(info) }
      ).then((result => result.value));
    } catch (e) {
      return e;
    }
  }

  @Mutation(returns => Post)
  async addPost(
    @Ctx() context: Context,
    @Info() info: GraphQLResolveInfo,
    @Arg('data', type => PostInput) data: PostInput,
  ): Promise<PostMongo | Error> {
    const { session, posts_col } = context;

    if (!session.user) {
      return new Error('User must be logged in');
    }

    const to_insert = { ...data, createdAt: new Date(), _id: uuid(), user: session.user._id };

    try {
      await posts_col.insertOne(to_insert);
    } catch (e) {
      return e;
    }

    return to_insert;
  }

  @Mutation(returns => Post)
  async updatePost(
    @Ctx() context: Context,
    @Info() info: GraphQLResolveInfo,
    @Arg('data', type => PostInputUpdate) data: PostInputUpdate,
  ): Promise<PostMongo | Error> {
    const { session, posts_col } = context;

    if (!session.user) {
      return new Error('User must be logged in');
    }

    const update_expr: UpdateQuery<PostMongo> = {};

    if (data.message) {
      update_expr.$set = { message: data.message };
    }

    // TO DO: Cannot use multiple update expressions on the same field.
    // Mongo db will throw error if deletes/adds/replaces overlap.
    // Think through if that is acceptable. 

    if (data.tags_replace) {
      update_expr.$set = { tags: data.tags_replace };
    }

    if (data.visible_to_replace) {
      update_expr.$set = { visible_to: data.visible_to_replace };
    }

    if (data.tags_add) {
      update_expr.$addToSet = { tags: { $each: data.tags_add } };
    }

    if (data.tags_delete) {
      update_expr.$pull = { tags: { $in: data.tags_delete } };
    }

    if (data.visible_to_add) {
      update_expr.$addToSet = { visible_to: { $each: data.visible_to_add } };
    }

    if (data.visible_to_delete) {
      update_expr.$pull = { visible_to: { $in: data.visible_to_delete } };
    }

    try {
      return posts_col.findOneAndUpdate(
        { _id: data._id, user: session.user._id },
        update_expr,
        { projection: simpleProjection(info), returnOriginal: false }
      ).then(result => result.value);
    } catch (e) {
      return e;
    }
  }
  // TO DO:
  // Add comment.
  // Remove comment. 

  @FieldResolver()
  user(
    @Root() post: Post,
    @Ctx() context: Context,
    @Info() info: GraphQLResolveInfo
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