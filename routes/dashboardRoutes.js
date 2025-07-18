const express = require('express');
const isAuth = require('../middlewares/authMiddleware');
const { getDashboardData } = require('../controllers/dashboardController');


const router = express.Router();

router.get("/", isAuth, getDashboardData)


module.exports = router