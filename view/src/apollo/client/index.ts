import ApolloClient from 'apollo-boost';
import resolvers from '../resolvers';
import typeDefs from '../client-schema';
import { getUserToken } from '../resolvers';


export default function createApolloClient() {
  return new ApolloClient({
    uri: process.env.REACT_APP_API_URI,
    clientState: {
      resolvers,
      typeDefs
    },
    request: async (operation) => {
      const token = await getUserToken();

      operation.setContext({
        headers: {
          authorization: token ? `Bearer ${token}` : ''
        }
      })
    }
  });
}