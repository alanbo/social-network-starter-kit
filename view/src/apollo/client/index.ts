import ApolloClient from 'apollo-boost';
import user_resolvers from '../resolvers/user';
import { user_auth } from '../resolvers/user';
import { loader } from 'graphql.macro';

const user_schema = loader('../schema/user.graphql');


export default function createApolloClient() {
  return new ApolloClient({
    uri: process.env.REACT_APP_API_URI,
    clientState: {
      resolvers: [user_resolvers],
      typeDefs: [user_schema]
    },
    request: async (operation) => {
      const token = await user_auth.getUserToken();

      operation.setContext({
        headers: {
          authorization: token ? `Bearer ${token}` : ''
        }
      })
    }
  });
}