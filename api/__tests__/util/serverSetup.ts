import { createTestClient } from 'apollo-server-testing';
import { ApolloServer } from 'apollo-server';
import { UserResolver, UserMongo } from '../../resolvers/user';
import { PostResolver, PostMongo } from '../../resolvers/post';
import { buildSchema } from 'type-graphql';
import { MongoClient, Collection } from 'mongodb';
import { Db } from 'mongodb';

interface Context {
  session?: { user?: any, __user?: any, destroy: (callback: Function) => void },
  users_col: Collection<UserMongo>,
  posts_col: Collection<PostMongo>

}

interface QueryMutation {
  (opts: { query?: string, mutation?: string, variables?: { [ix: string]: any } }): Promise<any>
}

class ApolloMongoTester {
  private db: Db;
  private connection: Promise<MongoClient>;
  protected user: { [ix: string]: any };

  public getUserSpy: jest.SpyInstance<any, []>;
  public setUserSpy: jest.SpyInstance<void, any[]>;
  public destroySessionSpy: jest.SpyInstance<void, [Function]>;

  query: QueryMutation;
  mutate: QueryMutation;


  constructor(
    readonly users_data: any[] = [],
    readonly posts_data: any[] = [],
    protected user_default?: { [ix: string]: any }
  ) {
    this.connection = MongoClient.connect(
      (global as any).__MONGO_URI__
    );

    this.connection.then(connection => {
      this.db = connection.db(
        (global as any).__MONGO_DB_NAME__
      );
    });
  }

  login(user?: { [ix: string]: any }) {
    this.user = user || this.user_default;

    return this;
  }

  logout() {
    this.user = undefined;

    return this;
  }

  async setup() {
    await this.connection;

    if (this.users_data.length) {
      await this.db.collection('users').insertMany(this.users_data);
    }

    if (this.posts_data.length) {
      await this.db.collection('posts').insertMany(this.posts_data);
    }

    const schema = await buildSchema({
      resolvers: [UserResolver, PostResolver],
      dateScalarMode: 'timestamp'
    });


    const config = {
      schema,
      context: () => {
        const context: Context = {
          users_col: this.db.collection('users'),
          posts_col: this.db.collection('posts')
        }

        const user = this.user;

        context.session = {
          __user: user,

          destroy(callback) {
            callback();
          },

          get user() {
            return this.__user;
          },

          set user(val) {
            this.__user = val;
          }
        }

        this.getUserSpy = jest.spyOn(context.session, 'user', 'get');
        this.setUserSpy = jest.spyOn(context.session, 'user', 'set');
        this.destroySessionSpy = jest.spyOn(context.session, 'destroy');

        return context;
      },
    }

    // create a test server to test against, using our production typeDefs,
    // resolvers, and dataSources.
    const server = new ApolloServer(config);
    // use the test server to create a query function
    const test_client = await createTestClient(server as any);

    this.query = test_client.query as QueryMutation;
    this.mutate = test_client.mutate as QueryMutation;
  }

  async teardown() {
    const connection = await this.connection;
    await this.db.collection('users').deleteMany({ _id: { $in: this.users_data.map(user => user._id) } });
    await this.db.collection('posts').deleteMany({ _id: { $in: this.posts_data.map(post => post._id) } });
    await connection.close();
  }
}

export default ApolloMongoTester;