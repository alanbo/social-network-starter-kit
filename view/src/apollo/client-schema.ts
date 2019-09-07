import { gql } from 'apollo-boost';

export default gql`
  type UserAuth {
    _id: ID!
    email: String
    given_name: String
    family_name: String
    nickname: String
    phone_number: String
    gender: String
    birthdate: String
    email_verified: Boolean
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
    loginUser(email: String!, password: String!): UserAuth
    logoutUser: Boolean
  }
`;
