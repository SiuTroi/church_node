const express = require("express");
const router = express.Router();

const siteController = require("../app/controllers/SiteController");


router.post("/", siteController.check);

module.exports = router;
