const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    email: String,
    password: String,
    isAdmin: {type: Boolean, default: false },
}, {
    timestamps: true,
});

const UserModel = mongoose.model("users", schema);
module.exports = UserModel;