const { sendResponse } = require("../response");
const { isEmpty, isNumber, isValidDate, isMongoId } = require("./validators.utils");

exports.validateCreateExpense = (req, res, next) => {
    const { amount, category, date, paymentMode } = req.body;

    if (!isNumber(amount) || amount <= 0) return sendResponse(res, 400, false, "Amount must be a valid number");
    if (isEmpty(category)) return sendResponse(res, 400, false, "Category is required");
    if (!isValidDate(date)) return sendResponse(res, 400, false, "Valid date is required");
    if (isEmpty(paymentMode)) return sendResponse(res, 400, false, "Payment mode is required");

    next();
};

exports.validateUpdateExpense = (req, res, next) => {
    const { amount, category, date, paymentMode } = req.body;

    if (amount !== undefined && (!isNumber(amount) || amount <= 0)) return sendResponse(res, 400, false, "Invalid amount");
    if (category !== undefined && isEmpty(category)) return sendResponse(res, 400, false, "Category cannot be empty");
    if (date !== undefined && !isValidDate(date)) return sendResponse(res, 400, false, "Invalid date");
    if (paymentMode !== undefined && isEmpty(paymentMode)) return sendResponse(res, 400, false, "Invalid payment mode");

    next();
};

exports.validateExpenseId = (req, res, next) => {
    if (!isMongoId(req.params.id)) return sendResponse(res, 400, false, "Invalid expense ID");
    next();
};
