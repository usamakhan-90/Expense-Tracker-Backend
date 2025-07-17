var express = require('express');
const { registerUser, loginUser, logoutUser, getUser } = require('../controllers/authController');
const singleUpload = require('../middlewares/multer');
const isAuth = require('../middlewares/authMiddleware');

var router = express.Router();

router.post("/register", singleUpload, registerUser )

router.post("/login", loginUser );

router.post("/logout", isAuth, logoutUser);

router.get("/profile", isAuth, getUser);
module.exports = router;