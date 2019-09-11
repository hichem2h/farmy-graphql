import { gql } from 'apollo-server';
import userTypes from './accounts/UserTypes';
import anomalyTypes from './anomalies/AnomalyTypes';


const queryTypes = gql`
  type Query {
    me : User

    anomalies(solved:Boolean) : [Anomaly]
    anomaly(id:ID) : Anomaly
  }

  type Mutation {
    register(user: NewUserInput): UserAuth
    login(email: String!, password: String!): UserAuth
    refresh(token: String!): UserAuth

    anomalyAdd(title: String!, description: String): Anomaly
    solutionAdd(id: String!,solution:inputExpertSolution!): Boolean
  }
`;

const globalQuery = [anomalyTypes, userTypes, queryTypes];

export default globalQuery;
