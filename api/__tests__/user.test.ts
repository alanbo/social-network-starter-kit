import "reflect-metadata";
const { createTestClient } = require('apollo-server-testing');
import { ApolloServer } from 'apollo-server';
import { UserResolver, UserMongo } from '../resolvers/user';
import { PostResolver, PostMongo } from '../resolvers/post';
import { buildSchema } from 'type-graphql';
import { USER } from './post-gql/user';
import { MongoClient, Db } from 'mongodb';
import { gql } from 'apollo-server'

const USER_DATA = {
  _id: "7b62c3ae-103e-4b83-b876-7fa9bcaef749",
  email: "brando61@hotmail.com",
  password: "$2b$10$Mfg8ytw4L9SUZ8cbf7J/l..9rc2CbbhUu.Asvo1PiIf.NWnIuI6d.",
  createdAt: 1546200349387,
  first_name: "Giovani",
  last_name: "Watsica",
  friends: [
    "35712e35-084c-43ac-a032-ffa12016ce16",
    "510ff697-5001-46d7-9091-bc2cfc57d859"
  ],
  friend_requests: [
    "c708293d-06bc-42a2-a645-f3659851ae22",
    "271b4f7f-b57a-4846-95da-33cbfdddb400",
  ],
  phone_number: "298-652-0619 x09600",
  gender: "male"
}

let connection: MongoClient;
let db: Db;

beforeAll(async () => {
  connection = await MongoClient.connect(
    (global as any).__MONGO_URI__
  );

  db = await connection.db(
    (global as any).__MONGO_DB_NAME__
  );

  await db.collection('users').insertOne(USER_DATA);
  const example = await db.collection('users').findOne({});
  console.log(example);
});

afterAll(async () => {
  await connection.close();
});


it('It fetches basic user', async () => {
  const schema = await buildSchema({
    resolvers: [UserResolver, PostResolver],
    dateScalarMode: 'timestamp'
  });

  // create a test server to test against, using our production typeDefs,
  // resolvers, and dataSources.
  const server = new ApolloServer({
    schema,
    context: () => ({
      session: {
        user: USER_DATA
      },
      users_col: db.collection('users'),
      posts_col: {}
    }),
  });

  // use the test server to create a query function
  const { query } = createTestClient(server);

  // run query against the server and snapshot the output
  const res = await query({ query: gql(USER), variables: { email: USER_DATA.email } });

  expect(res.data).toEqual({
    user: {
      createdAt: 1546200349387,
      email: "brando61@hotmail.com",
      first_name: "Giovani",
      gender: "male",
      last_name: "Watsica"
    }
  })
});