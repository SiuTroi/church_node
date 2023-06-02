module.exports = {

    // Handle when mutiple mogoose data array
    mutipleMongooseToObject: function(mongooses) {
        return mongooses.map(mongoose => mongoose.toObject())
    },

    // Handle when only mogoose data
    mongooseToObject: function(mongoose) {
        return mongoose ? mongoose.toObject() : mongoose
    }
}