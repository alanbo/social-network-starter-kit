import "reflect-metadata";
import fs from 'fs';
import ApolloMongoTester from './util/serverSetup';
import { pickUserBasic } from './util';
import { USER, USER_FRIENDS } from './graphql/user-queries';
import { ApolloQueryResult } from 'apollo-client';
import { UserQuery, GetUserFriends } from './graphql/operation-result-types';

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
});