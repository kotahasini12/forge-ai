
import { useState } from "react";
import { API_BASE_URL } from "./config";

export default function Register({ onRegistered, onSwitchLogin }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    fitnessGoal: "Fitness",
    experience: "Beginner"
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setMessage("Registration successful! Please login.");
      onRegistered?.();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-card">
      <h2>Create your FORGE AI account</h2>
      <p>Start building your fitness journey.</p>

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Full name" value={form.name}
          onChange={updateField} required minLength={2} />

        <input name="email" type="email" placeholder="Email address"
          value={form.email} onChange={updateField} required />

        <input name="password" type="password" placeholder="Password (8+ characters)"
          value={form.password} onChange={updateField} required minLength={8} />

        <select name="fitnessGoal" value={form.fitnessGoal} onChange={updateField}>
          <option>Fitness</option>
          <option>Weight Loss</option>
          <option>Muscle Gain</option>
          <option>General Health</option>
        </select>

        <select name="experience" value={form.experience} onChange={updateField}>
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      {message && <p role="status">{message}</p>}

      <p>
        Already have an account?{" "}
        <button type="button" onClick={onSwitchLogin}>Login</button>
      </p>
    </div>
  );
}
