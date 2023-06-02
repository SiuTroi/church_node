const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    category: String,
    cateUserId: String,
    seo: {
        image: String,
        category: String,
        keyword: String,
        description: String,
    }
}, {
    timestamps: true
});

const CategoryModel = mongoose.model("Category", schema);
module.exports = CategoryModel;