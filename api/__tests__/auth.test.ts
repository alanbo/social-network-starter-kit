import "reflect-metadata";
import fs from 'fs';
import ApolloMongoTester from './util/serverSetup';
import { UserMongo } from '../resolvers/user';

const LOGIN = fs.readFileSync(`${__dirname}/user/queries/user-login-mutation.graphql`).toString();
const USERS_DATA: UserMongo[] = JSON.parse(fs.readFileSync(`${__dirname}/mongo-data/users-social.json`).toString());
const USERS_LOGIN_DATA = JSON.parse(fs.readFileSync(`${__dirname}/mongo-data/users-login-data.json`).toString());
const tester = new ApolloMongoTester(USERS_DATA, []);

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
        email: USERS_LOGIN_DATA[0].email,
        password: USERS_LOGIN_DATA[0].password
      }
    });

    const session_user = USERS_DATA[0];
    session_user.createdAt = new Date(session_user.createdAt);
    delete session_user.password;

    expect(tester.setUserSpy).toHaveBeenCalledTimes(1);
    expect(tester.setUserSpy).toHaveBeenCalledWith(session_user);
    expect(res.data.login._id).toEqual(session_user._id);
  });

  it('successfully logs out', async () => {
    const LOGOUT = `
      mutation {
        logout
      }`;

    const res = await tester.mutate({ mutation: LOGOUT });
    expect(tester.destroySessionSpy).toHaveBeenCalledTimes(1);
    expect(res.data.logout).toBe(true);
  });
});