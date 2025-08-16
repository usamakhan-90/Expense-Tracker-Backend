const expenseModel = require("../models/expenseModel");
const xlsx  = require('xlsx')
const addexpense = async (req, res) => {
  try {
    const userId = req.user._id;

    const { icon, category, amount, date } = req.body;

    if (!category || !amount || !date) {
      return res.status(403).json({
        success: false,
        message: "Please provide the all fields",
      });
    }

    const newexpense = await expenseModel.create({
      userId,
      icon,
      category,
      amount,
      date,
    });

    return res.status(201).json({
      success: true,
      message: "New expense is added successfully",
      newexpense,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in create expense API",
      error,
    });
  }
};

const getAllexpense = async (req, res) => {
  try {
    const expenses = await expenseModel.find({userId: req.user._id});

    if (!expenses) {
      return res.status(404).json({
        success: false,
        message: "expense is not created yet",
      });
    }

    return res.status(200).json({
      success: true,
      total: expenses.length,
      message: "Get all expenses is successfully",
      expenses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in Get all expense API",
      error,
    });
  }
};

const updateexpense = async (req, res) => {
  try {
    const expenseId = req.params.id;

    if (!expenseId) {
      return res.status(400).json({
        success: false,
        message: "expense id is not found",
      });
    }

    const expense = await expenseModel.findById(expenseId);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "expense is not found",
      });
    }

    const { icon, category, amount, date } = req.body;

    if (icon) expense.icon = icon;

    if (category) expense.category = category;

    if (amount) expense.amount = amount;

    if (date) expense.date = date;

    await expense.save();

    return res.status(200).json({
      success: true,
      message: "expense is updated successfully",
      expense,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in Update expense API",
      error,
    });
  }
};

const deleteexpense = async (req, res) => {
  try {
    const expenseId = req.params.id;

    if (!expenseId) {
      return res.status(404).json({
        success: false,
        message: "expense id is not found",
      });
    }

    const expense = await expenseModel.findByIdAndDelete(expenseId);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "expense is not found",
      });
    }

    return res.status(203).json({
      success: true,
      message: "expense is deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in Delete expense API",
      error,
    });
  }
};

const downloadexpenseExcel = async (req, res) => {
  try {

    const expenses = await expenseModel.find().sort({date: -1});

    const data = expenses.map((item)=>({
        category: item.category,
        Amount: item.amount,
        Date: item.date,
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "expense");
    xlsx.writeFile(wb, "expense_details.xlsx");
    res.download('expense_details.xlsx')
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in Download Excel expense API",
      error,
    });
  }
};
module.exports = { addexpense, getAllexpense, updateexpense, deleteexpense, downloadexpenseExcel };
