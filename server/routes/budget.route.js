const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const { upsertBudget, getBudgets } = require("../controllers/budget.controller");
const { validateBudget } = require("../utils/validators/budget.validation");

router.get("/", auth, getBudgets);
router.post("/", auth, validateBudget, upsertBudget);

module.exports = router;
