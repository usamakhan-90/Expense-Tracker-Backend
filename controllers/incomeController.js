const incomeModel = require("../models/incomeModel");
const xlsx  = require('xlsx')
const addIncome = async (req, res) => {
  try {
    const userId = req.user.id;

    const { icon, source, amount, date } = req.body;

    if (!source || !amount || !date) {
      return res.status(403).json({
        success: false,
        message: "Please provide the all fields",
      });
    }

    const newIncome = await incomeModel.create({
      userId,
      icon,
      source,
      amount,
      date,
    });

    return res.status(201).json({
      success: true,
      message: "New income is added successfully",
      newIncome,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in create Income API",
      error,
    });
  }
};

const getAllIncome = async (req, res) => {
  try {
    const incomes = await incomeModel.find({userId: req.user._id});

    if (!incomes) {
      return res.status(404).json({
        success: false,
        message: "Income is not created yet",
      });
    }

    return res.status(200).json({
      success: true,
      total: incomes.length,
      message: "Get all incomes is successfully",
      incomes,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in Get all Income API",
      error,
    });
  }
};

const updateIncome = async (req, res) => {
  try {
    const incomeId = req.params.id;

    if (!incomeId) {
      return res.status(400).json({
        success: false,
        message: "Income id is not found",
      });
    }

    const income = await incomeModel.findById(incomeId);

    if (!income) {
      return res.status(404).json({
        success: false,
        message: "income is not found",
      });
    }

    const { icon, source, amount, date } = req.body;

    if (icon) income.icon = icon;

    if (source) income.source = source;

    if (amount) income.amount = amount;

    if (date) income.date = date;

    await income.save();

    return res.status(200).json({
      success: true,
      message: "Income is updated successfully",
      income,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in Update Income API",
      error,
    });
  }
};

const deleteIncome = async (req, res) => {
  try {
    const incomeId = req.params.id;

    if (!incomeId) {
      return res.status(404).json({
        success: false,
        message: "Income id is not found",
      });
    }

    const income = await incomeModel.findByIdAndDelete(incomeId);

    if (!income) {
      return res.status(404).json({
        success: false,
        message: "Income is not found",
      });
    }

    return res.status(203).json({
      success: true,
      message: "Income is deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in Delete Income API",
      error,
    });
  }
};

const downloadIncomeExcel = async (req, res) => {
  try {

    const incomes = await incomeModel.find().sort({date: -1});

    const data = incomes.map((item)=>({
        Source: item.source,
        Amount: item.amount,
        Date: item.date,
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "income");
    xlsx.writeFile(wb, "income_details.xlsx");
    res.download('income_details.xlsx')
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in Download Excel Income API",
      error,
    });
  }
};
module.exports = { addIncome, getAllIncome, updateIncome, deleteIncome, downloadIncomeExcel };
