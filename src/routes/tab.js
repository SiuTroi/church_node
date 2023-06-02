const express = require("express");
const router = express.Router();

const tabController = require("../app/controllers/TabController");

router.get("/manage-post/:category/page/:pageNumber", tabController.categoryNewsPagination);
router.post("/manage-post/delete/many", tabController.deleteManyPost);
router.get("/manage-post/:id/approvel", tabController.apprvelNews);
router.get("/manage-post/page/:pageNumber", tabController.pagination);
router.get("/manage-post/:category", tabController.showNewsByCategory);

router.delete("/categories/:categoryId/delete", tabController.deleteCategory);
router.get("/categories", tabController.categories);

router.get("/users/:id/news/list", tabController.newsListByUser);
router.get("/users/:id/acceptusertobeadmin", tabController.acceptUserToBeAdmin);
router.delete("/users/:id/delete", tabController.deteleUser);
router.post("/users/create", tabController.createUser);  
router.get("/users", tabController.users);  

router.post("/custom/:id/customcss", tabController.customCSS);
router.post("/custom/:id/seo", tabController.seoStore);
router.post("/custom/site", tabController.siteStore);
router.get("/custom", tabController.custom);

router.get("/approvel", tabController.approvel);

module.exports = router;
