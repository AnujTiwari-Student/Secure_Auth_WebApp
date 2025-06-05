import gql from "graphql-tag";

export const typeDefs = gql`#graphql

  type Query {
    _empty: String
  }

  type User {
    id: ID!
    name: String
    email: String
    password: String
    threads: [Thread]  
    createdAt: String 
  }

  input UserInput {
    name: String!
    email: String!
    password: String!
  }

  input UpdatePasswordInput {
    newPassword: String!
    confirmPassword: String!
   }
  
  type Thread {
    id: ID!
    title: String
    content: String
    author: User
    authorId: String
    createdAt: String
    updatedAt: String
  }

  type EmailVerificationResponse {
    success: Boolean!
    message: String
    error: String
  }

  type ResetPasswordResponse {
    success: Boolean!
    message: String
    error: String
  }

   type Mutation {
    createUser(data: UserInput!): User!
    emailVerification(token: String!): EmailVerificationResponse!
    resetPassword(token: String! , data: UpdatePasswordInput!): ResetPasswordResponse!
    twoFactorAuthentication(token: String!): EmailVerificationResponse!
   }
  
  `