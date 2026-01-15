const Income = require("../models/income.model");
const Expense = require("../models/expense.model");
const { sendResponse } = require("../utils/response");

/* DASHBOARD SUMMARY */
exports.getDashboardData = async (req, res) => {
    try {
        const userId = req.user.userId;

        const mongoose = require("mongoose");

        const userObjectId = new mongoose.Types.ObjectId(userId);

        const incomeResult = await Income.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        const totalIncome = incomeResult[0]?.total || 0;

        /* TOTAL EXPENSES */
        const expenseResult = await Expense.aggregate([
            { $match: { userId:userObjectId } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        const totalExpenses = expenseResult[0]?.total || 0;

        /* SAVINGS */
        const savings = totalIncome - totalExpenses;
        const savingsPercentage =
            totalIncome > 0 ? ((savings / totalIncome) * 100).toFixed(2) : 0;

        /* CATEGORY-WISE EXPENSES */
        const categoryExpenses = await Expense.aggregate([
            { $match: { userId:userObjectId } },
            {
                $group: {
                    _id: "$category",
                    value: { $sum: "$amount" }
                }
            },
            {
                $project: {
                    _id: 0,
                    name: "$_id",
                    value: 1
                }
            }
        ]);

        /* MONTHLY EXPENSE TREND */
        const monthlyTrend = await Expense.aggregate([
            { $match: { userId:userObjectId } },
            {
                $group: {
                    _id: { $month: "$date" },
                    expenses: { $sum: "$amount" }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        const formattedTrend = monthlyTrend.map(item => ({
            name: MONTHS[item._id - 1],
            expenses: item.expenses
        }));

        return sendResponse(res, 200, true, "Dashboard data fetched", {
            totalIncome,
            totalExpenses,
            savings,
            savingsPercentage,
            categoryExpenses,
            monthlyTrend: formattedTrend
        });

    } catch (err) {
        console.error("Dashboard Error:", err);
        return sendResponse(res, 500, false, "Internal server error");
    }
};
