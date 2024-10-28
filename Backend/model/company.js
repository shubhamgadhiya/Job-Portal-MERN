const mongoose = require("mongoose");

const companyModel = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    locations: {
        type: [String],
        default: [],
        required: true
      },
   website: {
        type: String,
        required: true
    },
    logo: {
        type: String,
        required: true
    }

},{timestamps: true});

module.exports = mongoose.model("company", companyModel);