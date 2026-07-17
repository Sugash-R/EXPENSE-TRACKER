import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  Wallet,
  LayoutDashboard,
  PlusCircle,
  List,
  PieChart,
  LogOut,
  User,
} from "lucide-react";

const Layout = () => {
  const [showProfile, setShowProfile] = useState(false);

  const user = JSON.parse(localStorage.getItem("userInfo"));

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    window.location.href = "/login";
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <div className="w-64 bg-white shadow-lg p-5 flex flex-col justify-between">

        {/* TOP SECTION */}
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2 mb-10">
            <Wallet /> Expense Tracker
          </h1>

          <nav className="flex flex-col gap-2">

            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 rounded-lg ${
                  isActive ? "bg-blue-500 text-white" : "hover:text-blue-500"
                }`
              }
            >
              <LayoutDashboard size={18}/> Dashboard
            </NavLink>

            <NavLink
              to="/add-expense"
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 rounded-lg ${
                  isActive ? "bg-blue-500 text-white" : "hover:text-blue-500"
                }`
              }
            >
              <PlusCircle size={18}/> Add Expense
            </NavLink>

            <NavLink
              to="/expenses"
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 rounded-lg ${
                  isActive ? "bg-blue-500 text-white" : "hover:text-blue-500"
                }`
              }
            >
              <List size={18}/> Expenses
            </NavLink>

            <NavLink
              to="/reports"
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 rounded-lg ${
                  isActive ? "bg-blue-500 text-white" : "hover:text-blue-500"
                }`
              }
            >
              <PieChart size={18}/> Reports
            </NavLink>

          </nav>
        </div>

        {/* 🔥 BOTTOM SECTION */}
        <div className="space-y-3">

          {/* 👤 PROFILE ICON */}
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 text-gray-700 hover:text-blue-500"
          >
            <User size={18}/> Profile
          </button>

          {/* 🔽 PROFILE INFO (TOGGLE) */}
          {showProfile && (
            <div className="bg-gray-100 p-3 rounded-lg text-sm">
              <p><span className="font-semibold">Name:</span> {user?.name}</p>
              <p><span className="font-semibold">Email:</span> {user?.email}</p>
            </div>
          )}

          {/* 🚪 LOGOUT */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500"
          >
            <LogOut size={18}/> Logout
          </button>

        </div>

      </div>

      {/* PAGE CONTENT */}
      <div className="flex-1 p-6">
        <Outlet />
      </div>

    </div>
  );
};

export default Layout;