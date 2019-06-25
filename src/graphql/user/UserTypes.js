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
`;

export default userTypes;
