import "reflect-metadata";
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { MongoClient, Collection } from 'mongodb';
import * as express from 'express';
import * as session from 'express-session';
import { UserResolver } from './resolvers/user';

export interface Context {
  session: Express.Session,
  users_col: Collection<any>
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
    resolvers: [UserResolver],
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
      // add the user to the context
      const context: Context = {
        session: req.session,
        users_col: db.collection('users')
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