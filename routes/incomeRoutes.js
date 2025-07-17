var express = require('express');
const isAuth = require('../middlewares/authMiddleware');
const { addIncome, getAllIncome, updateIncome, deleteIncome, downloadIncomeExcel } = require('../controllers/incomeController');

const router = express.Router();

router.post("/create-income", isAuth, addIncome);

router.get("/get-income", isAuth, getAllIncome);

router.get("/downloadExcel", isAuth, downloadIncomeExcel);

router.put("/update-income/:id", isAuth, updateIncome);

router.delete("/delete-income/:id", isAuth, deleteIncome)


module.exports = router