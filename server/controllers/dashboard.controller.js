const Income = require("../models/income.model");
const Expense = require("../models/expense.model");
const { sendResponse } = require("../utils/response");

/* DASHBOARD SUMMARY */
exports.getDashboardData = async (req, res) => {
    try {
        const userId = req.user.userId;
        const mongoose = require("mongoose");

        const userObjectId = new mongoose.Types.ObjectId(userId);

        const { startDate, endDate } = req.query;

        // 🔥 DATE RANGE LOGIC
        let start;
        let end;

        if (startDate && endDate) {
            // If dates are passed → use them
            start = new Date(startDate);
            end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
        } else {
            // Else → current month
            const now = new Date();
            start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
            end = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0);
        }

        /* TOTAL INCOME */
        const incomeResult = await Income.aggregate([
            {
                $match: {
                    userId: userObjectId,
                    date: { $gte: start, $lt: end }
                }
            },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        const totalIncome = incomeResult[0]?.total || 0;

        /* TOTAL EXPENSES */
        const expenseResult = await Expense.aggregate([
            {
                $match: {
                    userId: userObjectId,
                    date: { $gte: start, $lt: end }
                }
            },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        const totalExpenses = expenseResult[0]?.total || 0;

        /* SAVINGS */
        const savings = totalIncome - totalExpenses;
        const savingsPercentage =
            totalIncome > 0
                ? ((savings / totalIncome) * 100).toFixed(2)
                : 0;

        /* CATEGORY-WISE EXPENSES */
        const categoryExpenses = await Expense.aggregate([
            {
                $match: {
                    userId: userObjectId,
                    date: { $gte: start, $lt: end }
                }
            },
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

        /* MONTHLY EXPENSE TREND – PAST 6 MONTHS */
        const now = new Date();

        // Start = first day of month, 5 months ago
        const trendStart = new Date(
            now.getFullYear(),
            now.getMonth() - 5,
            1,
            0, 0, 0
        );

        // End = start of next month
        const trendEnd = new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            1,
            0, 0, 0
        );

        const monthlyTrend = await Expense.aggregate([
            {
                $match: {
                    userId: userObjectId,
                    date: { $gte: trendStart, $lt: trendEnd }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$date" },
                        month: { $month: "$date" }
                    },
                    expenses: { $sum: "$amount" }
                }
            },
            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1
                }
            }
        ]);

        const MONTHS = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        const formattedTrend = monthlyTrend.map(item => ({
            name: MONTHS[item._id.month - 1],
            year: item._id.year,
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
