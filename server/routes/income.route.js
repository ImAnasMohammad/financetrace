const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const {
    createIncome,
    getIncomes,
    getIncomeById,
    updateIncome,
    deleteIncome
} = require("../controllers/income.controller");

const {
    validateCreateIncome,
    validateUpdateIncome,
    validateIncomeId
} = require("../utils/validators/validate.income");

router.post("/", auth, validateCreateIncome, createIncome);
router.get("/", auth, getIncomes);
router.get("/:id", auth, validateIncomeId, getIncomeById);
router.put("/:id", auth, validateIncomeId, validateUpdateIncome, updateIncome);
router.delete("/:id", auth, validateIncomeId, deleteIncome);

module.exports = router;
