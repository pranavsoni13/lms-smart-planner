import React from "react";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
  <Route path="/" element={token ? <Navigate to="/dashboard" replace /> : <Login />} />
  <Route path="/login" element={token ? <Navigate to="/dashboard" replace /> : <Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/" replace />} />
  <Route path="*" element={<Navigate to={token ? "/dashboard" : "/"} replace />} />
</Routes>
    </BrowserRouter>
  );
}

export default App;