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
    register(user: NewUserInput!): UserAuth
    login(email: String!, password: String!): UserAuth
    refresh(token: String!): UserAuth

    anomalyAdd(anomaly: NewAnomalyInput!): Anomaly
    solutionAdd(id: ID!, solution: NewExpertSolutioninput!): Boolean
  }
`;

const globalQuery = [anomalyTypes, userTypes, queryTypes];

export default globalQuery;
