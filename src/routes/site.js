const express = require("express");
const router = express.Router();

const siteController = require("../app/controllers/SiteController");

router.post("/check", siteController.check);
router.get("/login", siteController.login);
router.get("/logout", siteController.logout);
router.get("/home", siteController.home);
router.get("/", siteController.index);

module.exports = router;
