import axios from "axios";
import React, { useState, type FormEvent } from "react";
import { NavLink, useNavigate } from "react-router-dom";

interface SignUPDataI {
  username: string;
  email: string;
  password: string;
}

const SignUp = () => {
  const [signUPData, setSignUPData] = useState<SignUPDataI>({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const handleSignUPData = async (e: FormEvent) => {
    e.preventDefault();
    console.log(signUPData);

    try {
      const userSignUP = await axios.post(
        "http://localhost:3000/users/signup",
        signUPData,
        {
          withCredentials: true,
        }
      );

      if (!userSignUP) throw new Error("Account not created");

      console.log("Account created successfully!");
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
    setSignUPData({ username: "", email: "", password: "" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border-t-4 border-gray-700">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Create Account
        </h1>

        <form onSubmit={handleSignUPData} className="space-y-4">
          <div>
            <label className="block text-gray-600 text-sm mb-1">Username</label>
            <input
              type="text"
              value={signUPData.username}
              placeholder="Enter your username"
              onChange={(e) =>
                setSignUPData((prev) => ({ ...prev, username: e.target.value }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 text-sm mb-1">Email</label>
            <input
              type="email"
              value={signUPData.email}
              placeholder="Enter your email"
              onChange={(e) =>
                setSignUPData((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 text-sm mb-1">Password</label>
            <input
              type="password"
              value={signUPData.password}
              placeholder="Enter your password"
              onChange={(e) =>
                setSignUPData((prev) => ({ ...prev, password: e.target.value }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 text-sm mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Re-enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-5">
          Already have an account?{" "}
          <NavLink to={"/login"} className="text-gray-800 font-medium">
            Log in
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
