const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./localStorage');

const { validateYupSchema } = require('formik');
const yup = require('yup');
const {
  mutipleMongooseToObject,
  mongooseToObject,
} = require("../../utils/mongoose");

const {
  getUserById,
  getAllNews,
  getUserByEmailAndPassword, getAllUser, getCountNewsPendingApprovel, getNewsPendingApprovel,
} = require("../../utils");
const NewsModel = require('../models/NewsModel');
const UserModel = require('../models/UsersModel');

class SiteController {
  // [GET] path: /admin
  index(req, res, next) {
    res.redirect('/admin/home')
  }

  // [GET] path: /admin/home
  async home(req, res, next) {
    if (localStorage.getItem('userId')) {
      const user = await getUserById(localStorage.getItem('userId'));
      const users = await getAllUser();
      const allNews = await getAllNews();
      const newsPendingApprovel = await getNewsPendingApprovel();
      const countNewsPendingApprovel = await getCountNewsPendingApprovel();

      const idsCollaboratorFeatured = await NewsModel.aggregate([
        { $group: { _id: "$autherId", count: { $sum: 1 } } },
        { $match: { count: { $gt: 10 } } }
      ]);
      const idValues = idsCollaboratorFeatured.map(obj => obj._id);
      const collaboratorFeatured = await UserModel.find({ _id: { $in: idValues } });

      NewsModel.find({ isApproved: true }).sort({ createdAt: -1 }).limit(8).then(newsLastest => {
        res.render("home", {
          user: mongooseToObject(user),
          allNews: mutipleMongooseToObject(allNews),
          newsLastest: mutipleMongooseToObject(newsLastest),
          newsPendingApprovel: mutipleMongooseToObject(newsPendingApprovel),
          countNewsPendingApprovel: countNewsPendingApprovel,
          users: mutipleMongooseToObject(users),
          collaboratorFeatured: mutipleMongooseToObject(collaboratorFeatured),
          isHomeActive: true
        });
      })
    } else { res.redirect('/admin/login') };
  }

  async check(req, res, next) {
    const formSchema = yup.object().shape({
      email: yup.string().email().required("Email là trường bắt buộc"),
      password: yup.string().required("Mật khẩu là trường bắt buộc"),
    });
  
    validateYupSchema(req.body, formSchema)
      .then(() => {
        // Form is valid, handle the submission
        getUserByEmailAndPassword(req.body.email, req.body.password)
          .then(user => {
            if(user) {
              localStorage.setItem('userId', user._id);
              res.redirect("/admin/home");
            } else {
              res.render("admin/login", {
                wrongLogin: "Đăng nhập thất bại. Kiểm tra lại tài khoản hoặc mật khẩu."
              });
            } 
          })
      })
      .catch(errors => {
        // Form is invalid, render the form template with errors
        const objError = {
          email: errors.errors[0],
          password: errors.errors[1]
        }
        res.render('admin/login', { 
          errors: errors,
          objError: objError 
        });
      });
  }

  login(req, res, next) {
    // localStorage.getItem('userId') = localStorage.getItem('userId');
    if (  localStorage.getItem('userId')) {
      res.redirect("/admin");
    } else {
      res.render("admin/login", {
        isNotAdmin: true
      });
    }
  }

  logout(req, res, next) {
    localStorage.clear();
    res.redirect('/admin/login');
  }
}

module.exports = new SiteController();
