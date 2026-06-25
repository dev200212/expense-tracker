import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center px-4">
      
      {/* Card */}
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md text-center">
        
        {/* Title */}
        <h1 className="text-4xl font-bold text-green-700 mb-4">
          Expense Tracker
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-6">
          Easily track and manage your daily expenses in a simple and organized way.
        </p>

        {/* Button */}
        <button
          onClick={() => navigate("/login")}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition duration-300 shadow-md"
        >
          Login
        </button>

      </div>

      {/* Footer text */}
      <p className="mt-6 text-sm text-green-700 opacity-70">
        Manage your money smarter 💰
      </p>

    </div>
  );
}

export default Home;