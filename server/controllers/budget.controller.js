const Budget = require("../models/budget.model");
const { sendResponse } = require("../utils/response");

/* CREATE or UPDATE budget */
exports.upsertBudget = async (req, res) => {
    try {
        const { category, amount } = req.body;

        const budget = await Budget.findOneAndUpdate(
            { userId: req.user.userId, category },
            { amount },
            { new: true, upsert: true }
        );

        return sendResponse(res, 200, true, "Budget saved", budget);
    } catch (err) {
        console.error("Upsert Budget Error:", err);
        return sendResponse(res, 500, false, "Internal server error");
    }
};

/* GET all budgets */
exports.getBudgets = async (req, res) => {
    try {
        const budgets = await Budget.find({ userId: req.user.userId });
        return sendResponse(res, 200, true, "Budgets fetched", budgets);
    } catch (err) {
        console.error("Get Budgets Error:", err);
        return sendResponse(res, 500, false, "Internal server error");
    }
};
