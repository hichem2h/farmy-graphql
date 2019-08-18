import { gql } from 'apollo-server';


const types = gql`
  type User {
    name : String
    address : String
    phone : String
    email : String
    role : String
    domain : String
  }

  type UserAuth {
    token: String
  }

  input NewUserInput {
    name : String!
    email : String!
    password: String!
    address : String!
    phone : String!
    role: String!
    domain : String!
  }

`;

export default types;
