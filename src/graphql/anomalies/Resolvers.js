import { AuthenticationError, ForbiddenError } from 'apollo-server'
import AnomalyModel from './AnomalyModel';
import { processImages } from './imageUtils'
import { PubSub } from 'apollo-server';

const pubsub = new PubSub();

const resolvers = {
    Anomaly: {

    },

    anomalies: (obj, args, context) => {
        const { solved } = args;
        const { user } = context;

        if (!user) {
            throw new AuthenticationError('Unauthenticated');
        }

        const anomalies = AnomalyModel.getAnomalies(user, solved)

        return anomalies

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

    addAnomaly: async (obj, args, context) => {
        const { title, description, images } = args.anomaly;
        const { user } = context;

        if (!user) {
            throw new AuthenticationError('Unauthenticated');
        }

        if (user.role != 'farmer') {
            throw new ForbiddenError('Unauthorized')
        }

        const links = await processImages(images)

        const anomaly = new AnomalyModel({
            title,
            description,
            farmer: user._id,
            images: links
        });

        await anomaly.save();

        pubsub.publish('ANOMALY_ADDED', { anomalyAdded: anomaly });

        return anomaly;
    },

    addSolution: async (obj, args, context) => {
        const { id, solution } = args;
        const { user } = context;

        if (!user) {
            throw new AuthenticationError('Unauthenticated');
        }

        if (user.role != 'expert') {
            throw new ForbiddenError('Unauthorized')
        }

        anomaly = await AnomalyModel.addSolution(user, id, solution);

        pubsub.publish('SOLUTION_ADDED', { solutionAdded: anomaly });

        return anomaly;
    },

    anomalyAdded: {
        subscribe: () => pubsub.asyncIterator(['ANOMALY_ADDED']),
    },

    solutionAdded: {
        subscribe: () => pubsub.asyncIterator(['SOLUTION_ADDED']),
    }
}

export default resolvers