const { ApolloServer, gql } = require('apollo-server');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const fs = require('fs');
const R = require('ramda');
const simpleProjection = require('./utils/simple-projection');

const schema = fs.readFileSync('./schema.graphql').toString('utf-8');
const { MONGODB_ADMINUSERNAME, MONGODB_ADMINPASSWORD } = process.env;

// Connection URL
const url = `mongodb://${ MONGODB_ADMINUSERNAME }:${ MONGODB_ADMINPASSWORD }@mongo:27017`;

// Database Name
const dbName = 'social';

// Create a new MongoClient
const client = new MongoClient(url);
let db;

// Use connect method to connect to the Server
client.connect(function(err) {
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

      return db
        .collection('users')
        .findOne({ email }, simpleProjection(info))
        // large integer is not Int in grqphql, needs to be converted to string
        .then(user => Object.assign(user, { createdAt: user.createdAt.toString() }));
    }
  },
};

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: {
    endpoint: '/api/'
  }
});

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
