import { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { skillsAPI } from "../../services/api";

const ManageSkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [saving, setSaving] = useState(false);
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
      const { data } = await skillsAPI.getAll();
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
    setSaving(true);

    try {
      if (editingSkill) {
        await skillsAPI.update(editingSkill._id, formData);
      } else {
        await skillsAPI.create(formData);
      }
      fetchSkills();
      closeModal();
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setSaving(false);
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
    if (!window.confirm("Delete this skill?")) return;

    try {
      await skillsAPI.delete(id);
      fetchSkills();
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSkill(null);
    setFormData({ name: "", category: "frontend", proficiency: 50 });
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    const cat = skill.category || "other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Skills</h1>
          <p className="text-gray-500 mt-1">{skills.length} total skills</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary-900 text-white px-4 py-2 text-sm font-medium hover:bg-primary-800 transition-colors"
        >
          Add Skill
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-primary-900 rounded-full animate-spin"></div>
        </div>
      ) : skills.length === 0 ? (
        <div className="bg-white border border-gray-200 p-12 text-center">
          <p className="text-gray-500">No skills yet.</p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 text-primary-900 font-medium hover:underline"
          >
            Add your first skill
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <div key={category} className="bg-white border border-gray-200">
              <div className="px-6 py-3 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  {category}
                </h3>
              </div>
              <div className="divide-y divide-gray-100">
                {categorySkills.map((skill) => (
                  <div
                    key={skill._id}
                    className="px-6 py-4 flex items-center justify-between hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-medium text-gray-900">
                        {skill.name}
                      </span>
                      <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden hidden sm:block">
                        <div
                          className="h-full bg-primary-900"
                          style={{ width: `${skill.proficiency}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-400">
                        {skill.proficiency}%
                      </span>
                    </div>
                    <div>
                      <button
                        onClick={() => handleEdit(skill)}
                        className="text-gray-600 hover:text-primary-900 text-sm mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(skill._id)}
                        className="text-gray-600 hover:text-red-600 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="font-semibold text-gray-900">
                {editingSkill ? "Edit Skill" : "New Skill"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="React, Node.js, etc."
                  className="w-full px-3 py-2 border border-gray-300 focus:border-primary-900 focus:outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 focus:border-primary-900 focus:outline-none text-sm"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
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

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-primary-900 text-white px-4 py-2 text-sm font-medium hover:bg-primary-800 disabled:opacity-50"
                >
                  {saving ? "Saving..." : editingSkill ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
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
