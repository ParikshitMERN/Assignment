import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";

const Dashboard = () => {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    messages: 0,
    unread: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const token = localStorage.getItem("token");
    try {
      const [projectsRes, skillsRes, messagesRes, unreadRes] =
        await Promise.all([
          fetch("http://localhost:5000/api/projects"),
          fetch("http://localhost:5000/api/skills"),
          fetch("http://localhost:5000/api/contact", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:5000/api/contact/unread-count", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

      const [projects, skills, messages, unread] = await Promise.all([
        projectsRes.json(),
        skillsRes.json(),
        messagesRes.json(),
        unreadRes.json(),
      ]);

      setStats({
        projects: projects.data?.length || 0,
        skills: skills.data?.length || 0,
        messages: messages.data?.length || 0,
        unread: unread.count || 0,
      });
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: "Total Projects",
      value: stats.projects,
      icon: "💼",
      color: "bg-blue-500",
      link: "/admin/projects",
    },
    {
      label: "Total Skills",
      value: stats.skills,
      icon: "🛠",
      color: "bg-green-500",
      link: "/admin/skills",
    },
    {
      label: "Total Messages",
      value: stats.messages,
      icon: "✉",
      color: "bg-purple-500",
      link: "/admin/messages",
    },
    {
      label: "Unread Messages",
      value: stats.unread,
      icon: "🔔",
      color: "bg-red-500",
      link: "/admin/messages",
    },
  ];

  return (
    <AdminLayout>
      <h1 className="text-2xl md:text-3xl font-bold text-primary-900 mb-8">
        Dashboard
      </h1>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-primary-900 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, i) => (
            <Link
              key={i}
              to={stat.link}
              className="bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold text-primary-900 mt-2">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center text-white text-xl`}
                >
                  {stat.icon}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default Dashboard;
