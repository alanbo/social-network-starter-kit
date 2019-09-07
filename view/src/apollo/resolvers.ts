import { CognitoUserPool, CognitoUserAttribute, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
// import * as AWS from 'aws-sdk/global';

import { Resolvers, gql } from "apollo-boost";

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

interface UserInputVariables {
  data: UserInput
}

const resolvers: Resolvers = {
  Mutation: {
    createAuthUser: (_root, variables: UserInputVariables, { cache, getCacheKey }) => {
      const { email, password } = variables.data;

      const attributeList = Object.keys(variables.data)
        .filter(key => key !== 'password')
        .map(Name =>
          new CognitoUserAttribute({ Name, Value: variables.data[Name] }));

      userPool.signUp(email, password, attributeList, [], function (err, result) {
        if (err) {
          // TO DO: add user feedback
          console.log(err.message || JSON.stringify(err));
          return;
        }

        cognitoUser = result!.user;
        console.log(cognitoUser);
        console.log('user name is ' + cognitoUser.getUsername());
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

              const user_data: { [ix: string]: any } = {};

              result!.forEach(item => {
                const name = item.getName()
                const value = item.getValue();

                // turn sub value into _id
                const key = name === 'sub' ? '_id' : name;

                user_data[key] = value;
              });

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

    logoutUser: (_root, variables, { cache, getCacheKey }) => {
      if (cognitoUser != null) {
        cognitoUser.signOut();
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
    }
  },
}

export default resolvers;