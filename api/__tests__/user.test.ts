import "reflect-metadata";
const { createTestClient } = require('apollo-server-testing');
import { ApolloServer } from 'apollo-server';
import { UserResolver, UserMongo } from '../resolvers/user';
import { PostResolver, PostMongo } from '../resolvers/post';
import { buildSchema } from 'type-graphql';
import { USER } from './post-gql/user';
import { MongoClient, Db } from 'mongodb';

let connection: MongoClient;
let db: Db;

beforeAll(async () => {
  connection = await MongoClient.connect(
    (global as any).__MONGO_URI__
  );
  db = await connection.db(
    (global as any).__MONGO_DB_NAME__
  );
});

afterAll(async () => {
  await connection.close();
  // await (db as any).close();
});


it('fetches single launch', async () => {
  const schema = await buildSchema({
    resolvers: [UserResolver, PostResolver],
    dateScalarMode: 'timestamp'
  });

  // create a test server to test against, using our production typeDefs,
  // resolvers, and dataSources.
  const server = new ApolloServer({
    schema,
    context: () => ({ user: { id: 1, email: 'a@a.a' } }),
  });

  // use the test server to create a query function
  const { query } = createTestClient(server);

  // run query against the server and snapshot the output
  const res = await query({ query: USER, variables: { id: 1 } });
  expect(res).toMatchSnapshot();
});