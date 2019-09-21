import ApolloClient from 'apollo-boost';
import user_resolvers from '../resolvers/user';
import user_schema from '../schema/user';
import { getUserToken } from '../resolvers/user';


export default function createApolloClient() {
  return new ApolloClient({
    uri: process.env.REACT_APP_API_URI,
    clientState: {
      resolvers: [user_resolvers],
      typeDefs: [user_schema]
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