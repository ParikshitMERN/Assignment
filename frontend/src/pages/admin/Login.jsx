import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { authAPI } from "../../services/api";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [adminExists, setAdminExists] = useState(true);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      const { data } = await authAPI.checkAdminExists();
      setAdminExists(data.exists);
      if (!data.exists) {
        navigate("/admin/register");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await authAPI.login(formData);

      if (data.token) {
        if (data.role !== "admin") {
          setError("Access denied");
          return;
        }
        login(data);
        navigate("/admin/dashboard");
      } else {
        throw new Error(data.message || "Login failed");
      }
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Admin Login</h1>
          <p className="text-gray-500 mt-2">Sign in to manage your portfolio</p>
        </div>

        <div className="bg-white p-8 border border-gray-200">
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 focus:border-primary-900 focus:outline-none text-sm"
                placeholder="your@email.com"
              />
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 focus:border-primary-900 focus:outline-none text-sm"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="mb-5 p-3 bg-red-50 text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-900 text-white py-2.5 text-sm font-medium hover:bg-primary-800 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
