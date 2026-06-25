import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (
      !user.firstName ||
      !user.lastName ||
      !user.phoneNumber ||
      !user.email ||
      !user.password
    ) {
      alert("Please fill all fields");
      return;
    }

    if (!validEmail) {
      alert("Invalid email");
      return;
    }

    if (user.password.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }

    if (user.password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const response = await fetch(
      "http://localhost:8080/api/users/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      }
    );
    // console.log(response.status)
    // console.log(await response.text())

    const data = await response.text();
    console.log(data);

    alert("Registration Successful");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center px-4">
      
      {/* Card */}
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        
        <h1 className="text-3xl font-bold text-green-700 text-center mb-6">
          Register
        </h1>

        {/* First Name */}
        <input
          type="text"
          placeholder="First Name"
          value={user.firstName}
          onChange={(e) =>
            setUser({ ...user, firstName: e.target.value })
          }
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:ring-2 focus:ring-green-500"
        />

        {/* Last Name */}
        <input
          type="text"
          placeholder="Last Name"
          value={user.lastName}
          onChange={(e) =>
            setUser({ ...user, lastName: e.target.value })
          }
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:ring-2 focus:ring-green-500"
        />

        {/* Phone */}
        <input
          type="number"
          placeholder="Phone Number"
          value={user.phoneNumber}
          onChange={(e) =>
            setUser({ ...user, phoneNumber: e.target.value })
          }
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:ring-2 focus:ring-green-500"
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={user.email}
          onChange={(e) =>
            setUser({ ...user, email: e.target.value })
          }
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-2 focus:ring-2 focus:ring-green-500"
        />
        {user.email && !validEmail && (
          <p className="text-red-500 text-sm mb-2">
            Please enter valid email
          </p>
        )}

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          value={user.password}
          onChange={(e) =>
            setUser({ ...user, password: e.target.value })
          }
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-2 focus:ring-2 focus:ring-green-500"
        />
        {user.password && user.password.length < 8 && (
          <p className="text-red-500 text-sm mb-2">
            Password must be at least 8 characters
          </p>
        )}

        {/* Confirm Password */}
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:ring-2 focus:ring-green-500"
        />
        {confirmPassword && user.password !== confirmPassword && (
          <p className="text-red-500 text-sm mb-2">
            Passwords do not match
          </p>
        )}

        {/* Button */}
        <button
          onClick={handleRegister}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition duration-300"
        >
          Register
        </button>

        {/* Login redirect */}
        <p className="text-center mt-4 text-gray-600">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-green-600 font-semibold cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;