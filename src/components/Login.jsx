import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"

function Login() {
  
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async () => {

  if (loading) return; // prevent multiple calls

  try {
    setLoading(true);

    const response = await fetch(
      "http://localhost:8080/api/users/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    const result = await response.text();

    if (result === "OTP Sent") {
      localStorage.setItem("email", email);
      navigate("/otp");
    } else {
      alert(result);
    }

  } catch (err) {
    console.log(err);
    alert("Please register first");
  } finally {
    setLoading(false);
  }
};


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
  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      placeholder="Enter password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          console.log("Enter pressed")
          handleLogin();
        }
      }}
      className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-green-500"
    />

    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-600"
    >
      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
    </button>
  </div>

  {password && password.length < 8 && (
    <p className="text-red-500 text-sm mt-1">
      Password must be at least 8 characters
    </p>
  )}
</div>

        {/* Login Button */}
        <button
  onClick={handleLogin}
  disabled={!validEmail || password.length < 8 || loading}
  className={`w-full py-2 rounded-lg text-white transition duration-300 flex items-center justify-center gap-2 ${
    !validEmail || password.length < 8 || loading
      ? "bg-green-300 cursor-not-allowed"
      : "bg-green-600 hover:bg-green-700"
  }`}
>
  {loading ? (
    <>
      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      Sending OTP...
    </>
  ) : (
    "Login"
  )}
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