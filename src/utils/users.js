const NewsModel = require("../app/models/NewsModel");
const UserModel = require("../app/models/UsersModel");

function getAllUser() {
    return UserModel.find({});
}

function getUserByEmailAndPassword(email, password) {
    return UserModel.findOne({ email: email, password: password });
}

function getUserById(id) {
    return UserModel.findOne({ _id: id });
}

function getNewsByUserId(userId) {
    return NewsModel.find({ autherId: userId })
}
module.exports = {
    getAllUser,
    getUserByEmailAndPassword,
    getUserById,
    getNewsByUserId
};
