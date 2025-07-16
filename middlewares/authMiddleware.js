const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const isAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized Access - Token not provided"
            });
        }

        const decodedData = jwt.verify(token, process.env.SECRET_KEY);

        const user = await userModel.findById(decodedData.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        req.user = user;
        next();

    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: "Unauthorized Access - Invalid token"
        });
    }
};

module.exports = isAuth;
