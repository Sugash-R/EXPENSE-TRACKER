import express from "express";
import {
  addExpense,
  getExpenses,
  deleteExpense,
  updateExpense, // ✅ ADD THIS
} from "../controllers/expenseController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .post(protect, addExpense)
  .get(protect, getExpenses);

// ✅ ADD PUT HERE
router.route("/:id")
  .delete(protect, deleteExpense)
  .put(protect, updateExpense);

export default router;