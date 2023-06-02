const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./localStorage');
const {
  mutipleMongooseToObject,
  mongooseToObject,
} = require("../../utils/mongoose");
const NewsModel = require("../models/NewsModel");
const CategoryModel = require("../models/CategoryModel");
const SeoModel = require("../models/SeoModel");
const {
  getAllNews,
  getAllCategory,
  getNewsPendingApprovel,
  getUserById,
  getCountDocument,
  getSeo,
  getSite,
  getAllUser,
  getCountNewsPendingApprovel,
  getNewsByUserId,
} = require("../../utils");
const SiteModel = require("../models/SiteModel");
const UserModel = require("../models/UsersModel");

class TabController {
  apprvelNews(req, res, next) {
    if (localStorage.getItem('userId')) {
      NewsModel.findByIdAndUpdate({ _id: req.params.id }, { isApproved: true })
        .then(() => res.redirect("back"))
        .catch(next);
    } else {
      res.redirect("/admin/login");
    }
  }

  deleteManyPost(req, res, next) {
    if (  localStorage.getItem('userId')) {
      const selectedFields = req.body.fields; // an array of selected field names
      NewsModel.deleteMany({ $or: selectedFields.map((_id) => ({ _id: _id })) })
        .then(() => res.redirect("back"))
        .catch(next);
    } else {
      res.redirect("/admin/login");
    }
  }

  async categories(req, res, next) {
    if (localStorage.getItem('userId')) {
      const user = await getUserById(localStorage.getItem('userId'));
      const categories = await getAllCategory();
      const countNewsPendingApprovel =
        await getCountNewsPendingApprovel();

      res.render("news/categories", {
        // handle course become object literal to before passed
        categories: mutipleMongooseToObject(categories),
        user: mongooseToObject(user),
        isCategoryActive: true,
        countNewsPendingApprovel:
          countNewsPendingApprovel,
      });
    } else {
      res.redirect("/admin/login");
    }
  }

  addCategory(req, res, next) {
    if (  localStorage.getItem('userId')) {
      const categoryData = req.body;
      const category = new CategoryModel(categoryData);
      category
        .save()
        .then(() => res.redirect("back"))
        .catch(() => {});
    } else {
      res.redirect("/admin/login");
    }
  };

