import axios from "axios";
import { useState, type FormEvent } from "react";
import { NavLink, useNavigate } from "react-router-dom";

interface LoginDataI {
  email: string;
  password: string;
}

const Login = () => {
  const [loginData, setLoginData] = useState<LoginDataI>({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleLoginData = async (e: FormEvent) => {
    e.preventDefault();
    console.log(loginData);
    try {
      const userLogin = await axios.post(
        "http://localhost:3000/users/login",
        loginData,
        {
          withCredentials: true,
        }
      );

      if (!userLogin) throw new Error("Login faield!");

      console.log("Login successfully!");
      navigate("/dashboard");
      setLoginData({ email: "", password: "" });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border-t-4 border-gray-700">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Login
        </h1>

        <form onSubmit={handleLoginData} className="space-y-4">
          <div>
            <label className="block text-gray-600 text-sm mb-1">Email</label>
            <input
              type="email"
              value={loginData.email}
              placeholder="Enter your email"
              onChange={(e) =>
                setLoginData((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 text-sm mb-1">Password</label>
            <input
              type="password"
              value={loginData.password}
              placeholder="Enter your password"
              onChange={(e) =>
                setLoginData((prev) => ({ ...prev, password: e.target.value }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-5">
          Don’t have an account?{" "}
          <NavLink to={"/signup"} className="text-gray-800 font-medium">
            Sign Up
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export default Login;
