import { gql } from 'apollo-server';


const problemTypes = gql`
  type Problem {
    id: ID
    title : String
    description : String
    farmer : Farmer
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
    expert : Expert
    disease : String
    description : String
  }
`;

export default problemTypes;
