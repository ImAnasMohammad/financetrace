const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const {
    createExpense,
    getExpenses,
    getExpenseById,
    updateExpense,
    deleteExpense
} = require("../controllers/expense.controller");

const {
    validateCreateExpense,
    validateUpdateExpense,
    validateExpenseId
} = require("../utils/validators/expense.validation");

router.post("/", auth, validateCreateExpense, createExpense);
router.get("/", auth, getExpenses);
router.get("/:id", auth, validateExpenseId, getExpenseById);
router.put("/:id", auth, validateExpenseId, validateUpdateExpense, updateExpense);
router.delete("/:id", auth, validateExpenseId, deleteExpense);

module.exports = router;
