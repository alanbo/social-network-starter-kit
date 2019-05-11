import { GraphQLResolveInfo } from 'graphql';
import uuid from 'uuid/v4';
import { ID } from 'type-graphql';

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

import { PostInput, Post, PostInputUpdate, Comment } from '../schema/post';
import { Context } from '../index';
import simpleProjection from '../utils/simple-projection';
import { UserMongo } from './user';
import { UpdateQuery, FilterQuery } from 'mongodb';

export interface PostMongo extends PostInput {
  createdAt: Date,
  _id: string,
  comments?: Comment[]
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
    const posts = await context.posts_col.find(query)
      .sort({ createdAt: -1 })
      .toArray()

    return posts;
  };

  @Mutation(returns => Post)
  async deletePost(
    @Ctx() context: Context,
    @Info() info: GraphQLResolveInfo,
    @Arg('id', type => ID) id: string,
  ): Promise<PostMongo | Error> {

    const { session, posts_col } = context;

    if (!session.user) {
      return new Error('User must be logged in');
    }

    try {
      const post = await posts_col.findOneAndDelete(
        { _id: id, user: session.user._id },
        // TO DO: simple projection returns null here
        // find a fix or replacement
        // { projection: simpleProjection(info) }
      );

      if (!post.value) {
        throw new Error('The post doesn\'t exist');
      }

      return post.value;
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
    const { session, posts_col, users_col } = context;

    if (!session.user) {
      return new Error('User must be logged in');
    }

    const to_insert = { ...data, createdAt: new Date(), _id: uuid(), user: session.user._id };

    // if visible_to is not specified add all friends. 
    if (!to_insert.visible_to) {
      const { friends } = await users_col.findOne(
        { _id: session.user._id },
        { projection: { friends: 1, _id: 0 } }
      );

      to_insert.visible_to = friends;
    }

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
        { returnOriginal: false }
      ).then(result => result.value);
    } catch (e) {
      return e;
    }
  }

  @Mutation(returns => Comment)
  async addComment(
    @Ctx() context: Context,
    @Info() info: GraphQLResolveInfo,
    @Arg('post_id', type => ID) post_id: string,
    @Arg('message', type => String) message: string,
  ): Promise<Comment | Error> {
    const { session, posts_col } = context;

    if (!session.user) {
      return new Error('User must be logged in');
    }

    const { _id, first_name, last_name, email } = session.user;

    const comment: Comment = {
      _id: uuid(),
      createdAt: new Date(),
      message,
      user: {
        _id,
        first_name,
        last_name,
        email
      }
    }

    try {
      await posts_col
        .update(
          { _id: post_id, $or: [{ user: _id }, { visible_to: _id }] },
          { $push: { comments: comment } }
        );

      return comment;
    } catch (e) {
      return e;
    }
  }


  @Mutation(returns => Boolean)
  async updateComment(
    @Ctx() context: Context,
    @Info() info: GraphQLResolveInfo,
    @Arg('post_id', type => ID) post_id: string,
    @Arg('comment_id', type => ID) comment_id: string,
    @Arg('message', type => String) message: string,
  ): Promise<Boolean | Error> {
    const { session, posts_col } = context;

    if (!session.user) {
      return new Error('User must be logged in');
    }

    const { _id } = session.user;

    try {
      const query: FilterQuery<PostMongo> = {
        _id: post_id,
        // user is either owner of the post
        // or is a friend of the post owner
        $or: [{ user: _id }, { visible_to: _id }],
        comments: {
          $elemMatch: {
            _id: comment_id,
            'user._id': _id
          }
        }
      }

      await posts_col
        .update(
          query,
          { $set: { 'comments.$.message': message } }
        );

      return true;
    } catch (e) {
      return e;
    }
  }


  @Mutation(returns => ID)
  async removeComment(
    @Ctx() context: Context,
    @Info() info: GraphQLResolveInfo,
    @Arg('post_id', type => ID) post_id: string,
    @Arg('comment_id', type => ID) comment_id: string,
    @Arg('post_owner', type => Boolean, { nullable: true }) post_owner = false
  ): Promise<string | Error> {
    const { session, posts_col } = context;

    if (!session.user) {
      return new Error('User must be logged in');
    }

    const { _id } = session.user;

    // Post owner can delete any comment.
    let update_expr: UpdateQuery<PostMongo> = { $pull: { comments: { _id: comment_id } } };

    // Only author of the comment can delete it it not post owner.
    if (!post_owner) {
      update_expr = { $pull: { comments: { _id: comment_id, 'user._id': _id } } };
    }

    try {
      await posts_col
        .update(
          { _id: post_id, $or: [{ user: _id }, { visible_to: _id }] },
          update_expr
        );
      return comment_id;

    } catch (e) {
      return e;
    }
  }

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