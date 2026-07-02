import { useEffect, useState } from "react";
import "./Admin.css";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useNavigate } from "react-router-dom";


function Admin() {
  const BASE_URL = "http://localhost:8080/admin";

  const navigate = useNavigate();


  const [dashboard, setDashboard] = useState({
    totalUsers: 0,
    totalExpenses: 0,
    totalAmount: 0,
  });

  const [users, setUsers] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const [editingUserId, setEditingUserId] = useState(null);
  const [editingExpenseId, setEditingExpenseId] = useState(null);

  const [userForm, setUserForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    role: "",
  });

  const [expenseForm, setExpenseForm] = useState({
    title: "",
    amount: "",
  });

  // ✅ Get token from localStorage
  const token = localStorage.getItem("token");

  // ✅ Common headers
  const getHeaders = () => {
    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  };

  // ✅ Safe JSON response handler
  const handleResponse = async (res) => {
    if (!res.ok) {
      if (res.status === 403) {
        throw new Error("403 Forbidden: You are not authorized as ADMIN");
      }

      if (res.status === 401) {
        throw new Error("401 Unauthorized: Please login again");
      }

      throw new Error(`Request failed with status ${res.status}`);
    }

    const text = await res.text();

    if (!text) {
      return null;
    }

    try{
      return JSON.parse(text);
    } catch{
      return text;
    }
  };

  // ================= LOAD DASHBOARD =================
  const loadDashboard = async () => {
    try {
      const res = await fetch(`${BASE_URL}/dashboard`, {
        method: "GET",
        headers: getHeaders(),
      });

      const data = await handleResponse(res);

      if (data) {
        setDashboard(data);
      }
    } catch (error) {
      console.log("Dashboard error:", error.message);
    }
  };

  // ================= LOAD USERS =================
  const loadUsers = async () => {
    try {
      const res = await fetch(`${BASE_URL}/users`, {
        method: "GET",
        headers: getHeaders(),
      });

      const data = await handleResponse(res);

      if (data) {
        setUsers(data);
      }
    } catch (error) {
      console.log("Users error:", error.message);
    }
  };

  // ================= LOAD EXPENSES =================
  const loadExpenses = async () => {
    try {
      const res = await fetch(`${BASE_URL}/expenses`, {
        method: "GET",
        headers: getHeaders(),
      });

      const data = await handleResponse(res);

      if (data) {
        setExpenses(data);
      }
    } catch (error) {
      console.log("Expenses error:", error.message);
    }
  };

  const loadAllData = () => {
    loadDashboard();
    loadUsers();
    loadExpenses();
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // ================= GRAPH DATA =================
  const graphData = expenses.map((expense) => ({
    name: expense.title || "Expense",
    amount: Number(expense.amount || 0),
  }));

  // ================= DELETE USER =================
  const deleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(`${BASE_URL}/users/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`
        },
      });

      await handleResponse(res);

      alert("User deleted successfully");
      loadAllData();
    } catch (error) {
      console.log("Delete user error:", error.message);
      alert(error.message);
    }
  };

  // ================= OPEN USER EDIT =================
  const openUserEdit = (user) => {
    setEditingUserId(user.id);

    setUserForm({
      email: user.email || "",
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      phoneNumber: user.phoneNumber || "",
      role: user.role || "",
    });
  };

  // ================= USER FORM CHANGE =================
  const handleUserChange = (e) => {
    setUserForm({
      ...userForm,
      [e.target.name]: e.target.value,
    });
  };

  // ================= UPDATE USER =================
  const updateUser = async (e) => {
    e.preventDefault();

    try {
      // ✅ Fixed URL here
      const res = await fetch(`${BASE_URL}/users/${editingUserId}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(userForm),
      });

      await handleResponse(res);

      alert("User updated successfully");

      setEditingUserId(null);

      setUserForm({
        email: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        role: "",
      });

      loadAllData();
    } catch (error) {
      console.log("Update user error:", error.message);
      alert(error.message);
    }
  };

  const cancelUserEdit = () => {
    setEditingUserId(null);

    setUserForm({
      email: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      role: "",
    });
  };

  // ================= DELETE EXPENSE =================
  const deleteExpense = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this expense?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(`${BASE_URL}/expenses/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      await handleResponse(res);

      alert("Expense deleted successfully");
      loadAllData();
    } catch (error) {
      console.log("Delete expense error:", error.message);
      alert(error.message);
    }
  };

  // ================= OPEN EXPENSE EDIT =================
  const openEditExpense = (expense) => {
    setEditingExpenseId(expense.id);

    setExpenseForm({
      title: expense.title || "",
      amount: expense.amount || "",
    });
  };

  // ================= EXPENSE FORM CHANGE =================
  const handleExpenseChange = (e) => {
    setExpenseForm({
      ...expenseForm,
      [e.target.name]: e.target.value,
    });
  };

  // ================= UPDATE EXPENSE =================
  const updateExpense = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${BASE_URL}/expenses/${editingExpenseId}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({
          ...expenseForm,
          amount: Number(expenseForm.amount),
        }),
      });

      await handleResponse(res);

      alert("Expense updated successfully");

      setEditingExpenseId(null);

      setExpenseForm({
        title: "",
        amount: "",
      });

      loadAllData();
    } catch (error) {
      console.log("Update expense error:", error.message);
      alert(error.message);
    }
  };

  const cancelExpenseEdit = () => {
    setEditingExpenseId(null);

    setExpenseForm({
      title: "",
      amount: "",
    });
  };

  const COLORS = [
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#0088FE",
  "#AF19FF",
  "#FF4560",
  "#775DD0",
  "#26A69A",
];

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage users and expenses</p>

        <button
  onClick={() => {
    localStorage.removeItem("token");
    navigate("/");
  }}
  className="px-5 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 shadow-lg hover:shadow-red-300 transition-all duration-300 hover:-translate-y-1"
