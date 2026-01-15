const Income = require("../models/income.model");
const { sendResponse } = require("../utils/response");

/**
 * CREATE income
 */
exports.createIncome = async (req, res) => {
    try {
        const { source, date, amount, note } = req.body;

        const income = await Income.create({
            userId: req.user.userId,
            source,
            date,
            amount,
            note
        });

        return sendResponse(res, 201, true, "Income created successfully", income);
    } catch (err) {
        console.error("Create Income Error:", err);
        return sendResponse(res, 500, false, "Internal server error");
    }
};

/**
 * READ all incomes (logged-in user)
 */
exports.getIncomes = async (req, res) => {
    try {
        const incomes = await Income.find({ userId: req.user.userId }).sort({ date: -1 });
        return sendResponse(res, 200, true, "Incomes fetched successfully", incomes);
    } catch (err) {
        console.error("Get Incomes Error:", err);
        return sendResponse(res, 500, false, "Internal server error");
    }
};

/**
 * READ single income by ID
 */
exports.getIncomeById = async (req, res) => {
    try {
        const income = await Income.findOne({ _id: req.params.id, userId: req.user.userId });
        if (!income) return sendResponse(res, 404, false, "Income not found");

        return sendResponse(res, 200, true, "Income fetched successfully", income);
    } catch (err) {
        console.error("Get Income Error:", err);
        return sendResponse(res, 500, false, "Internal server error");
    }
};

/**
 * UPDATE income
 */
exports.updateIncome = async (req, res) => {
    try {
        const income = await Income.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.userId },
            req.body,
            { new: true }
        );

        if (!income) return sendResponse(res, 404, false, "Income not found");

        return sendResponse(res, 200, true, "Income updated successfully", income);
    } catch (err) {
        console.error("Update Income Error:", err);
        return sendResponse(res, 500, false, "Internal server error");
    }
};

/**
 * DELETE income
 */
exports.deleteIncome = async (req, res) => {
    try {
        const income = await Income.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
        if (!income) return sendResponse(res, 404, false, "Income not found");

        return sendResponse(res, 200, true, "Income deleted successfully");
    } catch (err) {
        console.error("Delete Income Error:", err);
        return sendResponse(res, 500, false, "Internal server error");
    }
};
