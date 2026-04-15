import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (data.token) {
        if (data.role !== "admin") {
          setError("You don't have admin privileges");
          return;
        }
        login(data);
        navigate("/admin/dashboard");
      } else {
        throw new Error(data.message || "Login failed");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-900">
            Port<span className="text-gold-400">folio</span>
          </h1>
          <p className="text-gray-500 mt-2">Admin Login</p>
        </div>

        <div className="bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-dark font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 focus:border-primary-900 focus:outline-none"
                placeholder="your@email.com"
              />
            </div>

            <div className="mb-6">
              <label className="block text-dark font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 focus:border-primary-900 focus:outline-none"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-800 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-900 text-white py-4 hover:bg-primary-800 transition-colors disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p className="text-center mt-6 text-gray-500">
            Don't have an account?{" "}
            <Link
              to="/admin/register"
              className="text-gold-400 hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
