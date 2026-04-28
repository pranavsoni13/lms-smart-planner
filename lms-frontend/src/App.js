import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        {/* first load = login */}
        <Route path="/" element={<Login />} />

        {/* register page */}
        <Route path="/register" element={<Register />} />

        {/* protected dashboard */}
        <Route
          path="/dashboard"
          element={token ? <Dashboard /> : <Login />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;