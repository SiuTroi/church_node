const express = require("express");
var methodOverride = require("method-override");
const { engine } = require("express-handlebars");
const session = require("express-session");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const multipart = require("connect-multiparty");
const multipartMiddleware = multipart();
const fs = require("fs");
const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./localStorage');
const route = require("./routes");
const db = require("./config/db");

// Fixing uploads images 
const { getUserById, getNewsPendingApprovel, getAllCategory, getNewsDetailById, getCategoryById, getCountNewsPendingApprovel } = require("./utils");
const { validateYupSchema } = require("formik");
const yup = require("yup");
const NewsModel = require("./app/models/NewsModel");
const { mutipleMongooseToObject, mongooseToObject } = require("./utils/mongoose");
const SiteModel = require("./app/models/SiteModel");
const CategoryModel = require("./app/models/CategoryModel");



dotenv.config();

const app = express();
const PORT = process.env.HORT || 3000;
const URI = process.env.DATABASE_URL;

// Connect to DB
db.connect(URI);

app.use(express.static(path.join(__dirname, "/public")));

app.use(bodyParser.json({ limit: "30mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "30mb" }));
app.use(cors());

app.engine(
  "hbs",
  engine({
    extname: "hbs",
    helpers: {
      getLength: (data) => data.length,
      isHaveAccount: (email, icon) => email && icon,
      checkGender: (gender) => gender == "male" ? "/images/male-user.png" : "/images/female-user.png",
      showImagePostDetail: (imagePost) => imagePost !== '/images/.webp' ? imagePost : 'https://news-app.vietjax.com/images/thumbnail-demo.jpg',
      allowDeleteUser: (isAdmin) => isAdmin ? "btn btn-link text-danger" : "btn btn-link text-danger disabled",
      isCurrentUser: (userId, userCurrentId, emailOrAuther) => userId.valueOf() === userCurrentId.valueOf() ? 'Bạn' : emailOrAuther,
      isCateOfCurrentUser: (userId, cateUserId) => userId.valueOf() === cateUserId ? 'd-block' : 'd-none',
      isCategorySeleted: (optionCategory, newsDetailCategory) =>
        optionCategory === newsDetailCategory,
      totalPage: (pages) => pages && pages.length,
      currentPageActive: (a, b) => a == b && "active",
      stt: (index) => index + 1,
      compare: (before, after) => {
        let value = before;
        if(before !== after && after !== undefined) {
          value = after;
        } 
        return value;
      },
      collabrCount: (collbrs) => collbrs.length,
      dateNow: () => {
        const date = new Date(Date.now());
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        const formattedDate = `${day}/${month}/${year}`;
        return formattedDate;
      },
      dateConvert: (dateToConvert) => {
        const date = new Date(dateToConvert);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        const formattedDate = `${day}/${month}/${year}`;
        return formattedDate;
      },
      dayOfWeek: (data) => {
        const dateObject = new Date(data);
        const dayOfWeek = dateObject.getUTCDay();
        const weekRank = dayOfWeek === 0 ? 7 : dayOfWeek;
        switch (weekRank) {
          case 1:
            return "Thứ Hai";
          case 2:
            return "Thứ Ba";
          case 3:
            return "Thứ Tư";
          case 4:
            return "Thứ Năm";
          case 5:
            return "Thứ Sáu";
          case 6:
            return "Thứ Bảy";
          case 7:
            return "Chủ nhật";
          default:
            throw new Error("Day of week is not valid!!");
        }
      },
    },
  })
);

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resource", "views"));

// app.use(
//   session({
//     secret: "userId",
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//       maxAge: 24 * 60 * 60 * 1000,
//     }
//   })
// );


app.use(methodOverride("_method"));

app.post("/admin/images/upload", multipartMiddleware, (req, res, next) => {
  if (  localStorage.getItem('userId')) {
    try {
      fs.readFile(req.files.upload.path, function (err, data) {
        const fileExt = req.files.upload.name.split(".")[0] + '.webp';
        var newPath = __dirname + "/public/images/" + fileExt;
        fs.writeFile(newPath, data, function (err) {
          if (err) console.log({ err: err });
          else {
            let fileName = fileExt;
            let url = "https://news-app.vietjax.com/images/" + fileName;
            let msg = "Tải lên thành công";
            let funcNum = req.query.CKEditorFuncNum;

            res
              .status(201)
              .send(
                "<script>window.parent.CKEDITOR.tools.callFunction('" +
                  funcNum +
                  "','" +
                  url +
                  "','" +
                  msg +
                  "');</script>"
              );
          }
        });
      });
    } catch (error) {
      console.log(error.message);
    }
  } else {
    res.redirect("/admin/login");
  }
});

// Fixing uploads images about directory __dirname

app.post('/admin/news/store', multipartMiddleware, async (req, res, next) => {
  if (localStorage.getItem('userId')) {
  const user = await getUserById(localStorage.getItem('userId'));
  const countNewsPendingApprovel =
    await getCountNewsPendingApprovel();
  const categories = await getAllCategory();

  const formSchema = yup.object().shape({
    title: yup.string().required("Tiêu đề là trường bắt buộc"),
    category: yup.string().required("Hạng mục là trường bắt buộc"),
    // image: yup.string().required("Ảnh bài viết là trường bắt buộc"),
    // description: yup.string().required("Mô tả là trường bắt buộc"),
    // auther: yup.string().required("Tác giả là trường bắt buộc"),
    content: yup.string().required("Nội dung là trường bắt buộc"),
  });

  const formData = req.body;
  formData.image = req.files.image.name;
  formData.title = req.body.title.trim();
  validateYupSchema(formData, formSchema)
    .then(() => {
      try {
        fs.readFile(req.files.image.path, function (err, data) {
          const fileExt = req.files.image.name.split(".")[0] + '.webp';
          var newPath =
          __dirname +
            "/public/images/" +
            fileExt;
          fs.writeFile(newPath, data, function (err) {
            if (err) console.log({ err: err });
            else {
              let url = req.files.image.name ? "/images/" + fileExt : "/images/thumbnail-demo.jpg";
  
              const news = new NewsModel(formData);
      
              news.image = url;
              news.isApproved = user.isAdmin && true;
              news.autherId = user._id;
              news
                .save()
                .then(() => res.redirect("/admin/tab/manage-post/all"))
                .catch(next);
            }
          });
        });
      } catch (error) {
        console.log(error.message);
      }
    })
    .catch((errors) => {
      const objError = {};
      errors.inner.forEach((error) => {
        objError[error.path] = error.message;
      });
      const formValue = { ...req.body };
      res.render("news/create", {
        errors: errors,
        objError: objError,
        formValue: formValue,
        categories: mutipleMongooseToObject(categories),
        user: mongooseToObject(user),
        countNewsPendingApprovel:
          countNewsPendingApprovel,
        isNewsActive: true,
      });
    });
  } else {
    res.redirect("/admin/login");
  }
})

app.post("/admin/news/:id/update", multipartMiddleware, async (req, res, next) => {
  if (  localStorage.getItem('userId')) {
    const user = await getUserById(localStorage.getItem('userId'));
    const countNewsPendingApprovel =
      await getCountNewsPendingApprovel();
    const newsDetail = await getNewsDetailById(req.params.id);
    const categories = await getAllCategory();
    const formSchema = yup.object().shape({
      title: yup.string().required("Tiêu đề là trường bắt buộc"),
      category: yup.string().required("Hạng mục là trường bắt buộc"),
      // image: yup.string().required("Ảnh bài viết là trường bắt buộc"),
      // auther: yup.string().required("Tác giả là trường bắt buộc"),
      content: yup.string().required("Nội dung là trường bắt buộc"),
    });
    const updateNews = req.body;
    updateNews.image = req.files.image.name || newsDetail.image;
    updateNews.title = req.body.title.trim();
    validateYupSchema(updateNews, formSchema)
      .then(() => {
        try {
          fs.readFile(req.files.image.path, function (err, data) {
            const fileExt = req.files.image.name.split(".")[0] + '.webp';
            var newPath = __dirname + "/public/images/" + fileExt;
            if(req.files.image.name) {
              fs.writeFile(newPath, data, function (err) {
                if (err) console.log({ err: err });
                else {
                  let url = req.files.image.name ? "/images/" + fileExt : "/images/thumbnail-demo.jpg";
                  updateNews.image = url;
                  NewsModel.findByIdAndUpdate({ _id: req.params.id }, updateNews, {
                    new: true,
                  })
                    .then(() => res.redirect("/admin/tab/manage-post/all"))
                    .catch(next);
                }
              });
              return;
            }
            updateNews.image = newsDetail.image;
            NewsModel.findByIdAndUpdate({ _id: req.params.id }, updateNews, {
              new: true,
            })
              .then(() => res.redirect("/admin/tab/manage-post/all"))
              .catch(next);
          });
        } catch (error) {
          console.log(error.message);
        }
      }).catch((errors) => {
        const objError = {};
        errors.inner.forEach((error) => {
          objError[error.path] = error.message;
        });
        const formValue = { ...req.body };
        res.render("news/edit", {
          newsDetail: mongooseToObject(newsDetail),
          categories: mutipleMongooseToObject(categories),
          user: mongooseToObject(user),
          formValue: formValue,
          countNewsPendingApprovel:
            countNewsPendingApprovel,
          isNewsActive: true,
          errors: errors,
          objError: objError
        });
      })
  } else {
    res.redirect("/admin/login");
  }
});

app.post("/admin/tab/custom/:id/site", multipartMiddleware, async (req, res, next) => {
  if (  localStorage.getItem('userId')) {
    const site = req.body;
    try {
      fs.readFile(req.files.logo.path, function (err, data) {
        var newPath = __dirname + "/public/images/" + req.files.logo.name;
        if(req.files.logo.name) {
          fs.writeFile(newPath, data, function (err) {
            if (err) console.log({ err: err });
            else {
              console.log('write')
              let url = "/images/" + req.files.logo.name;
              site.logo = url;
              SiteModel.findByIdAndUpdate({ _id: req.params.id }, site, {
                new: true
              }).then(() => res.redirect('back')).catch(next);
            }
          })
          return;
        }
        SiteModel.findByIdAndUpdate({ _id: req.params.id }, site, {
          new: true
        }).then(() => res.redirect('back')).catch(next);
        return;
      });

      fs.readFile(req.files.banner.path, function (err, data) {
        var newPath = __dirname + "/public/images/" + req.files.banner.name;
        if(req.files.banner.name) {
          fs.writeFile(newPath, data, function (err) {
            if (err) console.log({ err: err });
            else {
              console.log('write')
              let url = "/images/" + req.files.banner.name;
              site.banner = url;
              SiteModel.findByIdAndUpdate({ _id: req.params.id }, site, {
                new: true
              }).then(() => res.redirect('back')).catch(next);
            }
          })
          return;
        }
        SiteModel.findByIdAndUpdate({ _id: req.params.id }, site, {
          new: true
        }).then(() => res.redirect('back')).catch(next);
        return;
      })

    } catch (error) {
      console.log(error)
    }
  } else {
    res.redirect("/admin/login");
  }
});

app.post('/admin/tab/categories/create', multipartMiddleware, async (req, res, next) => {
  if (  localStorage.getItem('userId')) {
    const user = await getUserById(localStorage.getItem('userId'));
    const categoryData = req.body;
    const category = new CategoryModel(categoryData);
    category.seo = {...req.body}
    category.cateUserId = user._id
    try {
      fs.readFile(req.files.image.path, function (err, data) {
        const fileExt = req.files.image.name.split(".")[0] + '.webp';
        var newPath = __dirname + "/public/images/" + fileExt;
        if(req.files.image.name) {
          fs.writeFile(newPath, data, function (err) {
            if (err) console.log({ err: err });
            else {
              console.log('write')
              let url = "/images/" + fileExt;
              category.seo.image = url;
              category
                .save()
                .then(() => res.redirect("back"))
                .catch(() => {});
            }
          })
          return;
        }
        category
          .save()
          .then(() => res.redirect("back"))
          .catch(() => {});
      })
    } catch (error) {
      console.log(error)
    }
  } else {
    res.redirect("/admin/login");
  }
});

app.post('/admin/tab/categories/:id/edit', multipartMiddleware, async (req, res, next) => {
  if (  localStorage.getItem('userId')) {
    const user = await getUserById(localStorage.getItem('userId'));
    const categoryData = req.body;
    const categoryInDb = await getCategoryById(req.params.id);
    categoryData.seo = {...req.body};

    try {
      fs.readFile(req.files.image.path, function (err, data) {
        const fileExt = req.files.image.name.split(".")[0] + '.webp';
        var newPath = __dirname + "/public/images/" + fileExt;
        if(req.files.image.name) {
          fs.writeFile(newPath, data, function (err) {
            if (err) console.log({ err: err });
            else {
              console.log('write')
              let url = "/images/" + fileExt;
              categoryData.seo.image = url;
              CategoryModel.findByIdAndUpdate({ _id: req.params.id }, categoryData, {
                new: true
              }).then(() => res.redirect('back')).catch(next);
            }
          })
          return;
        }
        categoryData.seo.image = categoryInDb.seo.image;
        CategoryModel.findByIdAndUpdate({ _id: req.params.id }, categoryData, {
          new: true
        }).then(() => res.redirect('back')).catch(next);
      })
    } catch (error) {
      console.log(error)
    }
  } else {
    res.redirect("/admin/login");
  }
});

// Route init
route(app);

app.listen(PORT, () =>
  console.log(`Application is running on fort ${PORT}...`)
);
