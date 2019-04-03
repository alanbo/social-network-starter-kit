import "reflect-metadata";
import fs from 'fs';
import ApolloMongoTester from './util/serverSetup';
import { pickUserBasic } from './util';
import { USER, LOGIN, LOGOUT } from './graphql/user-queries';
import { ApolloQueryResult } from 'apollo-client';
import { UserQuery, Logout } from './graphql/operation-result-types';

const USERS_JSON = fs.readFileSync(`${__dirname}/mongo-data/users-social.json`).toString();
const USERS_DATA = JSON.parse(USERS_JSON);
const tester = new ApolloMongoTester(USERS_DATA, [], USERS_DATA[0]);

beforeAll(async () => {
  await tester.setup();
});

afterAll(async () => {
  await tester.teardown();
});

describe('"user" resolver: ', () => {
  it('It fetches basic user ', async () => {
    const { createdAt, email, first_name, last_name, gender } = USERS_DATA[0];
    const res: ApolloQueryResult<UserQuery> = await tester
      .login()
      .query({
        query: USER,
        variables: { email: USERS_DATA[0].email }
      });

    expect(res.data).toEqual({
      user: { createdAt, email, first_name, last_name, gender }
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


  it('Wont\'t allow other logged in user to query the user', async () => {
    const logged_user = USERS_DATA[1];
    const queried_user = USERS_DATA[0];

    const res = await tester
      .login(logged_user)
      .query({ query: USER, variables: { email: queried_user.email } });

    expect(res.data.user).toBeNull();
  });


  it('Will get basic info about friends', async () => {
    const { email, _id } = USERS_DATA[0];
    const res = await tester.login().query({ query: USER, variables: { email: USERS_DATA[0].email } });

    const match_obj = {
      email,
      _id,
      friends: USERS_DATA.slice(1, 6).map(pickUserBasic)
    };

    expect(res.data.user).toMatchObject(match_obj)
  });
});