import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

function OTP() {
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
   const enteredOtp = otp.join("");
   const response = await fetch("http://localhost:8080/api/users/verifyOtp", {
       method: "POST",
       headers: {
           "Content-Type": "application/json"
       },
       body: JSON.stringify({
           email: localStorage.getItem("email"),
           otp: enteredOtp
       })
   });
   const token = await response.text();
   if (token !== "Invalid OTP") {
       localStorage.setItem("token", token);
       navigate("/user");
   } else {
       alert("Invalid OTP");
   }
}
 

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
        <button onClick={handleVerify} className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold transition">
          Verify
        </button>

      </div>
    </div>
  );
}

export default OTP;