const mongoose = require("mongoose");

const applicationModel = new mongoose.Schema({

    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "job",
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "company",
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    resume: {
        type: String,
        required: true
    },
    status:{
        type: String,
        enum: ["Pending", "Applied"],
        default: "Pending"
    }

},{timestamps: true});

module.exports = mongoose.model("application", applicationModel);