>
  Logout
</button>
      </div>
      

      {/* ================= DASHBOARD CARDS ================= */}
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>Total Users</h3>
          <h2>{dashboard.totalUsers}</h2>
        </div>

        <div className="dashboard-card">
          <h3>Total Expenses</h3>
          <h2>{dashboard.totalExpenses}</h2>
        </div>

        <div className="dashboard-card">
          <h3>Total Amount</h3>
          <h2>₹ {dashboard.totalAmount}</h2>
        </div>
      </div>

      {/* ================= GRAPH ================= */}
      {/* ================= PIE CHART ================= */}
<div className="chart-box">
  <h2>Expense Analytics</h2>

  {graphData.length > 0 ? (
    <ResponsiveContainer width="100%" height={450}>
      <PieChart>
        <Pie
          data={graphData}
          dataKey="amount"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={90}
          outerRadius={150}
          paddingAngle={5}
          label={({ name, percent }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          }
        >
          {graphData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>

        {/* Total Amount in Center */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{
            fontSize: "22px",
            fontWeight: "700",
            fill: "#1e293b",
          }}
        >
          ₹ {dashboard.totalAmount}
        </text>

        <Tooltip
          contentStyle={{
            borderRadius: "12px",
            border: "none",
            boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
          }}
        />

        <Legend />
      </PieChart>
    </ResponsiveContainer>
  ) : (
    <p className="empty-text">No expense data available</p>
  )}
</div>

      {/* ================= EDIT USER FORM ================= */}
      {editingUserId && (
        <div className="edit-box">
          <h2>Edit User</h2>

          <form onSubmit={updateUser} className="edit-form">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={userForm.email}
              onChange={handleUserChange}
              required
            />

            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={userForm.firstName}
              onChange={handleUserChange}
              required
            />

            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={userForm.lastName}
              onChange={handleUserChange}
              required
            />

            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number"
              value={userForm.phoneNumber}
              onChange={handleUserChange}
              required
            />

            <select
              name="role"
              value={userForm.role}
              onChange={handleUserChange}
              required
            >
              <option value="">Select Role</option>
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>

            <button type="submit">Update User</button>

            <button
              type="button"
              className="cancel-btn"
              onClick={cancelUserEdit}
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* ================= EDIT EXPENSE FORM ================= */}
      {editingExpenseId && (
        <div className="edit-box">
          <h2>Edit Expense</h2>

          <form onSubmit={updateExpense} className="edit-form">
            <input
              type="text"
              name="title"
              placeholder="Expense Title"
              value={expenseForm.title}
              onChange={handleExpenseChange}
              required
            />

            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={expenseForm.amount}
              onChange={handleExpenseChange}
              required
            />

            <button type="submit">Update Expense</button>

            <button
              type="button"
              className="cancel-btn"
              onClick={cancelExpenseEdit}
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* ================= USER LIST ================= */}
      <div className="table-box">
        <h2>User List</h2>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.email}</td>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.phoneNumber}</td>
                    <td>
                      <span
                        className={
                          user.role === "ADMIN"
                            ? "role admin-role"
                            : "role user-role"
                        }
                      >
                        {user.role || "NO ROLE"}
                      </span>
                    </td>
                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => openUserEdit(user)}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => deleteUser(user.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= EXPENSE LIST ================= */}
      <div className="table-box">
        <h2>Expense List</h2>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Amount</th>
                <th>User</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {expenses.length > 0 ? (
                expenses.map((expense) => (
                  <tr key={expense.id}>
                    <td>{expense.id}</td>
                    <td>{expense.title}</td>
                    <td>₹ {expense.amount}</td>
                    <td>
                      {expense.user
                        ? expense.user.email || expense.user.firstName
                        : "N/A"}
                    </td>
                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => openEditExpense(expense)}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => deleteExpense(expense.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No expenses found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Admin;