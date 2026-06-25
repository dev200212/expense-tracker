import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async (e) => {
    e.preventDefault();

   const response = await fetch(
    "http://localhost:8080/api/users/login",
    {
      method:"POST",
      headers:{
        
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        email,
        password
      }),
    }
   )

   try {
  const result = await response.text();
  // console.log(token);

  // Check if data exists and has id
  if (result === "OTP Sent") {
    localStorage.setItem("email", email);
    navigate("/otp");
  } else {
    alert(result);
  }

} catch (err) {
  console.log(err);
  alert("register pls");
}
  }

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center px-4">
      
      {/* Card */}
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        
        {/* Title */}
        <h1 className="text-3xl font-bold text-green-700 text-center mb-6">
          Login
        </h1>

        {/* Email */}
        <div className="mb-4">
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {email && !validEmail && (
            <p className="text-red-500 text-sm mt-1">
              Please enter valid email
            </p>
          )}
        </div>

        {/* Password */}
        <div className="mb-4">
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {password && password.length < 8 && (
            <p className="text-red-500 text-sm mt-1">
              Password must be at least 8 characters
            </p>
          )}
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={!validEmail || password.length < 8}
          className={`w-full py-2 rounded-lg text-white transition duration-300 ${
            !validEmail || password.length < 8
              ? "bg-green-300 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          Login
        </button>

        {/* Register */}
        <div className="text-center mt-4">
          <span className="text-gray-600">Don't have account?</span>
          <br />
          <button
            onClick={() => navigate("/register")}
            className="text-green-600 font-semibold mt-1 hover:underline"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;