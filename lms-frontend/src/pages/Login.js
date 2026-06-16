import React, { useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const { data } = await API.post("/login", form);
      localStorage.setItem("token", data.access_token);
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed. Please check your credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-showcase">
        <div className="brand auth-brand"><span className="brand-mark">S</span><span>StudyFlow</span></div>
        <div className="showcase-copy"><span className="eyebrow">A smarter way to study</span><h1>Turn your goals into <em>daily progress.</em></h1><p>Organize every deadline, see what matters next, and build a study rhythm that lasts.</p></div>
        <div className="quote-card"><span>“</span><p>Success is the sum of small efforts, repeated day in and day out.</p><small>— Robert Collier</small></div>
      </section>
      <section className="auth-form-wrap">
        <form className="auth-form" onSubmit={handleLogin}>
          <span className="mobile-brand">StudyFlow</span><p className="eyebrow">Welcome back</p><h2>Sign in to your workspace</h2><p className="auth-subtitle">Pick up where you left off and keep your momentum going.</p>
          {error && <div className="notice" role="alert">{error}</div>}
          <label>Email address<input type="email" required placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
          <label>Password<input type="password" required minLength="6" placeholder="Enter your password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
          <button className="primary-button auth-submit" disabled={submitting} type="submit">{submitting ? "Signing in…" : "Sign in"} <span>→</span></button>
          <p className="auth-switch">New to StudyFlow? <Link to="/register">Create an account</Link></p>
        </form>
      </section>
    </main>
  );
};
export default Login;
