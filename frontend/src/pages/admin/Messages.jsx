import { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:5000/api/contact", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setMessages(data.data || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (message) => {
    setSelectedMessage(message);

    if (!message.isRead) {
      const token = localStorage.getItem("token");
      try {
        await fetch(`http://localhost:5000/api/contact/${message._id}/read`, {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchMessages();
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?"))
      return;
    const token = localStorage.getItem("token");

    try {
      await fetch(`http://localhost:5000/api/contact/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedMessage(null);
      fetchMessages();
    } catch (error) {
      alert(error.message);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl md:text-3xl font-bold text-primary-900 mb-8">
        Messages
      </h1>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-primary-900 rounded-full animate-spin"></div>
        </div>
      ) : messages.length === 0 ? (
        <p className="text-gray-500 text-center py-20">No messages yet.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Message List */}
          <div className="lg:col-span-1 bg-white shadow-sm max-h-[600px] overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message._id}
                onClick={() => handleView(message)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedMessage?._id === message._id ? "bg-gray-50" : ""
                } ${!message.isRead ? "border-l-4 border-l-gold-400" : ""}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-dark">{message.name}</span>
                  {!message.isRead && (
                    <span className="w-2 h-2 bg-gold-400 rounded-full"></span>
                  )}
                </div>
                <p className="text-sm text-gray-500 truncate">
                  {message.subject || "No subject"}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {formatDate(message.createdAt)}
                </p>
              </div>
            ))}
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2 bg-white shadow-sm p-6">
            {selectedMessage ? (
              <div>
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-primary-900">
                      {selectedMessage.name}
                    </h2>

                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="text-gold-400 hover:underline"
                    >
                      {selectedMessage.email}
                    </a>
                  </div>

                  <button
                    onClick={() => handleDelete(selectedMessage._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>

                <div className="mb-4">
                  <span className="text-sm text-gray-500">Subject:</span>
                  <p className="text-dark font-medium">
                    {selectedMessage.subject || "No subject"}
                  </p>
                </div>

                <div className="mb-4">
                  <span className="text-sm text-gray-500">Message:</span>
                  <p className="text-dark mt-2 whitespace-pre-line">
                    {selectedMessage.message}
                  </p>
                </div>

                <div className="text-sm text-gray-400">
                  Received: {formatDate(selectedMessage.createdAt)}
                </div>

                <div className="mt-6">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${
                      selectedMessage.subject || "Your message"
                    }`}
                    className="bg-primary-900 text-white px-6 py-3 hover:bg-primary-800 transition-colors inline-block"
                  >
                    Reply via Email
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-400">
                Select a message to view
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Messages;
