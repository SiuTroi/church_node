const mongoose = require("mongoose");

async function connect(uri) {
    try {
        await mongoose.connect(uri, { 
            useNewUrlParser: true, 
            useUnifiedTopology: true 
        })
        console.log("Conncet to DB successfully!!")
    } catch (error) {
        console.log("Connect failure!!!", error)
    }
};

module.exports = { connect };
