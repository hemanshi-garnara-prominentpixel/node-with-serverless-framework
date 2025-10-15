import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvide";

interface User {
  id: string;
  username: string;
  email: string;
  status: string;
}
const UsersList = () => {
  const { userData, socket } = useAuth();
  const [otherUsers, setOtherUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOtherUsers = async () => {
    try {
      const response = await axios.get<{ users: User[] }>(
        "http://localhost:3000/users/allUsers",
        { withCredentials: true }
      );
      setOtherUsers(response.data.users);
      console.log(otherUsers);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData) fetchOtherUsers();
  }, [userData]);

  useEffect(() => {
    if (!socket) return;

    const handleStatusUpdate = (update: { userId: string; status: string }) => {
      setOtherUsers((prev) =>
        prev.map((user) =>
          user.id === update.userId ? { ...user, status: update.status } : user
        )
      );
    };

    socket.on("userStatusUpdate", handleStatusUpdate);

    return () => {
      socket.off("userStatusUpdate", handleStatusUpdate);
    };
  }, [socket]);
  return (
    <>
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
                    <span
                      className={`px-3 py-1 rounded-full text-white text-sm ${
                        user.status === "Active" ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {user.status === "Active" ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default UsersList;
