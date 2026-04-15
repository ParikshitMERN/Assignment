import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: "📊" },
    { name: "Projects", path: "/admin/projects", icon: "💼" },
    { name: "Skills", path: "/admin/skills", icon: "🛠" },
    { name: "Messages", path: "/admin/messages", icon: "✉" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-primary-900 text-white hidden md:block fixed h-full">
        <div className="p-6">
          <Link to="/admin/dashboard" className="text-2xl font-bold">
            Port<span className="text-gold-400">folio</span>
          </Link>
          <p className="text-gray-400 text-sm mt-1">Admin Panel</p>
        </div>

        <nav className="mt-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 transition-colors ${
                location.pathname === item.path
                  ? "bg-primary-800 border-r-4 border-gold-400"
                  : "hover:bg-primary-800"
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-64 p-6">
          <Link
            to="/"
            className="block w-full text-center px-4 py-3 mb-3 border border-gray-600 hover:bg-primary-800 transition-colors"
          >
            View Site
          </Link>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 bg-red-500 hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      <div className="md:hidden fixed top-0 left-0 right-0 bg-primary-900 text-white p-4 z-50">
        <div className="flex items-center justify-between">
          <Link to="/admin/dashboard" className="text-xl font-bold">
            Port<span className="text-gold-400">folio</span>
          </Link>
          <button onClick={handleLogout} className="text-red-400">
            Logout
          </button>
        </div>
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`whitespace-nowrap px-3 py-1 text-sm ${
                location.pathname === item.path
                  ? "bg-gold-400 text-primary-900"
                  : "bg-primary-800"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>

      <main className="flex-1 p-6 md:p-8 mt-24 md:mt-0 md:ml-64">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
