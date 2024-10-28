const mongoose = require("mongoose");

const userModel = new mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role:{
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    profilePicture: {
        type: String,
        required: true
    },
    resume:{
        type: String,
        required: false
    },
    otp: {
        type: Number,
        required: false
    },
    expiry: {
        type: Number,
        required: false
    }

},{timestamps: true});

module.exports = mongoose.model("user", userModel);