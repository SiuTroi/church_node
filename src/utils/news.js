const NewsModel = require('../app/models/NewsModel');

function getAllNews() {
  return NewsModel.find({});
}

function getNewsDetailById(newsId) {
  return NewsModel.findOne({ _id: newsId })
}

function getNewsApproved() {
  return NewsModel.find({ isApproved: true })
}

function getNewsPendingApprovel() {
  return NewsModel.find({ isApproved: false })
}

function getCountDocument() {
  return NewsModel.countDocuments({});
}

module.exports = {
  getAllNews,
  getNewsDetailById,
  getNewsApproved,
  getNewsPendingApprovel,
  getCountDocument
};
