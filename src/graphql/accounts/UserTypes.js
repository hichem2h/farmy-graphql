import { gql } from 'apollo-server';


const userTypes = gql`
  interface User {
    name : String
    address : String
    phone : String
    email : String
  }

  type UserAuth {
    token: String
  }

  type Farmer implements User {
    name : String
    address : String
    phone : String
    email : String
    cropType : String
  }

  type Expert implements User {
    name : String
    address : String
    phone : String
    email : String
    domain : String
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

export default userTypes;
