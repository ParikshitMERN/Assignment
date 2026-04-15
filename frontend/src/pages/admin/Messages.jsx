import { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { contactAPI } from "../../services/api";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data } = await contactAPI.getAll();
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
      try {
        await contactAPI.markAsRead(message._id);
        fetchMessages();
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message?")) return;

    try {
      await contactAPI.delete(id);
      setSelectedMessage(null);
      fetchMessages();
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
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
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Messages</h1>
        <p className="text-gray-500 mt-1">{messages.length} total messages</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-primary-900 rounded-full animate-spin"></div>
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-white border border-gray-200 p-12 text-center">
          <p className="text-gray-500">No messages yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Message List */}
          <div className="lg:col-span-1 bg-white border border-gray-200 max-h-[600px] overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message._id}
                onClick={() => handleView(message)}
                className={`px-4 py-4 border-b border-gray-100 cursor-pointer transition-colors ${
                  selectedMessage?._id === message._id
                    ? "bg-gray-50"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-sm ${
                      !message.isRead
                        ? "font-semibold text-gray-900"
                        : "text-gray-700"
                    }`}
                  >
                    {message.name}
                  </span>
                  {!message.isRead && (
                    <span className="w-2 h-2 bg-primary-900 rounded-full"></span>
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
          <div className="lg:col-span-2 bg-white border border-gray-200">
            {selectedMessage ? (
              <div>
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-start">
                  <div>
                    <h2 className="font-semibold text-gray-900">
                      {selectedMessage.name}
                    </h2>

                    {/* FIXED EMAIL LINK */}
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="text-sm text-primary-900 hover:underline"
                    >
                      {selectedMessage.email}
                    </a>
                  </div>

                  <button
                    onClick={() => handleDelete(selectedMessage._id)}
                    className="text-sm text-gray-400 hover:text-red-600"
                  >
                    Delete
                  </button>
                </div>

                <div className="p-6">
                  <div className="mb-4">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                      Subject
                    </p>
                    <p className="text-gray-900">
                      {selectedMessage.subject || "No subject"}
                    </p>
                  </div>

                  <div className="mb-6">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                      Message
                    </p>
                    <p className="text-gray-700 whitespace-pre-line">
                      {selectedMessage.message}
                    </p>
                  </div>

                  <div className="text-xs text-gray-400 mb-6">
                    Received {formatDate(selectedMessage.createdAt)}
                  </div>

                  {/* FIXED REPLY BUTTON */}
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${
                      selectedMessage.subject || "Your message"
                    }`}
                    className="inline-block bg-primary-900 text-white px-4 py-2 text-sm font-medium hover:bg-primary-800"
                  >
                    Reply
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
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
