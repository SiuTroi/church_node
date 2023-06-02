const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    title: { type: String, required: true },
    // auther: { type: String, required: true },
    category: String,
    image: { type: String },
    description: { type: String },
    content: { type: String, required: true },
    autherId: { type: String, require: true },
    genderAuther: String,
    isApproved: { type: Boolean, default: false },
}, {
    timestamps: true,
});

const NewsModel = mongoose.model("News", schema);
module.exports = NewsModel;
