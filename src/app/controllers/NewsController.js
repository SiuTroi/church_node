const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./localStorage');
const { validateYupSchema } = require("formik");
const yup = require("yup");
const {
  mutipleMongooseToObject,
  mongooseToObject,
} = require("../../utils/mongoose");
const NewsModel = require("../models/NewsModel");
const {
  getAllCategory,
  getNewsDetailById,
  getUserById,
  getNewsPendingApprovel,
  getCountNewsPendingApprovel,
} = require("../../utils");
const fs = require("fs");
class NewsController {
  // [GET] path: news/create
  async index(req, res, next) {
    if(  localStorage.getItem('userId')) {
    const user = await getUserById(localStorage.getItem('userId'));
    const countNewsPendingApprovel =
      await getCountNewsPendingApprovel();
    const categories = await getAllCategory();
    res.render("news/create", {
      categories: mutipleMongooseToObject(categories),
      user: mongooseToObject(user),
      countNewsPendingApprovel:
        countNewsPendingApprovel,
      isNewsActive: true,
    });
    } else { res.redirect('/admin/login') };
  }

  // [GET] show a news detail - path: /news/:id/show
  async show(req, res, next) {
    if (localStorage.getItem('userId')) {
      const user = await getUserById(localStorage.getItem('userId'));
      const countNewsPendingApprovel =
        await getCountNewsPendingApprovel();
      const newsDetail = await getNewsDetailById(req.params.id);
      res.render("news/show", {
        newsDetail: mongooseToObject(newsDetail),
        user: mongooseToObject(user),
        countNewsPendingApprovel:
          countNewsPendingApprovel,
        isNewsActive: true,
      });
    } else {
      res.redirect("/admin/login");
    }
  }

  // [GET] Edit news - path: /news/:id/edit
  async edit(req, res, next) {
    if (  localStorage.getItem('userId')) {
      const user = await getUserById(localStorage.getItem('userId'));
      const countNewsPendingApprovel =
        await getCountNewsPendingApprovel();
      const newsDetail = await getNewsDetailById(req.params.id);
      const categories = await getAllCategory();

      res.render("news/edit", {
        newsDetail: mongooseToObject(newsDetail),
        categories: mutipleMongooseToObject(categories),
        user: mongooseToObject(user),
        countNewsPendingApprovel:
          countNewsPendingApprovel,
        isNewsActive: true,
      });
    } else {
      res.redirect("/admin/login");
    }
  }

  // [DELETE] Delete news - path: /news/:id/delete
  async delete(req, res, next) {
    if (  localStorage.getItem('userId')) {
      NewsModel.deleteOne({ _id: req.params.id }, { new: true })
        .then(() => res.redirect("back"))
        .catch(next);
    } else {
      res.redirect("/admin/login");
    }
  }

  async search(req, res, next) {
    if (  localStorage.getItem('userId')) {
      const user = await getUserById(localStorage.getItem('userId'));
      const countNewsPendingApprovel =
        await getCountNewsPendingApprovel();
      const searchKeyWord = req.query.search;
      NewsModel.find({ title: { $regex: searchKeyWord, $options: "i" } })
        .then((dataSearchRespone) => {
          res.render("news/manage-post", {
            news: mutipleMongooseToObject(dataSearchRespone),
            user: mongooseToObject(user),
            countNewsPendingApprovel:
              countNewsPendingApprovel,
            isSearchPage: true,
            searchKeyWord: searchKeyWord,
          });
        })
        .catch(next);
    } else {
      res.redirect("/admin/login");
    }
  }
}

module.exports = new NewsController();
