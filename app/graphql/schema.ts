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
  
  type Thread {
    id: ID!
    title: String
    content: String
    author: User
    authorId: String
    createdAt: String
    updatedAt: String
  }

   type Mutation {
    createUser(data: UserInput!): User
   }
  
  `