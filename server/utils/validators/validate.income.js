const { sendResponse } = require("../response");
const { isEmpty, isNumber, isValidDate, isMongoId } = require("./validators.utils");

exports.validateCreateIncome = (req, res, next) => {
    const { source, date, amount } = req.body;

    if (isEmpty(source)) return sendResponse(res, 400, false, "Source is required");
    if (!isValidDate(date)) return sendResponse(res, 400, false, "Valid date is required");
    if (!isNumber(amount)) return sendResponse(res, 400, false, "Amount must be a number");

    next();
};

exports.validateUpdateIncome = (req, res, next) => {
    const { source, date, amount } = req.body;

    if (source !== undefined && isEmpty(source)) return sendResponse(res, 400, false, "Source cannot be empty");
    if (date !== undefined && !isValidDate(date)) return sendResponse(res, 400, false, "Invalid date");
    if (amount !== undefined && !isNumber(amount)) return sendResponse(res, 400, false, "Amount must be a number");

    next();
};

exports.validateIncomeId = (req, res, next) => {
    if (!isMongoId(req.params.id)) return sendResponse(res, 400, false, "Invalid income ID");
    next();
};
