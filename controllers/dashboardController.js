const { isValidObjectId, Types } = require("mongoose");
const incomeModel = require("../models/incomeModel");
const expenseModel = require("../models/expenseModel");

const getDashboardData = async(req, res) => {
    try {
        const userId = req.user._id;
        const userObjectId = new Types.ObjectId(String(userId));

        // Fetch Total income & expense
        const totalIncome = await incomeModel.aggregate([
            { $match: {userId: userObjectId} },
            { $group: { _id: null, total: {$sum: "$amount"} } }
        ]);

        const totalExpense = await expenseModel.aggregate([
            { $match: {userId: userObjectId} },
            { $group: { _id: null, total: {$sum: "$amount"} } }
        ]);

        // Get income transactions in the last 60 days
        const last60DaysIncomeTranscations = await incomeModel.find({
            userId,
            date: {$gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)},
        }).sort({date: -1});

        // Get total income for last 60 days with initial value for reduce
        const incomeLast60Days = last60DaysIncomeTranscations.reduce(
            (sum, transaction) => sum + transaction.amount, 0 // Added initial value 0
        );

        // Get expense transactions in the last 30 days
        const last30DaysExpenseTranscations = await expenseModel.find({
            userId,
            date: {$gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)},
        }).sort({date: -1});

        // Expense Last 30 days with initial value for reduce
        const expenseLast30Days = last30DaysExpenseTranscations.reduce(
            (sum, transaction) => sum + transaction.amount, 0 // Added initial value 0
        );

        // fetch last 5 transactions (income + expenses)
        const lastTranscations = [
            ...(await incomeModel.find({userId}).sort({date: -1}).limit(5)).map(
                (txn) => ({ ...txn.toObject(), type: "income" })
            ),
            ...(await expenseModel.find({userId}).sort({date: -1}).limit(5)).map(
                (txn) => ({ ...txn.toObject(), type: "expense" })
            ),
        ].sort((a, b) => b.date - a.date);

        return res.status(200).json({
            success: true,
            message: "Data is fetched successfully",
            totalBalance: (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
            totalIncome: totalIncome[0]?.total || 0,
            totalExpense: totalExpense[0]?.total || 0,
            last30DaysExpense: {
                total: expenseLast30Days,
                transaction: last30DaysExpenseTranscations
            },
            last60DaysIncome: {
                total: incomeLast60Days,
                transaction: last60DaysIncomeTranscations,
            },
            recentTranscations: lastTranscations
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error in dashboard data API",
            error: error.message // Better to send only the message in production
        });
    }
}

module.exports = { getDashboardData };