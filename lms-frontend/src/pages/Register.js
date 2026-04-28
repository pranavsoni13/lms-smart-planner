import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

 const handleRegister = async () => {
  try {
    await API.post("/register", {
      email,
      password,
    });

    alert("Registered successfully");
    navigate("/");
  } catch (err) {
    console.log(err);
    alert("Registration failed or user already exists");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-gray-800 p-6 rounded-xl w-96">
        <h1 className="text-2xl font-bold mb-4">Signup</h1>

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
          onClick={handleRegister}
          className="bg-green-500 px-4 py-2 rounded w-full"
        >
          Signup
        </button>
      </div>
    </div>
  );
};

export default Register;