  editCategory(req, res, next) {
    if (  localStorage.getItem('userId')) {
      CategoryModel.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true }).then(() => res.redirect('back')).catch(next);
    } else {
      res.redirect("/admin/login");
    }
  };

  async showNewsByCategory(req, res, next) {
    if (localStorage.getItem('userId')) {
      const category = req.params.category;
      const user = await getUserById(localStorage.getItem('userId'));
      const countNewsPendingApprovel =
        await getCountNewsPendingApprovel();
      const categories = await getAllCategory();

      let page = req.params.pageNumber || 1;
      let perPage = 10; // số lượng sản phẩm xuất hiện trên 1 page
      const countDocument = await getCountDocument();
      const newsAll = await getAllNews()
        .skip(perPage * page - perPage)
        .limit(perPage);

      const pages = Array.from(
        { length: Math.ceil(countDocument / perPage) },
        (_, i) => i + 1
      );
      if (category === "all") {
        res.render("news/manage-post", {
          news: mutipleMongooseToObject(newsAll),
          categories: mutipleMongooseToObject(categories),
          user: mongooseToObject(user),
          countNewsPendingApprovel:
            countNewsPendingApprovel,
          isNewsActive: true,
          categoryName: category,
          currentPage: page,
          pages: pages, // tổng số các page
        });
        return;
      }

      if (category === "lastest") {
        NewsModel.find()
          .sort({ createdAt: -1 })
          .skip(perPage * page - perPage)
          .limit(perPage)
          .then((newsLastest) => {
            res.render("news/manage-post", {
              news: mutipleMongooseToObject(newsLastest),
              categories: mutipleMongooseToObject(categories),
              user: mongooseToObject(user),
              countNewsPendingApprovel:
                countNewsPendingApprovel,
              isNewsActive: true,
              categoryName: category,
              currentPage: page,
              pages: pages, // tổng số các page
            });
          });
        return;
      }

      NewsModel.find({ category: category })
        .skip(perPage * page - perPage)
        .limit(perPage)
        .then((newsByCategory) => {
          res.render("news/manage-post", {
            news: mutipleMongooseToObject(newsByCategory),
            categories: mutipleMongooseToObject(categories),
            user: mongooseToObject(user),
            isNewsActive: true,
            categoryName: category,
            currentPage: page,
            pages: pages, // tổng số các page
          });
        })
        .catch(next);
    } else {
      res.redirect("/admin/login");
    }
  }

  deleteCategory(req, res, next) {
    if (localStorage.getItem('userId')) {
      CategoryModel.deleteOne({ _id: req.params.categoryId })
        .then(() => res.redirect("back"))
        .catch(next);
    } else {
      res.redirect("/admin/login");
    }
  }

  async pagination(req, res, next) {
    if (  localStorage.getItem('userId')) {
      const user = await getUserById(localStorage.getItem('userId'));
      const countNewsPendingApprovel =
        await getCountNewsPendingApprovel();
      let perPage = 10; // số lượng sản phẩm xuất hiện trên 1 page
      let page = req.params.pageNumber || 1;
      const countDocument = await getCountDocument();
      const pages = Array.from(
        { length: Math.ceil(countDocument / perPage) },
        (_, i) => i + 1
      );

      const allNews = await getAllNews()
        .skip(perPage * page - perPage)
        .limit(perPage);
      const categories = await getAllCategory();

      res.render("news/manage-post", {
        news: mutipleMongooseToObject(allNews),
        categories: mutipleMongooseToObject(categories),
        user: mongooseToObject(user),
        countNewsPendingApprovel:
          countNewsPendingApprovel,
        currentPage: page,
          pages: pages, // tổng số các page
        isNewsActive: true,
      });

    } else {
      res.redirect("/admin/login");
    }
  }

  async categoryNewsPagination(req, res, next) {
    if (localStorage.getItem('userId')) {
      const user = await getUserById(localStorage.getItem('userId'));
      const countNewsPendingApprovel =
        await getCountNewsPendingApprovel();
      let perPage = 10; // số lượng sản phẩm xuất hiện trên 1 page
      let page = req.params.pageNumber || 1;
      const category = req.params.category;
      const countDocument = await NewsModel.find({
        category: category,
      }).countDocuments({});
      const pages = Array.from(
        { length: Math.ceil(countDocument / perPage) },
        (_, i) => i + 1
      );

      const newsByCategory = await NewsModel.find({ category: category })
        .skip(perPage * page - perPage)
        .limit(perPage);
      const categories = await getAllCategory();

      res.render("news/manage-post", {
        news: mutipleMongooseToObject(newsByCategory),
        categories: mutipleMongooseToObject(categories),
        user: mongooseToObject(user),
        countNewsPendingApprovel:
          countNewsPendingApprovel,
        isCategoryPagination: true,
        category: category,
        currentPage: page,
        pages: pages, // tổng số các page
        isNewsActive: true,
        currentPage: page,
      });
    } else {
      res.redirect("/admin/login");
    }
  }

  async users(req, res, next) {
    if (localStorage.getItem('userId')) {
      const user = await getUserById(localStorage.getItem('userId'));
      const countNewsPendingApprovel =
        await getCountNewsPendingApprovel();
      const users = await getAllUser();
      res.render("users/userList", {
        users: mutipleMongooseToObject(users),
        user: mongooseToObject(user),
        countNewsPendingApprovel:
          countNewsPendingApprovel,
        isUserNavActive: true,
      });
    } else {
      res.redirect("/admin/login");
    }
  }

  createUser(req, res, next) {
    if (localStorage.getItem('userId')) {
      const userType = req.body.role === 'isAdmin' ? true : false;
      const user = new UserModel(req.body);
      user.isAdmin = userType;
      user.save().then(() => res.redirect('back')).catch(next);
    } else {
      res.redirect("/admin/login");
    }
  };

  async newsListByUser(req, res, next) {
    if (localStorage.getItem('userId')) {
      const user = await getUserById(localStorage.getItem('userId'));
      const countNewsPendingApprovel =
        await getCountNewsPendingApprovel();
      const newsListByUser = await getNewsByUserId(
        req.params.id
      );
      const userInfo = await getUserById(req.params.id);

      res.render("news/manage-post", {
        news: mutipleMongooseToObject(newsListByUser),
        user: mongooseToObject(user),
        countNewsPendingApprovel:
          countNewsPendingApprovel,
        userInfo: mongooseToObject(userInfo),
        isListNewsUserActive: true,
      });
    } else {
      res.redirect("/admin/login");
    }
  };

  acceptUserToBeAdmin(req, res, next) {
    if (localStorage.getItem('userId')) {
      UserModel.findByIdAndUpdate({ _id: req.params.id}, { isAdmin: true }, { news: true}).then(() => res.redirect('back')).catch(next)
    } else {
      res.redirect("/admin/login");
    }
  }

  async approvel(req, res, next) {
    if (localStorage.getItem('userId')) {
      const user = await getUserById(localStorage.getItem('userId'));
      const countNewsPendingApprovel =
        await getCountNewsPendingApprovel();
      const newsPendingApprovel = await getNewsPendingApprovel();
      res.render("tab/approvel", {
        newsPendingApprovel: mutipleMongooseToObject(newsPendingApprovel),
        user: mongooseToObject(user),
        countNewsPendingApprovel:
          countNewsPendingApprovel,
        isApprovelActive: true,
      });
    } else {
      res.redirect("/admin/login");
    }
  }

  deteleUser(req, res, next) {
    if (  localStorage.getItem('userId')) {
      UserModel.findByIdAndDelete({ _id: req.params.id })
        .then(() => res.redirect("back"))
        .catch(next);
    } else {
      res.redirect("/admin/login");
    }
  }

  async custom(req, res, next) {
    if (  localStorage.getItem('userId')) {
      const user = await getUserById(localStorage.getItem('userId'));
      const seo = await getSeo();
      const site = await getSite();
      const countNewsPendingApprovel =
        await getCountNewsPendingApprovel();
      res.render('tab/custom', {
        isCustomActive: true,
        user: mongooseToObject(user),
        seo: mongooseToObject(seo[0]),
        site: mongooseToObject(site[0]),
        countNewsPendingApprovel:
          countNewsPendingApprovel,
      });
    } else {
      res.redirect("/admin/login");
    }
  }

  seoStore(req, res, next) {
    if (localStorage.getItem('userId')) {
      const formData = req.body;
      formData.description = req.body.description.trim();
      SeoModel.findByIdAndUpdate({ _id: req.params.id}, formData, { new: true }).then(() => res.redirect('back')).catch(next);
    } else {
      res.redirect("/admin/login");
    }
  }

  siteStore(req, res, next) {
    if (localStorage.getItem('userId')) {
      const formData = req.body;
      const site = new SiteModel(formData);
      site.save().then(() => res.redirect('back')).catch(next);
    } else {
      res.redirect("/admin/login");
    }
  }

  customCSS(req, res, next) {
    if (localStorage.getItem('userId')) {
      SiteModel.findByIdAndUpdate({ _id: req.params.id},  req.body, { new: true }).then(() => res.redirect('back')).catch(next);
    } else {
      res.redirect("/admin/login");
    }
  }
}

module.exports = new TabController();
