import "reflect-metadata";
import fs from 'fs';
import USER_DATA from './user/data/user-data';
import ApolloMongoTester from './util/serverSetup';
import { pickUserBasic } from './util';

const USER = fs.readFileSync(`${__dirname}/user/queries/user-basic-query.graphql`).toString();
const USER_FRIENDS = fs.readFileSync(`${__dirname}/user/queries/user-friends-query.graphql`).toString();
const tester = new ApolloMongoTester(USER_DATA, [], USER_DATA[0]);

beforeAll(async () => {
  await tester.setup();
});

afterAll(async () => {
  await tester.teardown();
});

describe('"user" resolver: ', () => {
  it('It fetches basic user ', async () => {
    const { createdAt, email, first_name, last_name, gender } = USER_DATA[0];
    const res = await tester.login().query({ query: USER, variables: { email: USER_DATA[0].email } });

    expect(res.data).toEqual({
      user: { createdAt, email, first_name, last_name, gender }
    })
  });


  it('Won\'t fetch user when the user is logged out', async () => {
    const res = await tester.logout().query({ query: USER, variables: { email: USER_DATA[0].email } });

    expect(res.data.user).toBeNull();
  });


  it('Wont\'t allow other logged in user to query the user', async () => {
    const logged_user = USER_DATA[1];
    const queried_user = USER_DATA[0];

    const res = await tester
      .login(logged_user)
      .query({ query: USER, variables: { email: queried_user.email } });

    expect(res.data.user).toBeNull();
  });


  it('Will get basic info about friends', async () => {
    const { email, _id } = USER_DATA[0];
    const res = await tester.login().query({ query: USER_FRIENDS, variables: { email: USER_DATA[0].email } });

    const friend1 = pickUserBasic(USER_DATA[1]);
    const friend2 = pickUserBasic(USER_DATA[2]);

    expect(res.data.user).toMatchObject({
      email,
      _id,
      friends: [
        friend1,
        friend2
      ]
    })
  });
});