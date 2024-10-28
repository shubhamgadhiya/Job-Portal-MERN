const mongoose = require("mongoose");

const jobModel = new mongoose.Schema({
    role:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["Full-Time", "Part-Time", "Internship"],
        required: true
      },
   experience: {
        type: Number,
        required: true
    },
    salary: {
        type: Number,
        required: true
    },
    position: {
        type: Number,
        required: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "company",
    }

},{timestamps: true});

module.exports = mongoose.model("job", jobModel);