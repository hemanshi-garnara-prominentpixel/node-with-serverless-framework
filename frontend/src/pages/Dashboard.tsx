import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthProvide";

interface User {
  id: string;
  username: string;
  email: string;
  isActive: boolean;
}

const Dashboard = () => {
  const { userData, refreshAuth } = useAuth();
  const [otherUsers, setOtherUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOtherUsers = async () => {
    try {
      const response = await axios.get<{ users: User[] }>(
        "http://localhost:3000/users/allUsers",
        { withCredentials: true }
      );
      setOtherUsers(response.data.users);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData) fetchOtherUsers();
  }, [userData]);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/users/logout",
        {},
        { withCredentials: true }
      );
      refreshAuth();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (!userData) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition duration-200"
        >
          Logout
        </button>
      </div>

      {/* Profile Card */}
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
            {/* <span
              className={`px-3 py-1 rounded-full text-white text-sm ${
                (userData as any).isActive ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {(userData as any).isActive ? "Active" : "Inactive"}
            </span> */}
          </p>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-gray-600">
                  Loading users...
                </td>
              </tr>
            ) : otherUsers.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-gray-600">
                  No other users
                </td>
              </tr>
            ) : (
              otherUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition duration-150"
                >
                  <td className="px-6 py-4 text-gray-800">{user.username}</td>
                  <td className="px-6 py-4 text-gray-800">{user.email}</td>
                  <td className="px-6 py-4">
                    {/* <span
                      className={`px-3 py-1 rounded-full text-white text-sm ${
                        user.isActive ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span> */}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
