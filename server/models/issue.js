const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({
    title: String,
    category: String,
    description: String,
    location: String,

    status: {
        type: String,
        default: "Pending"
    },

    username: String,
    image: String,
    feedbackImage: String,

    date: {
        type: Date,
        default: Date.now()
    },
});

module.exports = mongoose.model("Issue", issueSchema);