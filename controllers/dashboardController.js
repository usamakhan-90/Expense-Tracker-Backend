const { isValidObjectId, Types } = require("mongoose");
const incomeModel = require("../models/incomeModel");
const expenseModel = require("../models/expenseModel");

const getDashboardData = async(req, res)=>{
    try {
        const userId = req.user.id;

        const userObjectId = new Types.ObjectId(String(userId));

        // Fetch Total income & expense

        const totalIncome = await incomeModel.aggregate([
            {
                $match: {userId: userObjectId}
            },

            {
                $group: {
                    _id: null,
                    total: {$sum: "$amount"}
                }
            },
        ]);

        console.log("total income", {totalIncome, userId: isValidObjectId(userId)});

                const totalExpense = await expenseModel.aggregate([
            {
                $match: {userId: userObjectId}
            },

            {
                $group: {
                    _id: null,
                    total: {$sum: "$amount"}
                }
            },
        ]);

        // Get income transcations in the last 60 days

        const last60DaysIncomeTranscations = await incomeModel.find({
            userId,
            date: {$gte: new Date(Date.now() - 60 *24*60*60*1000)},
        }).sort({date: -1})

        // Get total income for last 60 days

        const incomeLast60Days = last60DaysIncomeTranscations.reduce(
            (sum, transcation) => sum + transcation.amount
        )

        // Get expesne transcations in the last 30 days

           const last30DaysExpenseTranscations = await expenseModel.find({
            userId,
            date: {$gte: new Date(Date.now() - 30 *24*60*60*1000)},
        }).sort({date: -1})

        // Expesne Last 30 days
         const expenseLast30Days = last30DaysExpenseTranscations.reduce(
            (sum, transcation) => sum + transcation.amount
        )

        // fetch ;ast 5 transcations (income + espenses)

        const lastTranscations = [
            ...(await incomeModel.find({userId}).sort({date: -1}).limit(5)).map(
                (txn) => ({
                    ...txn.toObject(),
                    type: "income"
                })
            ),

                ...(await expenseModel.find({userId}).sort({date: -1}).limit(5)).map(
                (txn) => ({
                    ...txn.toObject(),
                    type: "expense"
                })
            ),
        ].sort((a, b)=> b.date - a.date);

        return res.status(200).json({
            success: true,
            message: "Data is fetched successfully",
            totalBalance: (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
            totalIncome: totalIncome[0]?.total || 0,
            totalExpense: totalExpense[0]?.total || 0,
            last30DaysExpense: {
                total: expenseLast30Days,
                transcation: last30DaysExpenseTranscations
            },

            last60DaysIncome: {
                total: incomeLast60Days,
                transcation: last60DaysIncomeTranscations,
            },

            recentTranscations: lastTranscations
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error in dashboard data API",
            error
        })
    }
}

module.exports = {getDashboardData}