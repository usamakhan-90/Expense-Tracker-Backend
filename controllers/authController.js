const userModel = require("../models/userModel");
const jwt = require('jsonwebtoken')
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

const loginUser = async(req, res)=>{
    try {
        const {email, password} = req.body;

        if(!email || !password)
        {
            return res.status(400).json({
                success: false,
                message: "Please provide the email and password"
            })
        }

        let user = await userModel.findOne({email});

        if(!user)
        {
            return res.status(404).json({
                success: false,
                message: "User is not registered is yet for this email"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch)
        {
            return res.status(404).json({
                success: false,
                message: "Passowrd is incorrect please enter the correct password"
            })
        }

        const token = jwt.sign({
            id: user._id
        }, process.env.SECRET_KEY, {
            expiresIn: '1h'
        });

        return res.status(200).cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: true,
            expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 100)
        }).json({
            success: true,
            message: "User is login successfully",
            token,
            user
        })  
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error in login API",
            error
        })
    }
}

const logoutUser = async(req, res)=>{
    try {
        return res.status(200).cookie("token", "", {
            httpOnly: true,
            secure: true,
            sameSite: true,
            expires: new Date(Date.now())
        }).send({
            success: true,
            message: "User is logout successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error in Logout Api",
            error
        })
    }
}

const getUser = async(req, res)=>{
    try {
        const user = await userModel.findById(req.user.id).select('-password');

        if(!user)
        {
            return res.status(404).json({
                success: false,
                message: "User is not found"
            })
        }

        res.status(200).json({
            success: true,
            message: "user info is fetched successfully",
            user
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error in Get Info API",
            error
        })
    }
}
module.exports = {registerUser, loginUser, logoutUser, getUser}