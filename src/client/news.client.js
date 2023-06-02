const CategoryModel = require("../app/models/CategoryModel");
const NewsModel = require("../app/models/NewsModel");
const SeoModel = require("../app/models/SeoModel");
const SiteModel = require("../app/models/SiteModel");

const getAllNews = async (req, res) => {
  try {
    const news = await NewsModel.find({}).sort({ createdAt: -1 });
    res.status(200).json(news);
  } catch (error) {
    res.status(404).json(error);
  }
};

const getLimitNews = async (req, res) => {
  try {
    const news = await NewsModel.find({})
      .sort({ createdAt: -1 })
      .skip(req.query.start)
      .limit(req.query.limit);
    res.status(200).json(news);
  } catch (error) {}
};

const getTheLatestNews = async (req, res) => {
  try {
    const theLatestNews = await NewsModel.findOne().sort({ createdAt: -1 });
    res.status(200).json(theLatestNews);
  } catch (error) {
    res.status(404).json(error);
  }
};

const getNewsDetail = async (req, res) => {
  try {
    const newsDetail = await NewsModel.findOne({ title: req.query.title });
    res.status(200).json(newsDetail);
  } catch (error) {
    res.status(404).json(error);
  }
};
// Search
const getNewsSearch = async (req, res) => {
  try {
    // Define a RegExp pattern to search for
    const search = req.query.title;
    const regex = new RegExp(search.replace(/[^\w\s]/gi, ""), "i");
    const orQuery = [
      { title: regex },
      { title: { $regex: search.split(" ").join("|"), $options: "i" } },
      { title: { $regex: "^" + search, $options: "i" } },
    ];

    // Find documents with matching title field
    const news = await NewsModel.find({ $or: orQuery })
      .sort({ createdAt: -1 })
      .skip(req.query.start)
      .limit(req.query.limit);
    res.status(200).json(news);
  } catch (error) {
    res.status(404).json(error);
  }
};

const getCountNewsSearch = async (req, res) => {
  try {
    // Define a RegExp pattern to search for
    const search = req.query.title;
    const regex = new RegExp(search.replace(/[^\w\s]/gi, ""), "i");
    const orQuery = [
      { title: regex },
      { title: { $regex: search.split(" ").join("|"), $options: "i" } },
      { title: { $regex: "^" + search, $options: "i" } },
    ];

    // Find documents with matching title field
    const news = await NewsModel.find({ $or: orQuery })
      .sort({ createdAt: -1 })
      .countDocuments({})
    res.status(200).json(news);
  } catch (error) {
    res.status(404).json(error);
  }
}

// Category

const getAllCategory = async (req, res) => {
  try {
    const categories = await CategoryModel.find({});
    res.status(200).json(categories);
  } catch (error) {
    res.status(404).json(error);
  }
};

const getNewsByCategory = async (req, res) => {
  try {
    const categoryName = req.query.category_name;
    const allNews = await NewsModel.find({}).sort({ createdAt: -1 });
    if (categoryName === "all") {
      res.status(200).json(allNews);
      return;
    }
    NewsModel.find({ category: categoryName })
      .sort({ createdAt: -1 })
      .then((newsByCateRespone) => {
        res.status(200).json(newsByCateRespone);
      });
  } catch (error) {
    res.status(404).json(error);
  }
};

const getNewsByCategoryDirected = async (req, res) => {
  try {
    const news = await NewsModel.find({ category: req.query.category_name })
      .sort({ createdAt: -1 })
      .skip(req.query.start)
      .limit(req.query.limit);
    res.status(200).json(news);
  } catch (error) {
    res.status(404).json(error);
  }
};

const getNewsCountCategory = async (req, res) => {
  try {
    const count = await NewsModel.find({
      category: req.query.category_name,
    }).countDocuments({});
    res.status(200).json(count);
  } catch (error) {
    res.status(404).json(error);
  }
};

// Seo, site
const getHomeSeo = async (req, res) => {
  try {
    const homeSeo = await SeoModel.find({});
    res.status(200).json(homeSeo);
  } catch (error) {
    res.status(404).json(error);
  }
};

const getHomeSite = async (req, res) => {
  try {
    const homeSite = await SiteModel.find({});
    res.status(200).json(homeSite);
  } catch (error) {
    res.status(404).json(error);
  }
};

module.exports = {
  getAllNews,
  getLimitNews,
  getTheLatestNews,
  getNewsDetail,
  getNewsSearch,
  getNewsByCategory,
  getAllCategory,
  getNewsByCategoryDirected,
  getNewsCountCategory,
  getHomeSeo,
  getHomeSite,
  getCountNewsSearch
};
