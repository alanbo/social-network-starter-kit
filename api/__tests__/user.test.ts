import "reflect-metadata";
import fs from 'fs';
import USER_DATA from './user/data/user-data';
import ApolloMongoTester from './util/serverSetup';

const USER = fs.readFileSync(`${__dirname}/user/queries/user-basic-query.graphql`).toString();
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
});