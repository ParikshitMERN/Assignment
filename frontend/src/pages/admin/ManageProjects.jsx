import { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";

const ManageProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    technologies: "",
    category: "web",
    liveUrl: "",
    githubUrl: "",
    featured: false,
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/projects");
      const data = await response.json();
      setProjects(data.data || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      form.append(key, formData[key]);
    });

    try {
      const url = editingProject
        ? `http://localhost:5000/api/projects/${editingProject._id}`
        : "http://localhost:5000/api/projects";

      const response = await fetch(url, {
        method: editingProject ? "PUT" : "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      const data = await response.json();
      if (data.success) {
        fetchProjects();
        closeModal();
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      technologies: project.technologies?.join(", ") || "",
      category: project.category,
      liveUrl: project.liveUrl || "",
      githubUrl: project.githubUrl || "",
      featured: project.featured,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;
    const token = localStorage.getItem("token");

    try {
      await fetch(`http://localhost:5000/api/projects/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProjects();
    } catch (error) {
      alert(error.message);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProject(null);
    setFormData({
      title: "",
      description: "",
      technologies: "",
      category: "web",
      liveUrl: "",
      githubUrl: "",
      featured: false,
    });
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-primary-900">
          Manage Projects
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary-900 text-white px-6 py-3 hover:bg-primary-800 transition-colors"
        >
          + Add Project
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-primary-900 rounded-full animate-spin"></div>
        </div>
      ) : projects.length === 0 ? (
        <p className="text-gray-500 text-center py-20">No projects yet.</p>
      ) : (
        <div className="bg-white shadow-sm overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                  Title
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                  Featured
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {projects.map((project) => (
                <tr key={project._id}>
                  <td className="px-6 py-4 text-dark font-medium">
                    {project.title}
                  </td>
                  <td className="px-6 py-4 text-gray-500 capitalize">
                    {project.category}
                  </td>
                  <td className="px-6 py-4">
                    {project.featured ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs">
                        Yes
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs">
                        No
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleEdit(project)}
                      className="text-primary-900 hover:text-gold-400 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(project._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-primary-900">
                {editingProject ? "Edit Project" : "Add Project"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-dark font-medium mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 focus:border-primary-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-dark font-medium mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 focus:border-primary-900 focus:outline-none resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-dark font-medium mb-2">
                  Technologies (comma separated)
                </label>
                <input
                  type="text"
                  name="technologies"
                  value={formData.technologies}
                  onChange={handleChange}
                  placeholder="React, Node.js, MongoDB"
                  className="w-full px-4 py-3 border border-gray-200 focus:border-primary-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-dark font-medium mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 focus:border-primary-900 focus:outline-none"
                  >
                    <option value="web">Web</option>
                    <option value="mobile">Mobile</option>
                    <option value="desktop">Desktop</option>
                    <option value="api">API</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="featured"
                    id="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="w-5 h-5 mr-3"
                  />
                  <label htmlFor="featured" className="text-dark font-medium">
                    Featured Project
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-dark font-medium mb-2">
                  Live URL
                </label>
                <input
                  type="url"
                  name="liveUrl"
                  value={formData.liveUrl}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className="w-full px-4 py-3 border border-gray-200 focus:border-primary-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-dark font-medium mb-2">
                  GitHub URL
                </label>
                <input
                  type="url"
                  name="githubUrl"
                  value={formData.githubUrl}
                  onChange={handleChange}
                  placeholder="https://github.com/username/repo"
                  className="w-full px-4 py-3 border border-gray-200 focus:border-primary-900 focus:outline-none"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-primary-900 text-white px-6 py-3 hover:bg-primary-800 transition-colors"
                >
                  {editingProject ? "Update Project" : "Add Project"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="border border-gray-300 text-gray-700 px-6 py-3 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ManageProjects;
