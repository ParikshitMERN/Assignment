import { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";

const ManageSkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "frontend",
    proficiency: 50,
  });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/skills");
      const data = await response.json();
      setSkills(data.data || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const url = editingSkill
        ? `http://localhost:5000/api/skills/${editingSkill._id}`
        : "http://localhost:5000/api/skills";

      const response = await fetch(url, {
        method: editingSkill ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        fetchSkills();
        closeModal();
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEdit = (skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this skill?")) return;
    const token = localStorage.getItem("token");

    try {
      await fetch(`http://localhost:5000/api/skills/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSkills();
    } catch (error) {
      alert(error.message);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSkill(null);
    setFormData({ name: "", category: "frontend", proficiency: 50 });
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-primary-900">
          Manage Skills
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary-900 text-white px-6 py-3 hover:bg-primary-800 transition-colors"
        >
          + Add Skill
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-primary-900 rounded-full animate-spin"></div>
        </div>
      ) : skills.length === 0 ? (
        <p className="text-gray-500 text-center py-20">No skills yet.</p>
      ) : (
        <div className="bg-white shadow-sm overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                  Proficiency
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {skills.map((skill) => (
                <tr key={skill._id}>
                  <td className="px-6 py-4 text-dark font-medium">
                    {skill.name}
                  </td>
                  <td className="px-6 py-4 text-gray-500 capitalize">
                    {skill.category}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gold-400"
                          style={{ width: `${skill.proficiency}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {skill.proficiency}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleEdit(skill)}
                      className="text-primary-900 hover:text-gold-400 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(skill._id)}
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
          <div className="bg-white w-full max-w-md">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-primary-900">
                {editingSkill ? "Edit Skill" : "Add Skill"}
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
                  Skill Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="React, Node.js, etc."
                  className="w-full px-4 py-3 border border-gray-200 focus:border-primary-900 focus:outline-none"
                />
              </div>

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
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="database">Database</option>
                  <option value="devops">DevOps</option>
                  <option value="tools">Tools</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-dark font-medium mb-2">
                  Proficiency: {formData.proficiency}%
                </label>
                <input
                  type="range"
                  name="proficiency"
                  value={formData.proficiency}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  className="w-full"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-primary-900 text-white px-6 py-3 hover:bg-primary-800 transition-colors"
                >
                  {editingSkill ? "Update Skill" : "Add Skill"}
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

export default ManageSkills;
