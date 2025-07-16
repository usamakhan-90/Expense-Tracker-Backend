var express = require('express');
const { registerUser } = require('../controllers/authController');
const singleUpload = require('../middlewares/multer');

var router = express.Router();

router.post("/register", singleUpload, registerUser )

module.exports = router;