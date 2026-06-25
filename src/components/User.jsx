import "../App.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import axios from 'axios'

function User() {
  const userId = localStorage.getItem("userId");
  if(!userId){
    return <h1>Loading...</h1>
  }
  useEffect(()=>{
    if(userId){
      fetchExpense();
    }
  },[userId])
  // console.log("userid:",userId)
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);
  const [editIndex, setEditIndex] = useState(null);

  const COLORS = [
    "#16a34a",
    "#22c55e",
    "#84cc16",
    "#10b981",
    "#14b8a6",
    "#65a30d",
    "#15803d",
  ];

  const fetchExpense = async () => {
    
    const response = await fetch(`http://localhost:8080/expenses`,
      {
        headers:{
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      }
    );
    const data = await response.json();
    // console.log(data)
    setExpenses(data);
  };

  

  const modifyExpense = (index) => {
    const item = expenses[index];

    setTitle(item.title);
    setAmount(item.amount);
    setDate(item.date);

    setEditIndex(item.id);
    
  };

  const addExpenses = async () => {
    if (!title || !amount || !date) {
      alert("Please fill all required fields");
      return;
    }

    const newExpense = {
      title,
      amount: Number(amount),
      date,
      // userId:localStorage.getItem("userId")
    };

    // const userId = localStorage.getItem("userId");

    if(editIndex !== null){
      await fetch(`http://localhost:8080/expenses/update/${editIndex}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token")

      },
      body: JSON.stringify(newExpense),
    });

    }else{
      await fetch(`http://localhost:8080/expenses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token")
      },
      body: JSON.stringify(newExpense),
    });
    }
    

    fetchExpense();

    setTitle("");
    setAmount("");
    setDate("");
    setEditIndex(null);
  };


  const calculateTotal = () => {
    let sum = 0;

    for (let i = 0; i < expenses.length; i++) {
      sum += Number(expenses[i].amount);
    }

    setTotal(sum);
  };

  
const deleteExpense = async (id) => {
  try {
    await axios.delete(`http://localhost:8080/expenses/delete/${id}`,
      {
        headers: {
        
        Authorization: "Bearer " + localStorage.getItem("token")
        }

      }
    );
    fetchExpense(); // refresh list after delete
  } catch (error) {
    console.error("Error deleting expense:", error);
    alert("Failed to delete expense");
  }
};


  return (
    <div className="min-h-screen bg-green-50 px-4 py-6">
      {/* Navbar */}
      <div className="max-w-6xl mx-auto flex justify-between items-center bg-white shadow-md rounded-2xl px-6 py-4 mb-8">
        <h1 className="text-2xl font-bold text-green-700">
          Expense Tracker
        </h1>

        <button
          onClick={() => navigate("/")}
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg transition duration-300"
        >
          Logout
        </button>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Card */}
        <div className="bg-white shadow-xl rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-green-700 mb-5 text-center">
            Add Expense
          </h2>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Expense Name"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-5 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <button
            onClick={addExpenses}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition duration-300 shadow-md"
          >
            {editIndex !== null ? "Update Expense" : "Add Expense"}
          </button>

          <button
            onClick={calculateTotal}
            className="w-full mt-4 bg-lime-600 hover:bg-lime-700 text-white py-2 rounded-lg transition duration-300 shadow-md"
          >
            Calculate Total
          </button>

          <div className="mt-5 bg-green-100 rounded-xl p-4 text-center">
            <h2 className="text-xl font-bold text-green-800">
              Total: Rs.{total}
            </h2>
          </div>
        </div>

        {/* Pie Chart Card */}
        <div className="bg-white shadow-xl rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-green-700 mb-5 text-center">
            Expense Chart
          </h2>

          {expenses.length > 0 ? (
            <div className="w-full h-80">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={expenses}
                    dataKey="amount"
                    nameKey="title"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    label
                  >
                    {expenses.map((item, index) => (
                       
                      <Cell
                        key={index}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-20">
              No expenses added yet
            </p>
          )}
        </div>
      </div>

      {/* Expense List */}
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl p-6 mt-8">
        <h2 className="text-2xl font-bold text-green-700 mb-5">
          Expense List
        </h2>

        {expenses.length === 0 ? (
          <p className="text-gray-500 text-center">No expenses found</p>
        ) : (
          <div className="space-y-4">
            {expenses.map((item, index) => (
        
                
              <div
                key={index}
                className="flex flex-col md:flex-row md:items-center md:justify-between bg-green-50 border border-green-200 rounded-xl p-4"
              >
                <div>
                  <h3 className="font-bold text-green-800 text-lg">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">
                    Rs.{item.amount} on {item.date}
                  </p>
                </div>

                <div className="mt-3 md:mt-0 flex gap-3">
                  <button
                    onClick={() => modifyExpense(index)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg transition duration-300"
                  >
                    Modify
                  </button>
                
                  <button
                    onClick={() => deleteExpense(item.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default User;