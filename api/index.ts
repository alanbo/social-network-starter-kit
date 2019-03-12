import "reflect-metadata";
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { MongoClient, Collection, Db } from 'mongodb';
import express from 'express';
import session from 'express-session';
import { UserResolver, UserMongo } from './resolvers/user';
import { PostResolver, PostMongo } from './resolvers/post';
import { User } from './schema/user';

interface UserSession extends Express.Session {
  // TO DO: user object needs to be trimmed. Too much data in UserMongo. 
  user?: UserMongo
}

export interface Context {
  session: UserSession,
  users_col: Collection<UserMongo>,
  posts_col: Collection<PostMongo>,
}

const { MONGODB_ADMINUSERNAME, MONGODB_ADMINPASSWORD } = process.env;

// Connection URL
const url = `mongodb://${MONGODB_ADMINUSERNAME}:${MONGODB_ADMINPASSWORD}@mongo:27017`;

// Database Name
const dbName = 'social';

async function bootstrap() {

  // Create a new MongoClient
  const client = new MongoClient(url);

  // Use connect method to connect to the Server
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB server");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }

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