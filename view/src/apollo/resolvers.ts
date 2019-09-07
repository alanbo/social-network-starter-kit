import { CognitoUserPool, CognitoUserAttribute, CognitoUser } from 'amazon-cognito-identity-js';
// import * as AWS from 'aws-sdk/global';

import { Resolvers, gql } from "apollo-boost";

var poolData = {
  UserPoolId: process.env.REACT_APP_USER_POOL_ID as string,
  ClientId: process.env.REACT_APP_CLIENT_ID as string
};

var userPool = new CognitoUserPool(poolData);
var cognitoUser = userPool.getCurrentUser();

console.log(process.env);

export const typeDefs = gql`
  type UserAuth {
    _id: ID!
    email: String
    given_name: String
    family_name: String
    nickname: String
    phone_number: String
    gender: String
    birthdate: String
  }

  input UserAuthInput {
    email: String!
    password: String!
    given_name: String
    family_name: String
    nickname: String
    phone_number: String
    gender: String
    birthdate: String
  }

  extend type Mutation {
    createAuthUser(data: UserAuthInput!): UserAuth
    confirmUser(code: String!): Boolean
  }
`;

// export const typeDefs = gql`
//   extend type Query {
//     isLoggedIn: Boolean!
//   }
// `;

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

    login: (_root, variables, { cache, getCacheKey }) => {
    },

    logout: (_root, variables, { cache, getCacheKey }) => {
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


  },
}

export default resolvers;