import { gql } from 'apollo-server';
import userTypes from './user/UserTypes';
import problemTypes from './problem/ProblemTypes';


const queryTypes = gql`
  type Query {
    problems(solvedByExpert:Boolean) : [Problem]
    problem(id:ID) : Problem
    me : User
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): UserAuth
    login(email: String!, password: String!): UserAuth
    problemAdd(title: String!, description: String): Problem
  }
`;

const globalQuery = [problemTypes, userTypes, queryTypes];

export default globalQuery;
