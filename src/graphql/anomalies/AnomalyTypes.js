import { gql } from 'apollo-server';


const types = gql`
  type Anomaly {
    id: ID
    title : String
    description : String
    farmer : User
    createdAt : String
    images : [Image]
    solution : Solution
  }

  type Image {
    path : String
  }

  type Solution {
    model : ModelSolution
    experts : [ExpertSolution]
  }

  type ModelSolution {
    disease : String
    confidence : Int
  }

  type ExpertSolution {
    expert : User
    disease : String
    description : String
    treatement: String
  }
`;

export default types;
