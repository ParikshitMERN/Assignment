import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (data.token) {
        setSuccess(true);
        setTimeout(() => navigate("/admin/login"), 2000);
      } else {
        throw new Error(data.message || "Registration failed");
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
          <p className="text-gray-500 mt-2">Create Admin Account</p>
        </div>

        <div className="bg-white p-8 shadow-sm">
          {success ? (
            <div className="text-center">
              <div className="text-green-500 text-5xl mb-4">✓</div>
              <p className="text-green-700 font-medium">
                Registration successful!
              </p>
              <p className="text-gray-500 mt-2">Redirecting to login...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-dark font-medium mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 focus:border-primary-900 focus:outline-none"
                  placeholder="Your name"
                />
              </div>

              <div className="mb-6">
                <label className="block text-dark font-medium mb-2">
                  Email
                </label>
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
                  minLength={6}
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
                {loading ? "Creating account..." : "Register"}
              </button>

              <p className="text-center mt-6 text-gray-500">
                Already have an account?{" "}
                <Link
                  to="/admin/login"
                  className="text-gold-400 hover:underline"
                >
                  Login
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
