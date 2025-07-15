
const mongoose = require('mongoose');

const connectDb = async(req, res)=>{
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            dbName: "expenseTracker"
        });

        console.log("Databse is connected")
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectDb;