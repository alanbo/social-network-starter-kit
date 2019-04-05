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
  CreateUserVariables,
  UserInput,
  UpdateUser,
  UpdateUserVariables,
  DeleteUser
} from './graphql/operation-result-types';

import { User } from "../schema/user";

const validator = new Validator();
const USERS_JSON = fs.readFileSync(`${__dirname}/mongo-data/users-social.json`).toString();
const USERS_DATA = JSON.parse(USERS_JSON);
const tester = new ApolloMongoTester(USERS_DATA, [], USERS_DATA[0]);

const NEW_USER_INPUT: UserInput = {
  email: 'sample@email.com',
  first_name: 'Rowen',
  last_name: 'Atkinson',
  phone_number: '+16047293087',
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
    const { email, first_name, last_name, _id } = USERS_DATA[0];
    const res: ApolloQueryResult<UserQuery> = await tester
      .login()
      .query({
        query: USER,
        variables: { email: USERS_DATA[0].email }
      });

    expect(res.data).toEqual({
      user: { email, first_name, last_name, _id }
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

    expect(res.data.createUser.first_name).toBe(NEW_USER_INPUT.first_name);
    expect(res.data.createUser.first_name).toBe(NEW_USER_INPUT.first_name);
    expect(validator.isUUID(new_user_id)).toBeTruthy();

    const user: UserMongo = await tester.db.collection('users').findOne({ _id: new_user_id });

    expect(user.createdAt).toBeInstanceOf(Date);

    delete user.createdAt;
    delete user.password;

    const test_user = { _id: new_user_id, ...NEW_USER_INPUT };
    delete test_user.password;

    expect(user).toEqual(test_user);
  });

  it('Updates user data', async () => {

  });

  it('Deletes a user', async () => {

  });
});