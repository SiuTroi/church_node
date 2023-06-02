const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    logo: String,
    banner: String,
    footer_description: String,
    address: String,
    phone: String,
    website: String,
    email: String,
    fanpage: String,
    copyright: String,
    map: String,
    facebook: String,
    youtube: String,
    custom_css: String,
}, {
    timestamps: true,
});

const SiteModel = mongoose.model("Site", schema);
module.exports = SiteModel;