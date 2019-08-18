import { AuthenticationError, ForbiddenError } from 'apollo-server'
import AnomalyModel from './AnomalyModel';


const resolvers = {
    Anomaly: {

    },

    anomalies: (obj, args, context) => {
        const { user } = context;

        if (!user) {
            throw new AuthenticationError('Unauthenticated');
        }

        const anomalies = AnomalyModel.getAnomalies(user)
        return anomalies;
    },

    anomaly: (obj, args, context) => {
        const { id } = args
        const { user } = context;

        if (!user) {
            throw new AuthenticationError('Unauthenticated');
        }

        const anomaly = AnomalyModel.getAnomaly(user, id)

        return anomaly;
    },

    anomalyAdd: async (obj, args, context) => {
        const { title, description } = args;
        const { user } = context;

        if (!user) {
            throw new AuthenticationError('Unauthenticated');
        }

        if (user.role != 'farmer') {
            throw new ForbiddenError('Unauthorized')
        }

        const anomaly = new AnomalyModel({
            title,
            description,
            farmer: user._id,
        });

        await anomaly.save();

        return anomaly;
    },
}

export default resolvers