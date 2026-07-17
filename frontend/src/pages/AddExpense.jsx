import { useEffect, useState } from "react";
import {
  addExpense,
  getExpenses,
  deleteExpense,
  updateExpense,
} from "../services/expenseService";

const AddExpense = () => {
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const token = user?.token;

  const [expenses, setExpenses] = useState([]);

  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    const data = await getExpenses(token);
    setExpenses(data);
  };

  // 🔥 CURRENT MONTH FILTER
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const currentExpenses = expenses.filter((exp) => {
    const d = new Date(exp.createdAt);
    return (
      d.getMonth() === currentMonth &&
      d.getFullYear() === currentYear
    );
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.amount || !form.category) return;

    if (editingId) {
      await updateExpense(editingId, form, token);
      setEditingId(null);
    } else {
      await addExpense(form, token);
    }

    setForm({ title: "", amount: "", category: "" });
    loadExpenses();
  };

  const handleEdit = (exp) => {
    setForm({
      title: exp.title,
      amount: exp.amount,
      category: exp.category,
    });
    setEditingId(exp._id);
  };

  const handleDelete = async (id) => {
    await deleteExpense(id, token);
    loadExpenses();
  };

  return (
    <div className="flex items-center justify-center min-h-[85vh] px-4">

      {/* 🔥 BIG CONTAINER */}
      <div className="flex gap-10 w-full max-w-6xl">

        {/* LEFT FORM */}
        <div className="bg-white p-8 rounded-2xl shadow-lg flex-1">

          <h2 className="text-2xl font-bold mb-2">
            {editingId ? "Edit Expense" : "Add New Expense 💸"}
          </h2>

          <p className="text-gray-500 mb-6">
            Track your spending and stay within your budget
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Eg: Netflix Subscription"
              className="border p-3 rounded-lg text-lg"
            />

            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="Enter amount"
              className="border p-3 rounded-lg text-lg"
            />

            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Eg: Food, Rent, Travel"
              className="border p-3 rounded-lg text-lg"
            />

            <button
              className={`mt-3 py-3 rounded-lg text-white text-lg font-semibold ${
                editingId ? "bg-yellow-500" : "bg-blue-600"
              }`}
            >
              {editingId ? "Update Expense" : "Add Expense"}
            </button>

          </form>
        </div>

        {/* RIGHT RECENT */}
        <div className="bg-white p-8 rounded-2xl shadow-lg flex-1 max-h-[520px] overflow-y-auto">

          <h3 className="text-xl font-semibold mb-5">Recent Expenses</h3>

          {currentExpenses.length === 0 && (
            <p className="text-gray-400">No expenses this month</p>
          )}

          <div className="space-y-4">
            {currentExpenses.map((exp) => (
              <div
                key={exp._id}
                className="flex justify-between items-center border p-4 rounded-xl"
              >
                <div>
                  <p className="font-semibold text-lg">{exp.title}</p>
                  <p className="text-sm text-gray-500">
                    {exp.category}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-lg">₹{exp.amount}</p>

                  <div className="text-sm space-x-3">
                    <button
                      onClick={() => handleEdit(exp)}
                      className="text-blue-500"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(exp._id)}
                      className="text-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
};

export default AddExpense;