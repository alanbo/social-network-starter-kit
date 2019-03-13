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

    const session_user = user_login_data as any;
    session_user.createdAt = new Date(user_login_data.createdAt);
    delete user_login_data.password;

    expect(tester.setUserSpy).toHaveBeenCalledTimes(1);
    expect(tester.setUserSpy).toHaveBeenCalledWith(session_user);
    expect(res.data.login._id).toEqual(user_login_data._id);
  });

  it('successfully logs out', async () => {
    const LOGOUT = `
      mutation {
        logout
      }`;

    const res = await tester.mutate({ mutation: LOGOUT });
    expect(tester.destroySessionSpy).toHaveBeenCalledTimes(1);
  });
});