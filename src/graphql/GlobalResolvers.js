import accountsResolvers from './accounts/Resolvers';
import anomaliesResolvers from './anomalies/Resolvers';


const globalResolvers = {
  Query: {
    me: accountsResolvers.me,

    anomalies: anomaliesResolvers.anomalies,  
    anomaly: anomaliesResolvers.anomaly,
  },

  Mutation: {
    register: accountsResolvers.register,
    login: accountsResolvers.login,
    refresh: accountsResolvers.refresh,

    addAnomaly: anomaliesResolvers.addAnomaly,
    addSolution: anomaliesResolvers.addSolution,
  },

  User: accountsResolvers.User,
  Anomaly: anomaliesResolvers.Anomaly,
};

export default globalResolvers;
