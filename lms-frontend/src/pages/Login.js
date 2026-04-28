import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
  try {
    const res = await API.post("/login", {
      email,
      password,
    });

    if (res.data.access_token) {
      localStorage.setItem("token", res.data.access_token);
      navigate("/dashboard");
    } else {
      alert("Invalid email or password");
    }
  } catch (err) {
    console.log(err);
    alert("Login failed. Please check your credentials.");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-gray-800 p-6 rounded-xl w-96">
        <h1 className="text-2xl font-bold mb-4">Login</h1>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-3 rounded text-black"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-3 rounded text-black"
        />

        <button
          onClick={handleLogin}
          className="bg-blue-500 px-4 py-2 rounded w-full"
        >
          Login
        </button>
        <p className="mt-4 text-center">
  Don’t have an account?{" "}
  <span
    onClick={() => navigate("/register")}
    className="text-blue-400 cursor-pointer"
  >
    Signup
  </span>
</p>
      </div>
    </div>
  );
};

export default Login;