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
    }
);

Schema.statics = {
    getAnomalies(user) {

        if (!user) {
            return this.find({ "solution.experts": [] }).populate('farmer').populate('solution.experts.expert');
        }
        else if (user.role == 'farmer') {
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
    },

    async addSolution(user, id, solution) {

        let anomaly = await this.findOne({ _id: id }).populate('farmer').populate('solution.experts.expert');

        const experts = anomaly.solution.experts;

        console.log(solution.diseases);
        
        const index = experts.map(e => e._id).indexOf(user.id);

        if (index === -1)
            experts.push({...solution,_id:user.id});
        else
            experts[index] = {...solution,_id:user.id};

        const res = await this.updateOne({ _id: id }, { 'solution.experts': anomaly.solution.experts });

        return !!res.n;

    }

};

export default mongoose.model('Anomaly', Schema);
