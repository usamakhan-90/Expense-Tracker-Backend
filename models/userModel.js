const { default: mongoose } = require("mongoose");

const UserSchema =new mongoose.Schema({
    fullName:{
        type: String,
        required: true
    },

    email:{
        type: String,
        required: true,
        unique: true
    },

    password:{
        type: String,
        required: true
    },

    profilePic:[
        {
            public_id: String,
            url: String
        }
    ]
},{
    timestamps: true
})

module.exports = mongoose.model("user", UserSchema)