import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../api/client";
import useAuth from "../context/useAuth";
import MessageBanner from "../components/MessageBanner.jsx";

const initialState = {
  name: "",
  email: "",
  password: "",
};

function RegisterPage() {
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const onChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setMessage({ type: "", text: "" });
    setLoading(true);

    try {
      const response = await apiClient.post("/auth/register", formData);
      login(response.data.data);
      setMessage({ type: "success", text: response.data.message || "Registration successful" });
      navigate("/dashboard");
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Unable to register. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card auth-card">
      <h2>Create Account</h2>
      <p className="muted">Register to receive a JWT and access secured task APIs.</p>
      <MessageBanner type={message.type} message={message.text} />
      <form onSubmit={onSubmit} className="form-grid">
        <label htmlFor="name">
          Full Name
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={onChange}
            placeholder="John Doe"
          />
        </label>
        <label htmlFor="email">
          Email
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={onChange}
            placeholder="john@example.com"
          />
        </label>
        <label htmlFor="password">
          Password
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            value={formData.password}
            onChange={onChange}
            placeholder="SecurePass123"
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>
      <p className="helper-text">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </section>
  );
}

export default RegisterPage;
