import { gql } from 'apollo-server-express';


const types = gql`
  
  type User {
    name : String
    address : String
    phone : String
    email : String
    role : String
    domain : String
    expertise : [String]
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

  input UpdateProfileInput {
    name : String
    address : String
    phone : String
    email : String
    role : String
    domain : String
    expertise : [String]
  }

`;

export default types;
