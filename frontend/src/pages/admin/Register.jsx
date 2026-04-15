import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "../../services/api";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      const { data } = await authAPI.checkAdminExists();
      if (data.exists) {
        navigate("/admin/login");
      }
    } catch (error) {
      console.error("Error checking admin:", error);
    } finally {
      setChecking(false);
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
      const { data } = await authAPI.register(formData);

      if (data.token) {
        setSuccess(true);
        setTimeout(() => navigate("/admin/login"), 2000);
      } else {
        throw new Error(data.message || "Registration failed");
      }
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-primary-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Create Admin Account
          </h1>
          <p className="text-gray-500 mt-2">Set up your portfolio admin</p>
        </div>

        <div className="bg-white p-8 border border-gray-200">
          {success ? (
            <div className="text-center py-4">
              <p className="text-green-600 font-medium">
                Account created successfully!
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Redirecting to login...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 focus:border-primary-900 focus:outline-none text-sm"
                  placeholder="Your name"
                />
              </div>

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
                  minLength={6}
                  className="w-full px-3 py-2 border border-gray-300 focus:border-primary-900 focus:outline-none text-sm"
                  placeholder="Min 6 characters"
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
                {loading ? "Creating..." : "Create Account"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
