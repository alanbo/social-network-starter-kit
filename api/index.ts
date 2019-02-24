import { ApolloServer, gql, IResolvers } from 'apollo-server-express';
import { MongoClient } from 'mongodb';
import * as assert from 'assert';
import { readFileSync } from 'fs';
import * as express from 'express';
import R from 'ramda';
import simpleProjection from './utils/simple-projection';
import * as session from 'express-session';

const schema = readFileSync('./schema.graphql').toString('utf-8');
const { MONGODB_ADMINUSERNAME, MONGODB_ADMINPASSWORD } = process.env;

// Connection URL
const url = `mongodb://${MONGODB_ADMINUSERNAME}:${MONGODB_ADMINPASSWORD}@mongo:27017`;

// Database Name
const dbName = 'social';

// Create a new MongoClient
const client = new MongoClient(url);
let db;

// Use connect method to connect to the Server
client.connect(function (err) {
  assert.equal(null, err);
  console.log("Connected successfully to MongoDB server");

  db = client.db(dbName);
  // db.collection('users').findOne({}).then(console.log);
});

process.on('exit', (code) => {
  client.close();
  console.log(`About to exit with code: ${code}`);
});

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql(schema);

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
const resolvers = {
  Query: {
    user: (obj, args, context, info) => {
      const { email } = args;
      const session = context.session as Express.Session;

      console.log('user is: ', session.user);

      return db
        .collection('users')
        .findOne({ email }, simpleProjection(info))
        // large integer is not Int in grqphql, needs to be converted to string
        .then(user => Object.assign(user, { createdAt: user.createdAt.toString() }));
    }
  },

  Mutation: {
    login: async (_, args, context) => {
      const { email, password } = args;
      const session = context.session as Express.Session;

      try {
        const user = await db
          .collection('users')
          .findOne({ email, password });

        session.user = user;

        return user;
      } catch (e) {
        return e;
      }
    },
    logout: (_, __, context) => {
      const session = context.session as Express.Session;

      return (new Promise((resolve, reject) => {
        session.destroy(err => {
          if (err) {
            reject(err);
          } else {
            resolve(true);
          }
        });
      }));
    }
  }
};

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: {
    endpoint: '/api/',
    settings: {
      'request.credentials': 'same-origin'
    }
  },
  context: ({ req, res }) => {
    // add the user to the context
    return { session: req.session };
  },
});

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
// server.listen().then(({ url }) => {
//   console.log(`🚀  Server ready at ${url}`);
// });

// Additional middleware can be mounted at this point to run before Apollo.
var app = express()
var sess = {
  secret: process.env.AUTH_SECRET,
  cookie: { secure: false }
}

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}


app.use(session(sess));

server.applyMiddleware({ app, path: '/' });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);   
