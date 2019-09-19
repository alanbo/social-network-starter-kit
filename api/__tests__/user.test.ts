import "reflect-metadata";
import { Validator } from 'class-validator';
import fs from 'fs';
import { ApolloQueryResult } from 'apollo-client';

import ApolloMongoTester from './util/serverSetup';
import { pickUserBasic } from './util';
import { UserMongo } from '../resolvers/user';

import {
  USER,
  USER_FRIENDS,
  CREATE_USER,
  UPDATE_USER,
  DELETE_USER
} from './graphql/user-queries';

import {
  UserQuery,
  GetUserFriends,
  CreateUser,
  UserInput,
  UpdateUser,
  UpdateUserVariables,
  DeleteUser
} from './graphql/operation-result-types';

const validator = new Validator();
const USERS_JSON = fs.readFileSync(`${__dirname}/mongo-data/users-social.json`).toString();
const USERS_DATA = JSON.parse(USERS_JSON).map((user: any) => {
  user.createdAt = new Date(user.createdAt);

  return user;
});

const tester = new ApolloMongoTester(USERS_DATA, [], USERS_DATA[0]);

const NEW_USER_INPUT: UserInput = {
  email: 'sample@email.com',
  given_name: 'Rowen',
  family_name: 'Atkinson',
  phone_number: '+16017778687',
  gender: 'male',
  password: 'SamplePass123%4'
};

let new_user_id: string;

beforeAll(async () => {
  await tester.setup();
});

afterAll(async () => {
  await tester.teardown();
});

describe('"user" resolver: ', () => {
  it('It fetches basic user ', async () => {
    const { email, given_name, family_name, _id, gender, createdAt, phone_number } = USERS_DATA[0];
    const res: ApolloQueryResult<UserQuery> = await tester
      .login()
      .query({
        query: USER,
        variables: { email: USERS_DATA[0].email }
      });

    expect(res.data).toEqual({
      user: { email, given_name, family_name, _id, gender, createdAt: +createdAt, phone_number }
    })
  });


  it('Won\'t fetch user when the user is logged out', async () => {
    const res: ApolloQueryResult<UserQuery> = await tester
      .logout()
      .query({
        query: USER,
        variables: { email: USERS_DATA[0].email }
      });

    expect(res.data.user).toBeNull();
  });


  it('Will get basic info about friends', async () => {
    const res: ApolloQueryResult<GetUserFriends> = await tester
      .login()
      .query({ query: USER_FRIENDS, variables: { email: USERS_DATA[0].email } });

    const match_obj = {
      friends: USERS_DATA.slice(1, 6).map(pickUserBasic)
    };

    expect(res.data.user).toMatchObject(match_obj)
  });

  it('Creates a new user', async () => {
    const res: ApolloQueryResult<CreateUser> = await tester.logout().mutate({
      mutation: CREATE_USER,
      variables: { data: NEW_USER_INPUT }
    });

    new_user_id = res.data.createUser._id;

    expect(res.data.createUser.given_name).toBe(NEW_USER_INPUT.given_name);
    expect(res.data.createUser.given_name).toBe(NEW_USER_INPUT.given_name);
    expect(validator.isUUID(new_user_id)).toBeTruthy();

    const user: UserMongo = await tester.db.collection('users').findOne({ _id: new_user_id });

    expect(user.createdAt).toBeInstanceOf(Date);

    delete user.password;

    // checks if a new session is established
    expect(tester.setUserSpy).toHaveBeenCalledTimes(1);
    expect(tester.setUserSpy).toHaveBeenCalledWith(user);

    delete user.createdAt;

    const test_user = { _id: new_user_id, ...NEW_USER_INPUT };
    delete test_user.password;

    expect(user).toEqual(test_user);
  });

  it('Updates user data', async () => {
    const variables: UpdateUserVariables = {
      data: {
        given_name: 'Aldous',
        family_name: 'Huxley',
        gender: 'other',
        email: 'new@email.com',
        phone_number: '+16017778687'
      }
    };

    const res: ApolloQueryResult<UpdateUser> = await tester.mutate({
      mutation: UPDATE_USER,
      variables
    });

    const user = res.data.updateUser;
    delete user.createdAt;

    expect(user).toEqual({ _id: new_user_id, ...variables.data });

    const user_mongo: UserMongo = await tester.db.collection('users').findOne(
      { _id: new_user_id },
      {
        projection: {
          given_name: 1,
          family_name: 1,
          gender: 1,
          email: 1,
          phone_number: 1
        }
      }
    );

    expect(user_mongo).toEqual({ _id: new_user_id, ...variables.data });
  });

  it('Deletes a user', async () => {
    const res: ApolloQueryResult<DeleteUser> = await tester.mutate({
      mutation: DELETE_USER
    });

    expect(res.data.deleteUser._id).toBe(new_user_id);

    const user_mongo: UserMongo = await tester.db.collection('users').findOne(
      { _id: new_user_id }
    );

    expect(user_mongo).toBeFalsy();
  });
});