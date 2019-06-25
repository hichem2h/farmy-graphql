import { AuthenticationError, ForbiddenError } from 'apollo-server'
import ProblemModel from './ProblemModel';


const resolvers = {
    Problem: {

    },

    problems: (obj, args, context) => {
        const { user } = context;

        if (!user) {
            throw new AuthenticationError('Unauthenticated');
        }

        const problems = ProblemModel.getProblems(user)
        return problems;
    },

    problem: (obj, args, context) => {
        const { id } = args
        const { user } = context;

        if (!user) {
            throw new AuthenticationError('Unauthenticated');
        }

        const problem = ProblemModel.getProblem(user, id)

        return problem;
    },

    problemAdd: async (obj, args, context) => {
        const { title, description } = args;
        const { user } = context;

        if (!user) {
            throw new AuthenticationError('Unauthenticated');
        }

        if (user.role != 'farmer') {
            throw new ForbiddenError('Unauthorized')
        }

        const problem = new ProblemModel({
            title,
            description,
            farmer: user._id,
        });

        await problem.save();

        return problem;
    },
}

export default resolvers