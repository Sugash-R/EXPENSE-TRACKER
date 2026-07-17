import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

import Dashboard from "./pages/Dashboard";
import AddExpense from "./pages/AddExpense";
import Expenses from "./pages/Expenses";
import Profile from "./pages/Profile";
import Reports from "./pages/Reports";

import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout"; // ✅ ADD THIS

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 🔐 PROTECTED ROUTES */}
        <Route element={<ProtectedRoute />}>

          {/* 🔥 LAYOUT WRAPPER */}
          <Route element={<Layout />}>

            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-expense" element={<AddExpense />} />
            <Route path="/expenses" element={<Expenses />} />
            
            <Route path="/reports" element={<Reports />} />

          </Route>

        </Route>

        {/* DEFAULT */}
        <Route path="*" element={<Login />} />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;