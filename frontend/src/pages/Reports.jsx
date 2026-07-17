import { useEffect, useState } from "react";
import { getExpenses } from "../services/expenseService";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import {
  TrendingUp,
  IndianRupee,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

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

const Reports = () => {
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const token = user?.token;

  const [expenses, setExpenses] = useState([]);
  const [month, setMonth] = useState("All");

  // ✅ ALL MONTHS
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    const data = await getExpenses(token);
    setExpenses(data);
  };

  // 🔥 FILTER
  const filtered =
    month === "All"
      ? expenses
      : expenses.filter(
          (e) =>
            new Date(e.createdAt).toLocaleString("default", {
              month: "short",
            }) === month
        );

  // 🔥 METRICS
  const total = filtered.reduce((a, b) => a + Number(b.amount), 0);
  const avg = filtered.length ? Math.round(total / filtered.length) : 0;
  const highest = Math.max(...filtered.map((e) => e.amount), 0);

  // 🔥 CATEGORY DATA
  const pieData = Object.values(
    filtered.reduce((acc, curr) => {
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
    const monthIndex = date.getMonth();
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

  // ✅ SORT FIX
  const monthlyData = Object.values(monthlyDataRaw).sort(
    (a, b) => a.index - b.index
  );

  // 🔥 AI INSIGHT
  const insight =
    total > 60000
      ? "🚨 You are spending aggressively. Consider reducing non-essential expenses."
      : total > 30000
      ? "⚡ Moderate spending — keep an eye on category distribution."
      : "✅ Great control over your expenses!";

  return (
    <div className="p-6 space-y-6">

      {/* 🔥 HERO HEADER */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6 rounded-2xl shadow-lg flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Financial Overview</h1>
          <p className="text-sm opacity-80">
            Track, analyze, and optimize your spending
          </p>
        </div>

        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="text-black px-3 py-2 rounded-lg"
        >
          <option value="All">All</option>
          {months.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {/* 🔥 KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Total Spending" value={total} icon={<IndianRupee />} />
        <Card title="Average Expense" value={avg} icon={<TrendingUp />} />
        <Card title="Highest Expense" value={highest} icon={<AlertTriangle />} />
      </div>

      {/* 🔥 CHART SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* 📈 AREA CHART */}
        <div className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition">
          <h3 className="font-semibold mb-3">Spending Trend</h3>

          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>

              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />

              <Area
                type="monotone"
                dataKey="amount"
                stroke="#6366f1"
                fill="url(#color)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* 🍩 DONUT */}
        <div className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition">
          <h3 className="font-semibold mb-3">Category Distribution</h3>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                innerRadius={70}
                outerRadius={100}
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* 🔥 TOP EXPENSES */}
      <div className="bg-white p-5 rounded-2xl shadow">
        <h3 className="font-semibold mb-3">Top Spending</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[...filtered]
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 3)
            .map((e) => (
              <div
                key={e._id}
                className="border p-3 rounded-lg hover:shadow-md transition"
              >
                <p className="font-semibold">{e.title}</p>
                <p className="text-sm text-gray-500">{e.category}</p>
                <p className="font-bold mt-1">₹{e.amount}</p>
              </div>
            ))}
        </div>
      </div>

      {/* 🔥 AI INSIGHT */}
      <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-xl flex gap-3 items-center">
        <Sparkles className="text-indigo-500" />
        <p className="text-sm">{insight}</p>
      </div>

    </div>
  );
};

const Card = ({ title, value, icon }) => (
  <div className="bg-white p-5 rounded-2xl shadow flex items-center gap-4 hover:shadow-lg transition">
    <div className="p-3 bg-gray-100 rounded-full">{icon}</div>
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-xl font-bold">₹{value}</h2>
    </div>
  </div>
);

export default Reports;