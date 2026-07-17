import { useEffect, useState } from "react";
import { getExpenses, deleteExpense } from "../services/expenseService";

const Expenses = () => {
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const token = user?.token;

  const [expenses, setExpenses] = useState([]);

  // 🔥 NEW STATES
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    const data = await getExpenses(token);
    setExpenses(data);
  };

  // 🔥 FILTER CURRENT MONTH ONLY
  const getCurrentMonthExpenses = (expenses) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    return expenses.filter((exp) => {
      const date = new Date(exp.createdAt);
      return (
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear
      );
    });
  };

  const currentExpenses = getCurrentMonthExpenses(expenses);

  // 🔥 APPLY SEARCH + CATEGORY FILTER
  const filteredExpenses = currentExpenses.filter((exp) => {
    const matchesSearch = exp.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      exp.category.toLowerCase() === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // 🔹 DELETE
  const handleDelete = async (id) => {
    await deleteExpense(id, token);
    loadExpenses();
  };

  // 🎨 CATEGORY ICON + COLOR MAP
  const categoryStyles = {
    food: { icon: "🍔", color: "bg-orange-100 text-orange-600" },
    rent: { icon: "🏠", color: "bg-blue-100 text-blue-600" },
    health: { icon: "💊", color: "bg-green-100 text-green-600" },
    loan: { icon: "💰", color: "bg-red-100 text-red-600" },
    travel: { icon: "✈️", color: "bg-purple-100 text-purple-600" },
    education: { icon: "📚", color: "bg-yellow-100 text-yellow-600" },
    other: { icon: "📦", color: "bg-gray-100 text-gray-600" },
  };

  const getCategoryStyle = (category) => {
    return categoryStyles[category?.toLowerCase()] || categoryStyles["other"];
  };

  // 🔥 GET UNIQUE CATEGORIES
  const categories = [
    "all",
    ...new Set(currentExpenses.map((e) => e.category.toLowerCase())),
  ];

  return (
    <div className="p-6">

      {/* TITLE */}
      <h2 className="text-2xl font-bold mb-6">All Expenses</h2>

      {/* 🔥 SEARCH BAR */}
      <input
        type="text"
        placeholder="Search expenses..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 p-3 border rounded-lg"
      />

      {/* 🔥 CATEGORY FILTER */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1 rounded-full text-sm capitalize transition ${
              selectedCategory === cat
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* EMPTY STATE */}
      {filteredExpenses.length === 0 && (
        <p className="text-gray-400">No expenses found</p>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {filteredExpenses.map((exp) => {
          const { icon, color } = getCategoryStyle(exp.category);

          return (
            <div
              key={exp._id}
              className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition"
            >

              {/* ICON */}
              <div className={`w-12 h-12 flex items-center justify-center rounded-full text-xl mb-4 ${color}`}>
                {icon}
              </div>

              {/* TITLE */}
              <h3 className="text-lg font-semibold">
                {exp.title}
              </h3>

              {/* AMOUNT */}
              <p className="text-xl font-bold text-gray-800 mt-1">
                ₹{exp.amount}
              </p>

              {/* CATEGORY */}
              <span className="text-sm text-gray-500">
                {exp.category}
              </span>

              {/* DELETE */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => handleDelete(exp._id)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Delete
                </button>
              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
};

export default Expenses;