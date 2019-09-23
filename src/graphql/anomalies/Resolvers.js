import { AuthenticationError, ForbiddenError } from 'apollo-server'
import AnomalyModel from './AnomalyModel';
import { processImages } from './utils'


const resolvers = {
    Anomaly: {

    },

    anomalies: (obj, args, context) => {
        const { user } = context;
        const { solved } = args;

        if (!user) {
            throw new AuthenticationError('Unauthenticated');
        }
        if (solved)
            return AnomalyModel.getAnomalies(user)
        else {
            if (user.role === 'expert')
                return AnomalyModel.getAnomalies()
            else
                throw new ForbiddenError('Unauthorized')
        }

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

        return anomaly;
    },

    addSolution: async (obj, args, context) => {
        const { user } = context;
        const { id, solution } = args;

        if (!user) {
            throw new AuthenticationError('Unauthenticated');
        }

        if (user.role != 'expert') {
            throw new ForbiddenError('Unauthorized')
        }

        return await AnomalyModel.addSolution(user, id, solution);
    }
}

export default resolvers