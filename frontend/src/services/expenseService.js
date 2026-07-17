import axios from "axios";

const API_URL = "http://localhost:5000/api/expenses";

// 🔹 GET ALL EXPENSES
export const getExpenses = async (token) => {
  try {
    const res = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching expenses:", error.response?.data || error.message);
    return [];
  }
};

// 🔹 ADD EXPENSE
export const addExpense = async (expenseData, token) => {
  try {
    const res = await axios.post(API_URL, expenseData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error adding expense:", error.response?.data || error.message);
    throw error;
  }
};

// 🔹 DELETE EXPENSE
export const deleteExpense = async (id, token) => {
  try {
    const res = await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error deleting expense:", error.response?.data || error.message);
    throw error;
  }
};

// 🔹 UPDATE EXPENSE (🔥 FIXED)
export const updateExpense = async (id, updatedData, token) => {
  try {
    console.log("Updating ID:", id);
    console.log("Sending Data:", updatedData);

    const res = await axios.put(
      `${API_URL}/${id}`,
      updatedData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Update Response:", res.data);

    return res.data;
  } catch (error) {
    console.error(
      "Error updating expense:",
      error.response?.data || error.message
    );
    throw error;
  }
};