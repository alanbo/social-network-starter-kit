import { CognitoUserPool, CognitoUserAttribute, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
// import * as AWS from 'aws-sdk/global';

import { Resolvers, gql, InMemoryCache, ApolloClient } from "apollo-boost";

var poolData = {
  UserPoolId: process.env.REACT_APP_USER_POOL_ID as string,
  ClientId: process.env.REACT_APP_CLIENT_ID as string
};

var userPool = new CognitoUserPool(poolData);
var cognitoUser = userPool.getCurrentUser();

interface UserInput {
  email: string,
  password: string,
  given_name: string,
  family_name: string,
  nickname: string,
  phone_number: string,
  gender: string,
  birthdate: string
  [ix: string]: string
}

export const GET_USER = gql`
  query GetUser {
    getUser @client {
      _id
      email
      given_name
      family_name
      nickname
      phone_number
      gender
      birthdate
      email_verified
    }
  }
`;

interface UserInputVariables {
  data: UserInput
}

function userScaffold() {
  return {
    _id: '',
    email: '',
    given_name: null,
    family_name: null,
    nickname: null,
    phone_number: null,
    gender: null,
    birthdate: null,
    email_verified: null,
    __typename: 'UserAuth'
  }
}

// TO DO: add proper error handling.
const resolvers: Resolvers = {
  Mutation: {
    createAuthUser: async (_root, variables: UserInputVariables, { cache, getCacheKey }) => {
      const { email, password } = variables.data;

      const attributeList = Object.keys(variables.data)
        .filter(key => key !== 'password')
        .map(Name =>
          new CognitoUserAttribute({ Name, Value: variables.data[Name] }));

      userPool.signUp(email, password, attributeList, [], function (err, result) {
        if (err) {
          // TO DO: add user feedback
          console.log(err.message || JSON.stringify(err));
          return false;
        }

        cognitoUser = result!.user;
      });
      return null;
    },

    loginUser: (_root, variables: { email: string, password: string }, { cache, getCacheKey }) => {

      const { email, password } = variables;

      if (!cognitoUser) {
        const userData = {
          Username: email,
          Pool: userPool
        };

        cognitoUser = new CognitoUser(userData);
      }

      var authenticationData = {
        Username: email,
        Password: password,
      };
      var authenticationDetails = new AuthenticationDetails(authenticationData);

      return new Promise((resolve, reject) => {
        cognitoUser!.authenticateUser(authenticationDetails, {
          onSuccess: function (result) {
            // var accessToken = result.getAccessToken().getJwtToken();

            cognitoUser!.getUserAttributes((err, result) => {
              if (err) {
                reject(err);
                return;
              }

              const user_data: { [ix: string]: any } = userScaffold();

              result!.forEach(item => {
                const name = item.getName()
                const value = item.getValue();

                // turn sub value into _id
                const key = name === 'sub' ? '_id' : name;

                user_data[key] = value;
              });

              (cache as InMemoryCache).writeQuery({ query: GET_USER, data: { getUser: user_data } });

              resolve(user_data);
            });

            /* Use the idToken for Logins Map when Federating User Pools with identity pools or when passing through an Authorization Header to an API Gateway Authorizer*/
            // var idToken = result.idToken.jwtToken;
          },

          onFailure: function (err) {
            reject(err);
          },
        });
      });
    },

    logoutUser: (_root, variables, { client }) => {
      if (cognitoUser != null) {
        cognitoUser.signOut();
        console.log(client);
        (client as ApolloClient<any>).resetStore();
        return true;
      }

      return false;
    },

    confirmUser: (_root, variables: { code: string }, { cache, getCacheKey }) => {
      return new Promise((resolve, reject) => {
        if (cognitoUser) {
          cognitoUser.confirmRegistration(variables.code, true, function (err, result) {
            if (err) {
              reject(err);
            }

            resolve(true);
          });

        } else {
          reject(new Error('No user to confirm'));
        }
      });
    },

    resendConfirmationCode: () => {
      if (!cognitoUser) {
        return false;
      }

      return new Promise((resolve, reject) => {
        cognitoUser!.resendConfirmationCode(function (err, result) {
          if (err) {
            reject(err);
            return;
          }
          resolve(true);
        });
      });
    },

    changePassword: (__root, variables: { old_password: string, new_password: string }) => {
      if (!cognitoUser) {
        return false;
      }

      const { old_password, new_password } = variables;

      return new Promise((resolve, reject) => {
        cognitoUser!.changePassword(old_password, new_password, function (err, result) {
          if (err) {
            reject(err);
            return;
          }

          resolve(true);
          console.log('call result: ' + result);
        });
      });
    },

    forgotPasswordInit: (__root, variables: { email: string }) => {
      const { email } = variables;

      if (!cognitoUser) {
        const userData = {
          Username: email,
          Pool: userPool
        };

        cognitoUser = new CognitoUser(userData);
      }

      return new Promise((resolve, reject) => {
        cognitoUser!.forgotPassword({
          onFailure: () => resolve(false),
          onSuccess: () => resolve(true)
        });
      });
    },

    forgotPasswordConfirm: (__root, variables: { new_password: string, code: string }) => {
      const { new_password, code } = variables;

      if (!cognitoUser) {
        return false;
      }

      return new Promise((resolve, reject) => {
        cognitoUser!.confirmPassword(code, new_password, {
          onFailure: () => resolve(false),
          onSuccess: () => resolve(true)
        });
      });
    },
  },
  Query: {
    getUser: async () => {
      if (!cognitoUser) {
        console.log('The user is not logged in');
        return null;
      }

      try {
        await new Promise((resolve, reject) => cognitoUser!.getSession((err: Error, result: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }));

        const user = await new Promise((resolve, reject) => {
          cognitoUser!.getUserAttributes((err, result) => {
            if (err) {
              reject(err);
              return;
            }

            const user_data: { [ix: string]: any } = userScaffold();

            result!.forEach(item => {
              const name = item.getName()
              const value = item.getValue();

              // turn sub value into _id
              const key = name === 'sub' ? '_id' : name;

              user_data[key] = value;
            });

            resolve(user_data);
          });
        });

        return user
      } catch (err) {
        console.log(err);
        return null;
      }
    }
  }
}

export default resolvers;