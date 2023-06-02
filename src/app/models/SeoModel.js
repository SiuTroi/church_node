const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    title: String,
    keyword: String,
    description: String,
}, {
    timestamps: true,
});

const SeoModel = mongoose.model("Seo", schema);
module.exports = SeoModel;