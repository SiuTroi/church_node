const SeoModel = require("../app/models/SeoModel");
const SiteModel = require("../app/models/SiteModel");

function getSeo() {
    return SeoModel.find({});
}

function getSite() {
    return SiteModel.find({});
}

module.exports = { getSeo, getSite }