const mongoose = require('mongoose')
const expenseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },

    icon:{
        type: String,
    },

    category:{
        type: String,
        required: true
    },

    amount:{
        type: Number,
        required: true
    },

    date:{
        type: Date,
        default: Date.now()
    }
},{
    timestamps: true
})

module.exports = mongoose.model("expense", expenseSchema)