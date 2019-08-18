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
                diseases: [String],
                confidence: Number,
            },
            experts: [
                {
                    expert: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'User',
                    },
                    diseases: [String],
                    description: String,
                    treatement: String,
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
    getAnomalies(user) {
        if (user.role == 'farmer') {
            return this.find({ farmer: user }).populate('farmer').populate('solution.experts.expert');
        }
        else if (user.role == 'expert') {
            return this.find().populate('farmer').populate('solution.experts.expert');
        }
    },

    getAnomaly(user, id) {
        if (user.role == 'farmer') {
            return this.findOne({ _id: id, farmer: user }).populate('farmer').populate('solution.experts.expert');
        }
        else if (user.role == 'expert') {
            return this.findOne({ _id: id }).populate('farmer').populate('solution.experts.expert');
        }
    }
};

export default mongoose.model('Anomaly', Schema);
