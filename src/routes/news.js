const express = require("express");
const router = express.Router();

const newsController = require("../app/controllers/NewsController");

router.get("/create", newsController.index);
router.get("/search", newsController.search);
router.get('/:id/show', newsController.show)
router.get('/:id/edit', newsController.edit)
router.delete('/:id/delete', newsController.delete)

module.exports = router;
