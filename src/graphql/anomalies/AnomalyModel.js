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
            type: [String]
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
                    treatment: String,
                    seen: {
                        type: Boolean,
                        default: false,
                        required: false
                    },
                    _id: { id: false }
                }
            ]
        },
    },
    {
        timestamps: {
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
        },
    }
);

Schema.statics = {
    getAnomalies(user, solved) {

        if (user.role == 'farmer') {
            return this.find({ farmer: user }).populate('farmer').populate('solution.experts.expert');
        }

        if (user.role == 'expert') {
            if (solved) {
                return this.find({ "solution.experts.expert": user.id }).populate('farmer').populate('solution.experts.expert');
            } else {
                return this.find({ "solution.experts": [] }).populate('farmer')
            }
        }
    },

    getAnomaly(user, id) {

        if (user.role == 'farmer') {
            return this.findOne({ _id: id, farmer: user }).populate('farmer').populate('solution.experts.expert');
        }

        if (user.role == 'expert') {
            return this.findOne({ _id: id }).populate('farmer')
        }
    },

    async addSolution(user, id, solution) {

        let anomaly = await this.findById(id);

        if (!anomaly) return null

        let experts = anomaly.solution.experts
        const index = experts.map(solution => solution.expert).indexOf(user.id);

        if (index === -1)
            experts.push({ ...solution, expert: user.id })
        else
            experts[index] = { ...solution, expert: user.id }

        await anomaly.save()
        return anomaly

    }

};

export default mongoose.model('Anomaly', Schema);
