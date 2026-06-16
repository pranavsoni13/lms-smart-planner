import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

const Register = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await API.post("/register", form);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.detail || "We couldn't create your account.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-showcase register-showcase">
        <div className="brand auth-brand"><span className="brand-mark">S</span><span>StudyFlow</span></div>
        <div className="showcase-copy"><span className="eyebrow">Your goals, organized</span><h1>Make space for what <em>matters most.</em></h1><p>Bring tasks, deadlines, and study plans together in one calm workspace.</p></div>
        <div className="benefit-list"><span>✓ Clear weekly priorities</span><span>✓ Visual deadline calendar</span><span>✓ Instant smart study plans</span></div>
      </section>
      <section className="auth-form-wrap">
        <form className="auth-form" onSubmit={handleRegister}>
          <span className="mobile-brand">StudyFlow</span><p className="eyebrow">Start planning</p><h2>Create your account</h2><p className="auth-subtitle">A more focused study week is just a minute away.</p>
          {error && <div className="notice" role="alert">{error}</div>}
          <label>Email address<input type="email" required placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
          <label>Password<input type="password" required minLength="6" maxLength="72" placeholder="At least 6 characters" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
          <button className="primary-button auth-submit" disabled={submitting} type="submit">{submitting ? "Creating account…" : "Create account"} <span>→</span></button>
          <p className="auth-switch">Already have an account? <Link to="/">Sign in</Link></p>
        </form>
      </section>
    </main>
  );
};
export default Register;
