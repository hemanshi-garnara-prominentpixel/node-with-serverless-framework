import axios from "axios";
import { useAuth } from "../context/AuthProvide";
import { useNavigate } from "react-router-dom";
import UsersList from "../components/UsersList";

const Dashboard = () => {
  const { socket, userData, refreshAuth } = useAuth();

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      if (socket && socket.connected && userData) {
        socket.emit("userOffline", userData.id);
      }
      await axios.post(
        "http://localhost:3000/users/logout",
        {},
        { withCredentials: true }
      );
      refreshAuth();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (!userData) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition duration-200"
        >
          Logout
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-xl p-6 max-w-md mx-auto sm:mx-0 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Your Profile
        </h2>
        <div className="space-y-2">
          <p>
            <span className="font-medium text-gray-700">Username:</span>{" "}
            {userData.username || "N/A"}
          </p>
          <p>
            <span className="font-medium text-gray-700">Email:</span>{" "}
            {userData.email}
          </p>
          <p>
            <span className="font-medium text-gray-700">Status:</span>{" "}
            <span
              className={`px-3 py-1 rounded-full text-white text-sm ${
                userData.status === "Active" ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {userData.status === "Active" ? "Active" : "Inactive"}
            </span>
          </p>
        </div>
      </div>
      <UsersList />
    </div>
  );
};

export default Dashboard;
