var express = require('express');
const { registerUser } = require('../controllers/authController');

var router = express.Router();

router.post("/register", registerUser )

module.exports = router;