// @flow
import userResolvers from './user/UserResolvers';
import problemResolvers from './problem/ProblemResolvers';


const globalResolvers = {
  Query: {
    problems: problemResolvers.problems,  
    problem: problemResolvers.problem,
    me: userResolvers.me,
  },

  Mutation: {
    register: userResolvers.register,
    login: userResolvers.login,
    problemAdd: problemResolvers.problemAdd,
  },

  User: userResolvers.User,
  Problem: problemResolvers.Problem,
};

export default globalResolvers;
