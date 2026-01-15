const { sendResponse } = require("../response");
const { isEmpty, isNumber } = require("./validators.utils");

exports.validateBudget = (req, res, next) => {
    const { category, amount } = req.body;

    if (isEmpty(category)) return sendResponse(res, 400, false, "Category is required");
    if (!isNumber(amount) || amount < 0) return sendResponse(res, 400, false, "Budget amount must be valid");

    next();
};
