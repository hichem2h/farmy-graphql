import accountsResolvers from './accounts/Resolvers';
import anomaliesResolvers from './anomalies/Resolvers';


const globalResolvers = {
  Query: {
    me: accountsResolvers.me,

    anomalies: anomaliesResolvers.anomalies,  
    anomaly: anomaliesResolvers.anomaly,

    notifications: anomaliesResolvers.notifications,
  },

  Mutation: {
    register: accountsResolvers.register,
    login: accountsResolvers.login,
    refresh: accountsResolvers.refresh,
    updateProfile: accountsResolvers.updateProfile,

    addAnomaly: anomaliesResolvers.addAnomaly,
    addSolution: anomaliesResolvers.addSolution,

    markAsSeen: anomaliesResolvers.markAsSeen,
  },

  Subscription: {
    anomalyAdded: anomaliesResolvers.anomalyAdded,
    solutionAdded: anomaliesResolvers.solutionAdded,
  },

  User: accountsResolvers.User,
  Anomaly: anomaliesResolvers.Anomaly,
};

export default globalResolvers;
