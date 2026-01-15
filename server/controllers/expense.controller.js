const Expense = require("../models/expense.model");
const { sendResponse } = require("../utils/response");

/**
 * CREATE expense
 */
exports.createExpense = async (req, res) => {
    try {
        const expense = await Expense.create({
            userId: req.user.userId,
            ...req.body
        });
        return sendResponse(res, 201, true, "Expense created successfully", expense);
    } catch (err) {
        console.error("Create Expense Error:", err);
        return sendResponse(res, 500, false, "Internal server error");
    }
};

/**
 * READ all expenses (user-specific)
 */
exports.getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ userId: req.user.userId }).sort({ date: -1 });
        return sendResponse(res, 200, true, "Expenses fetched successfully", expenses);
    } catch (err) {
        console.error("Get Expenses Error:", err);
        return sendResponse(res, 500, false, "Internal server error");
    }
};

/**
 * READ single expense
 */
exports.getExpenseById = async (req, res) => {
    try {
        const expense = await Expense.findOne({ _id: req.params.id, userId: req.user.userId });
        if (!expense) return sendResponse(res, 404, false, "Expense not found");
        return sendResponse(res, 200, true, "Expense fetched successfully", expense);
    } catch (err) {
        console.error("Get Expense Error:", err);
        return sendResponse(res, 500, false, "Internal server error");
    }
};

/**
 * UPDATE expense
 */
exports.updateExpense = async (req, res) => {
    try {
        const expense = await Expense.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.userId },
            req.body,
            { new: true }
        );
        if (!expense) return sendResponse(res, 404, false, "Expense not found");
        return sendResponse(res, 200, true, "Expense updated successfully", expense);
    } catch (err) {
        console.error("Update Expense Error:", err);
        return sendResponse(res, 500, false, "Internal server error");
    }
};

/**
 * DELETE expense
 */
exports.deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
        if (!expense) return sendResponse(res, 404, false, "Expense not found");
        return sendResponse(res, 200, true, "Expense deleted successfully");
    } catch (err) {
        console.error("Delete Expense Error:", err);
        return sendResponse(res, 500, false, "Internal server error");
    }
};
