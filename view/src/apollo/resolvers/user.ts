import { Resolvers, InMemoryCache, ApolloClient } from 'apollo-boost';
import { User } from '../types/user';
import { GET_USER } from '../queries/client/user';
import UserAuth, { UserInput } from '../../utils/userAuth';

export const user_auth = new UserAuth();

export interface GetUser {
  getUser: User
}

interface UserInputVariables {
  data: UserInput
}

// TO DO: add proper error handling.
const resolvers: Resolvers = {
  Mutation: {
    createAuthUser: async (_root, variables: UserInputVariables) => {

      try {
        await user_auth.createUser(variables.data);
        return true;

      } catch (e) {
        return false;
      }
    },

    loginUser: async (_root, variables: { email: string, password: string }, { cache }) => {
      const { email, password } = variables;

      try {
        await user_auth.loginUser(email, password);

        const user_data = await user_auth.getUserData();
        (cache as InMemoryCache).writeQuery({ query: GET_USER, data: { getUser: user_data } });

        return user_data;
      } catch (e) {
        return null;
      }
    },

    logoutUser: async (_, __, { client }) => {
      try {
        await user_auth.logoutUser();
        (client as ApolloClient<any>).resetStore();

        return false;

      } catch (e) {
        return true;
      }
    },

    confirmUser: async (_, variables: { code: string }) => {
      try {
        await user_auth.confirmUser(variables.code);
        return true;
      } catch (e) {
        return false;
      }
    },

    resendConfirmationCode: async () => {
      try {
        await user_auth.resendConfirmationCode();
        return true;
      } catch (e) {
        return false;
      }
    },

    changePassword: async (_, variables: { old_password: string, new_password: string }) => {
      const { old_password, new_password } = variables;
      try {
        await user_auth.changePassword(old_password, new_password);
        return true;

      } catch (e) {
        return false;
      }
    },

    forgotPasswordInit: async (_, variables: { email: string }) => {
      try {
        await user_auth.forgotPasswordInit(variables.email);
        return true;
      } catch (e) {
        return false;
      }
    },

    forgotPasswordConfirm: async (_, variables: { new_password: string, code: string }) => {
      const { new_password, code } = variables;
      try {
        await user_auth.forgotPasswordConfirm(new_password, code);
        return true;
      } catch (e) {
        return false;
      }
    },
  },
  Query: {
    getUser: async () => {
      try {
        const user_data = await user_auth.getUserData();
        return user_data;
      } catch (e) {
        return null;
      }
    }
  }
}

export default resolvers;