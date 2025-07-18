var express = require('express');
const isAuth = require('../middlewares/authMiddleware');
const { addexpense, getAllexpense, updateexpense, deleteexpense, downloadexpenseExcel } = require('../controllers/expenseController');

const router = express.Router();

router.post("/create-expense", isAuth, addexpense);

router.get("/get-expense", isAuth, getAllexpense);

router.get("/downloadExcel", isAuth, downloadexpenseExcel);

router.put("/update-expense/:id", isAuth, updateexpense);

router.delete("/delete-expense/:id", isAuth, deleteexpense)


module.exports = router