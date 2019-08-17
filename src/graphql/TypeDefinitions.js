import { gql } from 'apollo-server';
import userTypes from './accounts/UserTypes';
import problemTypes from './problem/ProblemTypes';


const queryTypes = gql`
  type Query {
    problems(solvedByExpert:Boolean) : [Problem]
    problem(id:ID) : Problem
    me : User
  }

  type Mutation {
    register(user: NewUserInput): UserAuth
    login(email: String!, password: String!): UserAuth
    refresh(token: String!): UserAuth
    problemAdd(title: String!, description: String): Problem
  }
`;

const globalQuery = [problemTypes, userTypes, queryTypes];

export default globalQuery;
