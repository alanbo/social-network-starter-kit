import "reflect-metadata";
import fs from 'fs';
import { user_login_data, login_credentials } from './user/data/user-login-data';
import ApolloMongoTester from './util/serverSetup';
import { pickUserBasic } from './util';

const LOGIN = fs.readFileSync(`${__dirname}/user/queries/user-login-mutation.graphql`).toString();
const tester = new ApolloMongoTester([user_login_data], []);

beforeAll(async () => {
  await tester.setup();
});

afterAll(async () => {
  await tester.teardown();
});

describe('Authentication, login and logout resolvers', () => {
  it('adds user to session object on successful login', async () => {
    const res = await tester.mutate({
      mutation: LOGIN,
      variables: {
        email: login_credentials.email,
        password: login_credentials.password
      }
    });

    expect(res.data.login._id).toEqual(user_login_data._id);
    expect(tester.setUserSpy).toHaveBeenCalledTimes(1);
  });
});