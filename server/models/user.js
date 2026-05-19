const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: {
        type: String,
        required: true,
    },

    role: {
        type: String,
        default: "user"
    },
    resetToken: {
        type: String,
    },

    resetTokenExpiry: {
        type: Date,
    },

});

module.exports = mongoose.model("User", userSchema);