const userModel = require("../models/userModel");
// const jwt = require('jsonwebtoken')
const cloudianry = require('cloudinary')
const bcrypt = require('bcrypt');
const getDataUri = require("../utils/features");
const registerUser = async(req, res)=>{
    try {
        const {fullname, email, password} = req.body;

        if(!fullname || !email || !password)
        {
            return res.status(400).json({
                success: false,
                message: "Please provide the all fields"
            })
        }

        let user = await userModel.findOne({email});

        if(user)
        {
            return res.status(409).json({
                success: false,
                message: "User is already registered for this email"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        if(!req.file)
        {
            return res.status(404).json({
                success: false,
                message: "Please provide the image"
            })
        }

        const file = getDataUri(req.file);
        const cdb = await cloudianry.v2.uploader.upload(file.content);

        const image = {
            public_id: cdb.public_id,
            url: cdb.secure_url
        }

        user = await userModel.create({
            fullname, email, password:hashedPassword, profilePic: [image]
        })

        return res.status(201).json({
            success: true,
            message: "New user is added successfully",
            user
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in register Api",
            error
        })
    }
}

module.exports = {registerUser}