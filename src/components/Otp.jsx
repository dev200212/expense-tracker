import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function OTP() {
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);
  const navigate = useNavigate();


  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return; // only number

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // move forward
    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // move back on backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {

  if (loading) return;

  try {
    setLoading(true);

    const enteredOtp = otp.join("");

    const response = await fetch(
      "http://localhost:8080/api/users/verifyOtp",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: localStorage.getItem("email"),
          otp: enteredOtp,
        }),
      }
    );

    const data = await response.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      if (data.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/user");
      }
    } else {
      alert("Invalid OTP");

      setOtp(["", "", "", "", "", ""]);
      inputsRef.current[0]?.focus();
    }
  } catch (err) {
    console.log(err);
    alert("Invalid OTP");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  const enteredOtp = otp.join("");

  if (enteredOtp.length === 6 && !otp.includes("")) {
    handleVerify();
  }
}, [otp]);

 

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100">
      
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center w-[350px]">
        
        {/* Title */}
        <h2 className="text-2xl font-bold text-green-600 mb-2">
          Verify OTP
        </h2>

        <p className="text-gray-500 mb-6">
          Enter the 6 digit code
        </p>

        {/* OTP Inputs */}
        <div className="flex justify-center gap-3 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={digit}
              ref={(el) => (inputsRef.current[index] = el)}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-12 text-center text-xl border-2 border-green-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
            />
          ))}
        </div>

        {/* Button */}
        <button
  onClick={handleVerify}
  disabled={loading || otp.includes("")}
  className={`w-full py-2 rounded-lg font-semibold text-white transition flex items-center justify-center gap-2 ${
    loading || otp.includes("")
      ? "bg-green-300 cursor-not-allowed"
      : "bg-green-500 hover:bg-green-600"
  }`}
>
  {loading ? (
    <>
      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      Verifying...
    </>
  ) : (
    "Verify"
  )}
</button>

      </div>

      {loading && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-2xl shadow-xl text-center w-80">
      <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>

      <h2 className="text-xl font-semibold text-green-700">
        Verifying OTP
      </h2>

      <p className="text-gray-600 mt-2">
        Please wait while we verify your OTP...
      </p>
    </div>
  </div>
)}

    </div>
  );
}

export default OTP;