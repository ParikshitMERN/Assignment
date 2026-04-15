import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import { projectsAPI, skillsAPI, contactAPI } from "../../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    messages: 0,
    unread: 0,
  });
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [projectsRes, skillsRes, messagesRes, unreadRes] =
        await Promise.all([
          projectsAPI.getAll(),
          skillsAPI.getAll(),
          contactAPI.getAll(),
          contactAPI.getUnreadCount(),
        ]);

      setStats({
        projects: projectsRes.data.data?.length || 0,
        skills: skillsRes.data.data?.length || 0,
        messages: messagesRes.data.data?.length || 0,
        unread: unreadRes.data.count || 0,
      });

      setRecentMessages(messagesRes.data.data?.slice(0, 5) || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center py-20">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-primary-900 rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your portfolio</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Link
          to="/admin/projects"
          className="bg-white p-6 border border-gray-200 hover:border-primary-900 transition-colors"
        >
          <p className="text-3xl font-semibold text-gray-900">
            {stats.projects}
          </p>
          <p className="text-sm text-gray-500 mt-1">Projects</p>
        </Link>

        <Link
          to="/admin/skills"
          className="bg-white p-6 border border-gray-200 hover:border-primary-900 transition-colors"
        >
          <p className="text-3xl font-semibold text-gray-900">{stats.skills}</p>
          <p className="text-sm text-gray-500 mt-1">Skills</p>
        </Link>

        <Link
          to="/admin/messages"
          className="bg-white p-6 border border-gray-200 hover:border-primary-900 transition-colors"
        >
          <p className="text-3xl font-semibold text-gray-900">
            {stats.messages}
          </p>
          <p className="text-sm text-gray-500 mt-1">Messages</p>
        </Link>

        <Link
          to="/admin/messages"
          className="bg-white p-6 border border-gray-200 hover:border-primary-900 transition-colors"
        >
          <p className="text-3xl font-semibold text-gray-900">{stats.unread}</p>
          <p className="text-sm text-gray-500 mt-1">Unread</p>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="font-medium text-gray-900">Recent Messages</h2>
            <Link
              to="/admin/messages"
              className="text-sm text-primary-900 hover:underline"
            >
              View all
            </Link>
          </div>

          {recentMessages.length === 0 ? (
            <p className="p-6 text-gray-500 text-sm">No messages yet.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentMessages.map((msg) => (
                <div key={msg._id} className="px-6 py-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {msg.name}
                      </p>
                      <p className="text-gray-500 text-sm truncate max-w-xs">
                        {msg.subject || "No subject"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {!msg.isRead && (
                        <span className="w-2 h-2 bg-primary-900 rounded-full"></span>
                      )}
                      <span className="text-xs text-gray-400">
                        {formatDate(msg.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-medium text-gray-900">Quick Actions</h2>
          </div>

          <div className="p-6 space-y-3">
            <Link
              to="/admin/projects"
              className="block w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 text-sm text-gray-700 transition-colors"
            >
              Add new project
            </Link>
            <Link
              to="/admin/skills"
              className="block w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 text-sm text-gray-700 transition-colors"
            >
              Add new skill
            </Link>
            <Link
              to="/"
              target="_blank"
              className="block w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 text-sm text-gray-700 transition-colors"
            >
              Preview portfolio
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
