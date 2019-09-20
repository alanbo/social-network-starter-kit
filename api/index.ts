require('dotenv').config();

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
import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';

// @ts-ignore
import jwkToPem from 'jwk-to-pem';

const { USER_POOL_ID, AWS_REGION } = process.env;

const JWT_REGEX = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;
const jwk_url = `https://cognito-idp.${AWS_REGION}.amazonaws.com/${USER_POOL_ID}/.well-known/jwks.json`;
let pem: string;
// var pem = jwkToPem(jwk);

interface UserSession extends Express.Session {
  // TO DO: user object needs to be trimmed. Too much data in UserMongo. 
  user?: UserMongo
}

// Cognito Access Token
interface UserCognito {
  sub: '61dbb80e-a681-49e2-89c2-e01ae7c96439',
  email_verified: boolean,
  iss: string,
  'cognito:username': string,
  email: string,
  given_name?: string,
  family_name?: string,
  nickname?: string,
  phone_number?: string,
  gender?: string,
  birthdate?: string,
  aud: string,
  event_id: string,
  token_use: string,
  auth_time: number,
  exp: number,
  iat: number,
}

export interface Context {
  session: UserSession,
  users_col: Collection<UserMongo>,
  posts_col: Collection<PostMongo>,
  user: UserCognito
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
  const jwk = await fetch(jwk_url).then(result => result.json());
  pem = jwkToPem(jwk.keys[0]);

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
        posts_col: db.collection('posts'),
        user: res.locals.user
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

  app.use((req, res, next) => {
    const bearer_token = (req.header('authorization') || '').replace('Bearer ', '');

    // https://docs.aws.amazon.com/en_pv/cognito/latest/developerguide/amazon-cognito-user-pools-using-tokens-verifying-a-jwt.html
    if (!bearer_token.match(JWT_REGEX)) {
      next();
      // res.sendStatus(400);
      return;
    }

    // TO DO: preperly verify claim as per documentation
    jwt.verify(bearer_token, pem, { algorithms: ['RS256'] }, function (err, decodedToken) {
      if (err) {
        next();
        // res.sendStatus(400);
        return;
      }

      if (decodedToken) {
        res.locals.user = decodedToken;
      }

      next();
      return;
    });
  });


  // app.use(session(sess));

  server.applyMiddleware({ app, path: '/' });

  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
};

bootstrap();