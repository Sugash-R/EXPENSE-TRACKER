import { useEffect, useState } from "react"; 
import {
  getExpenses,
  addExpense,
  deleteExpense,
} from "../services/expenseService";

import {
  Wallet,
  TrendingUp,
  List,
} from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#ef4444", // Red
  "#3b82f6", // Blue
  "#22c55e", // Green
  "#f59e0b", // Amber
  "#ec4899", // Pink
  "#8b5cf6", // Royal Purple
  "#f97316", // Bright Orange
  "#06b6d4", // Cyan / Bright Teal
  "#84cc16", // Lime Green
  "#a855f7", // Deep Lavender
  "#14b8a6", // Teal
  "#6366f1", // Indigo
  "#d946ef", // Fuchsia
  "#0ea5e9", // Sky Blue
  "#f43f5e", // Rose / Crimson
  "#fbbf24"  // Golden Yellow
];
const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const token = user?.token;

  const [expenses, setExpenses] = useState([]);

  // 💰 Budget States
  const [budget, setBudget] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [tempBudget, setTempBudget] = useState("");

  useEffect(() => {
    loadExpenses();

    // 🔥 MONTHLY BUDGET RESET
    const stored = JSON.parse(localStorage.getItem("budget"));
    const currentMonth = new Date().getMonth();

    if (stored && stored.month === currentMonth) {
      setBudget(stored.amount);
    } else {
      setBudget(0);
      localStorage.removeItem("budget");
    }
  }, []);

  const loadExpenses = async () => {
    const data = await getExpenses(token);
    setExpenses(data);
  };

  // 🔥 FILTER CURRENT MONTH EXPENSES
  const getCurrentMonthExpenses = (expenses) => {
    const currentMonth = new Date().getMonth();

    return expenses.filter((exp) => {
      const expMonth = new Date(exp.createdAt).getMonth();
      return expMonth === currentMonth;
    });
  };

  const currentExpenses = getCurrentMonthExpenses(expenses);

  // 💰 SAVE BUDGET
  const saveBudget = () => {
    const currentMonth = new Date().getMonth();

    const data = {
      amount: Number(tempBudget),
      month: currentMonth,
    };

    localStorage.setItem("budget", JSON.stringify(data));
    setBudget(Number(tempBudget));
    setIsEditing(false);
  };

  // 🔥 CALCULATIONS (CURRENT MONTH ONLY)
  const total = currentExpenses.reduce(
    (acc, curr) => acc + Number(curr.amount),
    0
  );

  const remaining = budget - total;
  const percentage =
    budget > 0 ? Math.min((total / budget) * 100, 100) : 0;

  // 🔥 PIE DATA (CURRENT MONTH ONLY)
  const pieData = Object.values(
    currentExpenses.reduce((acc, curr) => {
      if (!acc[curr.category]) {
        acc[curr.category] = { name: curr.category, value: 0 };
      }
      acc[curr.category].value += Number(curr.amount);
      return acc;
    }, {})
  );

  // 🔥 MONTHLY TREND (FIXED ORDER)
  const monthlyDataRaw = expenses.reduce((acc, curr) => {
    const date = new Date(curr.createdAt);
    const monthIndex = date.getMonth(); // 0-11
    const monthName = date.toLocaleString("default", { month: "short" });

    if (!acc[monthIndex]) {
      acc[monthIndex] = {
        month: monthName,
        amount: 0,
        index: monthIndex,
      };
    }

    acc[monthIndex].amount += Number(curr.amount);

    return acc;
  }, {});

  // 🔥 SORT FIX (IMPORTANT)
  const monthlyData = Object.values(monthlyDataRaw).sort(
    (a, b) => a.index - b.index
  );

  return (
    <div className="flex-1 p-6 bg-gray-100 min-h-screen">

      {/* 🔥 TOP CARDS */}
      <div className="grid grid-cols-4 gap-6 mb-6">

        {/* TOTAL BUDGET */}
        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Total Budget</p>

          {isEditing ? (
            <div className="flex gap-2 mt-2">
              <input
                type="number"
                value={tempBudget}
                onChange={(e) => setTempBudget(e.target.value)}
                className="border p-1 rounded w-full"
              />
              <button
                onClick={saveBudget}
                className="bg-green-500 text-white px-3 rounded"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="flex justify-between items-center mt-2">
              <h2 className="text-xl font-bold">₹{budget}</h2>
              <button
                onClick={() => {
                  setIsEditing(true);
                  setTempBudget(budget);
                }}
                className="text-blue-500 text-sm"
              >
                Edit
              </button>
            </div>
          )}
        </div>

        {/* TOTAL SPENDING */}
        <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4">
          <Wallet className="text-blue-500" />
          <div>
            <p className="text-gray-500">Total Spending</p>
            <h2 className="text-xl font-bold">₹{total}</h2>
          </div>
        </div>

        {/* TRANSACTIONS */}
        <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4">
          <TrendingUp className="text-green-500" />
          <div>
            <p className="text-gray-500">Transactions</p>
            <h2 className="text-xl font-bold">
              {currentExpenses.length}
            </h2>
          </div>
        </div>

        {/* CATEGORIES */}
        <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4">
          <List className="text-purple-500" />
          <div>
            <p className="text-gray-500">Categories</p>
            <h2 className="text-xl font-bold">
              {[...new Set(currentExpenses.map(e => e.category))].length}
            </h2>
          </div>
        </div>

      </div>

      {/* 🔥 BUDGET BAR */}
      <div className="bg-white p-5 rounded-xl shadow mb-6">

        <div className="flex justify-between mb-2">
          <p className="text-gray-600 font-medium">Budget Usage</p>

          <p className={`font-semibold ${remaining < 0 ? "text-red-500" : "text-green-600"}`}>
            {remaining >= 0
              ? `Remaining: ₹${remaining}`
              : `Exceeded: ₹${Math.abs(remaining)}`}
          </p>
        </div>

        <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
          <div
            className={`h-3 ${
              percentage < 80
                ? "bg-green-500"
                : percentage < 100
                ? "bg-yellow-400"
                : "bg-red-500"
            }`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>

      </div>

      {/* 🔥 CHARTS */}
      <div className="grid grid-cols-2 gap-6">

        {/* PIE */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold mb-2">Category Breakdown</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" outerRadius={100} label>
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* LINE */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold mb-2">Monthly Spending</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />

              <Line
                type="monotone"
                dataKey="amount"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;