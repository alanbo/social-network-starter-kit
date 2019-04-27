import "reflect-metadata";
import fs from 'fs';
import ApolloMongoTester from './util/serverSetup';
import { UserMongo } from '../resolvers/user';
import { PostMongo } from '../resolvers/post';
import { ApolloQueryResult } from 'apollo-client';

import {
  GetPosts,
  AddPost,
  PostInput,
  AddComment,
  RemoveComment,
  DeletePost,
  CommentsFragment_comments,
  AddCommentVariables,
  RemoveCommentVariables,
  DeletePostVariables
} from './graphql/operation-result-types';

import {
  POSTS,
  ADD_POST,
  ADD_COMMENT,
  REMOVE_COMMENT,
  DELETE_POST
} from './graphql/post-queries';

import { Validator } from 'class-validator';

const validator = new Validator();

const USERS_DATA: UserMongo[] = JSON.parse(fs.readFileSync(`${__dirname}/mongo-data/users-social.json`).toString()).map((user: any) => {
  user.createdAt = new Date(user.createdAt);

  return user;
});

const POSTS_DATA: PostMongo[] = JSON.parse(fs.readFileSync(`${__dirname}/mongo-data/posts-social.json`).toString()).map((post: any) => {
  post.createdAt = new Date(post.createdAt);

  post.comments.forEach((comment: any) => {
    comment.createdAt = new Date(comment.createdAt);
  })

  return post;
});

const USERS_LOGIN_DATA = JSON.parse(fs.readFileSync(`${__dirname}/mongo-data/users-login-data.json`).toString());

const tester = new ApolloMongoTester(USERS_DATA, POSTS_DATA, USERS_DATA[0]);

function getUserBasic(user: UserMongo) {
  const { _id, email, first_name, last_name } = user;

  return { _id, email, first_name, last_name };
}

const NEW_POST_INPUT: PostInput = {
  message: 'a sample message',
  tags: ['zz44x']
}

let id: string;
let createdAt: number;
let comment_data: CommentsFragment_comments;

beforeAll(async () => {
  await tester.setup();
});

afterAll(async () => {
  await tester.teardown();
});

describe('Basic post operations', () => {
  it('Gets the list of posts visible to the user', async () => {
    const res: ApolloQueryResult<GetPosts> = await tester.login().query({ query: POSTS });

    const { data: { posts } } = res;

    const visible_posts = POSTS_DATA
      .filter(post => {
        return post.visible_to.includes(USERS_DATA[0]._id);
      })
      .sort((a, b) => +b.createdAt - +a.createdAt);

    expect(posts).toHaveLength(visible_posts.length);
    expect(posts.map(p => p._id)).toEqual(visible_posts.map(p => p._id));
  });

  it('Adds a new post and finds it based on tags', async () => {
    const res: ApolloQueryResult<AddPost> = await tester.mutate({
      mutation: ADD_POST,
      variables: { data: NEW_POST_INPUT }
    });

    id = res.data.addPost._id;
    createdAt = res.data.addPost.createdAt;

    expect(res.data.addPost.message).toBe(NEW_POST_INPUT.message);
    expect(res.data.addPost.tags).toEqual(NEW_POST_INPUT.tags);
    expect(validator.isUUID(id)).toBeTruthy();
  });

  it('Finds posts based on tags', async () => {
    // Queries the post added in the previous test
    const res2: ApolloQueryResult<GetPosts> = await tester
      .logout()
      // login as friend to see the post
      .login(USERS_DATA[1])
      .query({
        query: POSTS,
        variables: {
          tags: NEW_POST_INPUT.tags
        }
      });

    expect(res2.data.posts).toHaveLength(1);
    expect(res2.data.posts[0]).toEqual({
      _id: id,
      ...NEW_POST_INPUT,
      user: getUserBasic(USERS_DATA[0]),
      comments: null,
      createdAt
    });
  });

  it('Adds a comment to a post', async () => {
    const variables: AddCommentVariables = {
      message: 'sample comment',
      post_id: id
    }

    const res: ApolloQueryResult<AddComment> = await tester
      .mutate({
        mutation: ADD_COMMENT,
        variables
      });

    const comment = res.data.addComment;

    expect(validator.isUUID(comment._id)).toBeTruthy();
    expect(typeof comment.createdAt).toBe('number');

    const the_post: PostMongo = await tester.db.collection('posts').findOne({ _id: id });
    const the_post_comment = the_post.comments[the_post.comments.length - 1];

    comment_data = {
      _id: comment._id,
      user: getUserBasic(USERS_DATA[1]),
      message: variables.message,
      createdAt: new Date(comment.createdAt)
    };

    expect(the_post_comment).toEqual(comment_data);
  });

  it('Removes a comment from a post', async () => {
    const variables: RemoveCommentVariables = {
      comment_id: comment_data._id,
      post_id: id
    }

    const res: ApolloQueryResult<RemoveComment> = await tester
      .mutate({
        mutation: REMOVE_COMMENT,
        variables
      });

    const comment_id = res.data.removeComment;
    expect(validator.isUUID(comment_id)).toBeTruthy();


    const the_post: PostMongo = await tester.db.collection('posts').findOne({ _id: id });
    expect(the_post.comments).not.toContain(comment_data);

  });

  it('Removes a post', async () => {
    const variables: DeletePostVariables = {
      id
    };

    // the user is not an owner of the post
    const res: ApolloQueryResult<DeletePost> = await tester
      .mutate({
        mutation: DELETE_POST,
        variables
      });

    // only owner can delete post
    expect(res.data).toBeFalsy();

    // logs in as a post owner
    const res2: ApolloQueryResult<DeletePost> = await tester
      .logout()
      .login(USERS_DATA[0])
      .mutate({
        mutation: DELETE_POST,
        variables
      });

    expect(res2.data.deletePost._id).toEqual(id);

    const the_post: PostMongo = await tester.db.collection('posts').findOne({ _id: id });

    // the post is deleted
    expect(the_post).toBeFalsy();

  });
});
