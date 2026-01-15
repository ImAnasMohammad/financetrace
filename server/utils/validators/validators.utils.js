const isEmpty = (value) => !value || value.toString().trim() === "";
const isNumber = (value) => !isNaN(value) && isFinite(value);
const isValidDate = (value) => !isNaN(Date.parse(value));
const isMongoId = (id) => /^[a-f\d]{24}$/i.test(id);

module.exports = { isEmpty, isNumber, isValidDate, isMongoId };
