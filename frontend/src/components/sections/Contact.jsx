import { useState } from "react";
import { contactAPI } from "../../services/api";

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
      const { data } = await contactAPI.submit(formData);

      if (data.success) {
        setStatus({ type: "success", message: "Message sent successfully!" });
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: error.response?.data?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-gold-400 font-medium uppercase text-sm tracking-widest">
            Get In Touch
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mt-3">
            Let's Talk
          </h2>
          <div className="w-12 h-1 bg-gold-400 mt-5 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold text-primary-900 mb-4">
              Have a project in mind?
            </h3>
            <p className="text-gray-600 mb-10 leading-relaxed">
              I'm currently available for freelance work. If you have a project
              that needs some creative direction, I'd love to hear about it.
            </p>

            <div className="space-y-8">
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">
                  Email
                </p>
                <a
                  href="mailto:hello@yourname.com"
                  className="text-primary-900 font-medium hover:text-gold-400 transition-colors"
                >
                  pariks2345@gmail.com
                </a>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">
                  Based in
                </p>
                <p className="text-primary-900 font-medium">Kathmandu, Nepal</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">
                  Phone
                </p>
                <a
                  href="tel:+9771234567890"
                  className="text-primary-900 font-medium hover:text-gold-400 transition-colors"
                >
                  +977 9803659437
                </a>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">
                  Follow me
                </p>
                <div className="flex gap-4">
                  <a
                    href="https://github.com/PARIKSHITMERN"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-primary-900 transition-colors font-medium"
                  >
                    GitHub
                  </a>
                  <a
                    href="https://www.linkedin.com/in/parikshit-maharjan/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-primary-900 transition-colors font-medium"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white p-8 md:p-10 shadow-sm">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-primary-900 focus:outline-none"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-primary-900 focus:outline-none"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm text-gray-600 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-primary-900 focus:outline-none"
                    placeholder="Project inquiry"
                  />
                </div>

                <div className="mt-6">
                  <label className="block text-sm text-gray-600 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-primary-900 focus:outline-none resize-none"
                    placeholder="Tell me about your project..."
                  ></textarea>
                </div>

                {status.message && (
                  <div
                    className={`mt-6 p-4 text-sm ${status.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
                  >
                    {status.message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-8 bg-primary-900 text-white px-10 py-4 hover:bg-primary-800 transition-colors disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
