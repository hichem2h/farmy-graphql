import { gql } from 'apollo-server-express';
import userTypes from './accounts/UserTypes';
import anomalyTypes from './anomalies/AnomalyTypes';


const queryTypes = gql`
  type Query {
    me : User

    anomalies(solved:Boolean) : [Anomaly]
    anomaly(id:ID) : Anomaly

    notifications : [Anomaly]
  }

  type Mutation {
    register(user: NewUserInput!): UserAuth
    login(email: String!, password: String!): UserAuth
    refresh(token: String!): UserAuth
    updateProfile(profile: UpdateProfileInput): UpdateProfileResponse

    addAnomaly(anomaly: NewAnomalyInput!): Anomaly
    addSolution(id: ID!, solution: NewExpertSolutioninput!): Anomaly

    markAsSeen(id:ID!): Boolean
  }

  type Subscription {
    anomalyAdded: Anomaly
    solutionAdded: Anomaly
  }
`;

const globalQuery = [anomalyTypes, userTypes, queryTypes];

export default globalQuery;
