import mongoose from 'mongoose';


const Schema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: false,
        },
        farmer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        images: {
            type: [
                {
                    path: String
                }
            ]
        },
        solution: {
            model: {
                disease: String,
                confidence: Number,
            },
            experts: [
                {
                    expert: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'User',
                    },
                    description: String,
                    phytosanitaryProduct: String,
                }
            ]
        },
    },
    {
        timestamps: {
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
        },
    },
);

Schema.statics = {
    getProblems(user) {
        if (user.role == 'farmer') {
            return this.find({ farmer: user }).populate('farmer').populate('solution.experts.expert');
        }
        else if (user.role == 'expert') {
            return this.find().populate('farmer').populate('solution.experts.expert');
        }
    },

    getProblem(user, id) {
        if (user.role == 'farmer') {
            return this.findOne({ _id: id, farmer: user }).populate('farmer').populate('solution.experts.expert');
        }
        else if (user.role == 'expert') {
            return ProblemModel.findOne({ _id: id }).populate('farmer').populate('solution.experts.expert');
        }
    }
};

export default mongoose.model('Problem', Schema);
