import { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (data.success) {
        setStatus({ type: "success", message: "Message sent successfully!" });
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Title */}
        <div className="text-center mb-12">
          <span className="text-gold-400 font-medium uppercase text-sm">
            Get In Touch
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mt-2">
            Contact Me
          </h2>
          <div className="w-16 h-1 bg-gold-400 mt-4 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h3 className="text-2xl font-bold text-primary-900 mb-6">
              Let's Work Together
            </h3>
            <p className="text-gray-600 mb-8">
              Feel free to reach out if you have a project in mind or just want
              to say hello. I'm always open to discussing new opportunities.
            </p>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-900 text-white flex items-center justify-center flex-shrink-0">
                  <span>✉</span>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Email</div>
                  <a
                    href="mailto:your@email.com"
                    className="text-dark font-medium hover:text-gold-400"
                  >
                    your@email.com
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-900 text-white flex items-center justify-center flex-shrink-0">
                  <span>📍</span>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Location</div>
                  <div className="text-dark font-medium">
                    Your City, Country
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-900 text-white flex items-center justify-center flex-shrink-0">
                  <span>📱</span>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Phone</div>
                  <a
                    href="tel:+1234567890"
                    className="text-dark font-medium hover:text-gold-400"
                  >
                    +1 234 567 890
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 shadow-sm">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-dark font-medium mb-2">
                    Name
                  </label>
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
                <div>
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
              </div>

              <div className="mt-6">
                <label className="block text-dark font-medium mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 focus:border-primary-900 focus:outline-none"
                  placeholder="Subject"
                />
              </div>

              <div className="mt-6">
                <label className="block text-dark font-medium mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-200 focus:border-primary-900 focus:outline-none resize-none"
                  placeholder="Your message..."
                ></textarea>
              </div>

              {status.message && (
                <div
                  className={`mt-6 p-4 ${status.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
                >
                  {status.message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-8 w-full sm:w-auto bg-primary-900 text-white px-8 py-4 hover:bg-primary-800 transition-colors disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
