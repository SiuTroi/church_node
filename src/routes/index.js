const siteRouter = require("./site");
const newsRouter = require("./news");
const tabRouter = require("./tab");
const {
  getAllNews,
  getLimitNews,
  getTheLatestNews,
  getNewsByCategory,
  getAllCategory,
  getNewsByCategoryDirected,
  getNewsDetail,
  getNewsCountCategory,
  getHomeSeo,
  getHomeSite,
  getNewsSearch,
  getCountNewsSearch
} = require("../client/news.client");

// Client

function route(app) {
  // Admin
  app.use("/admin/news", newsRouter);
  app.use("/admin/tab", tabRouter);
  app.use("/admin", siteRouter);


  // Client Api
  // news
  app.get("/api/news/get_news_as_directed", getLimitNews);
  app.get("/api/news/lastest", getTheLatestNews);
  app.get("/api/news/detail", getNewsDetail);
  app.get("/api/news", getAllNews);

  // search
  app.get("/api/news/count/search", getCountNewsSearch)
  app.get("/api/news/search", getNewsSearch);
  
  // categories
  app.get("/api/count/news_as_category", getNewsCountCategory);
  app.get("/api/get_news_as_category_directed", getNewsByCategoryDirected);
  app.get("/api/get_news_as_category", getNewsByCategory);
  app.get("/api/categories", getAllCategory);

  // seo, site
  app.get("/api/home_seo", getHomeSeo);
  app.get("/api/home_site", getHomeSite);
}

module.exports = route;
