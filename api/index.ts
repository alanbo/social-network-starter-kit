import "reflect-metadata";
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { MongoClient, Collection, Db } from 'mongodb';
import express from 'express';
import session from 'express-session';
import { UserResolver, UserMongo } from './resolvers/user';
import { PostResolver, PostMongo } from './resolvers/post';
import { User } from './schema/user';
import cors from 'cors';

interface UserSession extends Express.Session {
  // TO DO: user object needs to be trimmed. Too much data in UserMongo. 
  user?: UserMongo
}

export interface Context {
  session: UserSession,
  users_col: Collection<UserMongo>,
  posts_col: Collection<PostMongo>,
}

const { MONGO_URI } = process.env;

// Database Name
const dbName = 'social';
let backoff = 1000;

// function that use expotential backoff to connect to mongo
async function mongoConnect(client: MongoClient) {
  // Use connect method to connect to the Server
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB server");
  } catch (err) {
    // console.log(err);
    // process.exit(1);
    await new Promise(resolve => {
      setTimeout(async () => {
        await mongoConnect(client);
        resolve();
      }, backoff);

      backoff *= 2;
    });
  }
}

async function bootstrap() {

  // Create a new MongoClient
  const client = new MongoClient(MONGO_URI, { useNewUrlParser: true });
  await mongoConnect(client);

  const db = client.db(dbName);

  process.on('exit', (code) => {
    client.close();
    console.log(`About to exit with code: ${code}`);
  });

  const schema = await buildSchema({
    resolvers: [UserResolver, PostResolver],
    dateScalarMode: 'timestamp'
  });

  const server = new ApolloServer({
    schema,
    playground: {
      endpoint: '/api/',
      settings: {
        'request.credentials': 'same-origin'
      }
    },
    context: ({ req, res }) => {
      // add the user collection to the context
      const context: Context = {
        session: req.session,
        users_col: db.collection('users'),
        posts_col: db.collection('posts')
      }

      return context;
    },
  });

  // Additional middleware can be mounted at this point to run before Apollo.
  var app = express()

  // TO DO: Make it specific
  app.options('*', cors())

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
};

bootstrap();