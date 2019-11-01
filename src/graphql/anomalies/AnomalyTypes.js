import { gql } from 'apollo-server-express';


const types = gql`
  type Anomaly {
    id: ID
    title: String
    description: String
    farmer: User
    createdAt: String
    images: [String]
    solution: Solution
  }

  type Solution {
    model: ModelSolution
    experts: [ExpertSolution]
  }

  type ModelSolution {
    diseases: [String]
    confidence: Float
  }

  type ExpertSolution {
    expert: User
    diseases: [String]
    description: String
    treatment: String
  }

  input NewAnomalyInput {
    images: [Upload!]
    title: String!
    description: String!
  }

  input NewExpertSolutioninput {
    diseases: [String!]!
    description: String
    treatment: String
  }
`;

export default types;
