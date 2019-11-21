import { AuthenticationError, ForbiddenError, PubSub, withFilter } from 'apollo-server-express'
import AnomalyModel from './AnomalyModel';
import { processImages } from './imageUtils'

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

    notifications: async (obj, args, context) => {
        const { user } = context;

        if (!user) {
            throw new AuthenticationError('Unauthenticated')
        }

        if (user.role != 'farmer') {
            throw new ForbiddenError('Unauthorized')
        }

        const notifications = await AnomalyModel.find({ farmer: user, "solution.experts.seen": false }).populate('solution.experts.expert');

        return notifications;
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

        const [urls, prediction] = await processImages(images)

        const anomaly = new AnomalyModel({
            title,
            description,
            farmer: user._id,
            images: urls,
            'solution.model.diseases': [prediction.disease],
            'solution.model.confidence': prediction.confidence
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

        const anomaly = await AnomalyModel.addSolution(user, id, solution);

        pubsub.publish('SOLUTION_ADDED', { solutionAdded: anomaly });

        return anomaly;
    },

    markAsSeen: async (obj, args, context) => {
        const { id } = args;
        const { user } = context;

        if (!user) {
            throw new AuthenticationError('Unauthenticated')
        }

        if (user.role != 'farmer') {
            throw new ForbiddenError('Unauthorized')
        }

        let anomaly = await AnomalyModel.findById(id).populate("farmer")
        
        if (!anomaly) return false

        if (anomaly.farmer.id !== user.id) {
            throw new ForbiddenError('Unauthorized')
        }

        try {
            anomaly.solution.experts[0].seen = true
            await anomaly.save()

            return true;

        } catch (error) {
            return false
        }
    },

    anomalyAdded: {
        subscribe: (obj, args, context) => {
            const { user } = context;

            if (!user) {
                throw new AuthenticationError('Unauthenticated');
            }

            if (user.role != 'expert') {
                throw new ForbiddenError('Unauthorized')
            }

            return pubsub.asyncIterator(['ANOMALY_ADDED'])
        },
    },

    solutionAdded: {
        subscribe: withFilter (
            () => pubsub.asyncIterator(['SOLUTION_ADDED']),
            (payload, args, context) => {
                const { user } = context;

                if (!user) {
                    throw new AuthenticationError('Unauthenticated');
                }
                
                return payload.solutionAdded.farmer.toString() === user.id;
            },
        )
    }
}

export default resolvers