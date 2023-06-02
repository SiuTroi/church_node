const CategoryModel = require('../app/models/CategoryModel');

function getAllCategory() {
  return CategoryModel.find({});
}

function getCategoryById(id) {
  return CategoryModel.findById({ _id: id })
}

module.exports = {
  getAllCategory,
  getCategoryById
};
