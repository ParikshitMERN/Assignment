const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  if (options.body instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  const response = await fetch(`${API_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

export const authAPI = {
  login: (credentials) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  register: (userData) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  getMe: () => request("/auth/me"),
};

export const projectsAPI = {
  getAll: (params = "") => request(`/projects${params}`),

  getFeatured: () => request("/projects/featured"),

  getOne: (id) => request(`/projects/${id}`),

  getBySlug: (slug) => request(`/projects/slug/${slug}`),

  create: (formData) =>
    request("/projects", {
      method: "POST",
      body: formData,
    }),

  update: (id, formData) =>
    request(`/projects/${id}`, {
      method: "PUT",
      body: formData,
    }),

  delete: (id) =>
    request(`/projects/${id}`, {
      method: "DELETE",
    }),
};

export const skillsAPI = {
  getAll: (category = "") =>
    request(`/skills${category ? `?category=${category}` : ""}`),

  getOne: (id) => request(`/skills/${id}`),

  create: (skillData) =>
    request("/skills", {
      method: "POST",
      body: JSON.stringify(skillData),
    }),

  update: (id, skillData) =>
    request(`/skills/${id}`, {
      method: "PUT",
      body: JSON.stringify(skillData),
    }),

  delete: (id) =>
    request(`/skills/${id}`, {
      method: "DELETE",
    }),
};

export const contactAPI = {
  submit: (contactData) =>
    request("/contact", {
      method: "POST",
      body: JSON.stringify(contactData),
    }),

  getAll: (params = "") => request(`/contact${params}`),

  getOne: (id) => request(`/contact/${id}`),

  markAsRead: (id) =>
    request(`/contact/${id}/read`, {
      method: "PATCH",
    }),

  delete: (id) =>
    request(`/contact/${id}`, {
      method: "DELETE",
    }),

  getUnreadCount: () => request("/contact/unread-count"),
};
