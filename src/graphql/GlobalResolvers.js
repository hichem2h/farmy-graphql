import accountsResolvers from './accounts/Resolvers';
import problemResolvers from './problem/ProblemResolvers';


const globalResolvers = {
  Query: {
    problems: problemResolvers.problems,  
    problem: problemResolvers.problem,
    me: accountsResolvers.me,
  },

  Mutation: {
    register: accountsResolvers.register,
    login: accountsResolvers.login,
    refresh: accountsResolvers.refresh,
    problemAdd: problemResolvers.problemAdd,
  },

  User: accountsResolvers.User,
  Problem: problemResolvers.Problem,
};

export default globalResolvers;
