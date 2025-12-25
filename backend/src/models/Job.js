import mongoose from "mongoose";

const jobShema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    requiredSkills: {
        type: [String],
        required: true,
    },
    questions:{
        type: [String],
        required: true,
    }
});

const Job = mongoose.model("Job", jobShema);
export default Job;