const { removeVietnameseAccents } = require('./removeVietnameseAccents')
const { getAllCategory, getCategoryById } = require("./categories");
const {
  getAllNews,
  getNewsDetailById,
  getNewsApproved,
  getNewsPendingApprovel,
  getCountDocument,
} = require("./news");
const {
  getAllUser,
  getUserByEmailAndPassword,
  getUserById,
  getNewsByUserId,
} = require("./users");
const { getSeo, getSite } = require("./custom");
const {
  getCountNewsPendingApprovel,
} = require("./getCountNewsPendingApprovel");

module.exports = {
  removeVietnameseAccents,
  getUserById,
  getAllCategory,
  getCategoryById,
  getAllNews,
  getNewsDetailById,
  getNewsApproved,
  getNewsPendingApprovel,
  getCountDocument,
  getNewsPendingApprovel,
  getSeo,
  getSite,
  getAllUser,
  getUserByEmailAndPassword,
  getUserById,
  getNewsByUserId,
  getCountNewsPendingApprovel,
};
