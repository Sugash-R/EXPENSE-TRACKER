import Expense from "../models/Expense.js";

// ➕ Add Expense
export const addExpense = async (req, res) => {
  try {
    const { title, amount, category } = req.body;

    // ✅ Basic validation
    if (!title || !amount || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const expense = await Expense.create({
      user: req.user._id,
      title,
      amount,
      category,
    });

    res.status(201).json(expense);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📄 Get Expenses
export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id })
      .sort({ createdAt: -1 }); // ✅ latest first

    res.json(expenses);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❌ Delete Expense
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // 🔐 Ownership check
    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await expense.deleteOne();

    res.json({ message: "Expense removed" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✏️ Update Expense
export const updateExpense = async (req, res) => {
  try {
    const { title, amount, category } = req.body;

    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // 🔐 Ownership check
    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // ✅ Update only provided fields
    if (title !== undefined) expense.title = title;
    if (amount !== undefined) expense.amount = amount;
    if (category !== undefined) expense.category = category;

    const updatedExpense = await expense.save();

    res.json(updatedExpense);

  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: error.message });
  }
};