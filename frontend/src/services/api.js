import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  },
);

// Auth API
export const authAPI = {
  checkAdminExists: () => API.get("/auth/admin-exists"),
  register: (data) => API.post("/auth/register", data),
  login: (data) => API.post("/auth/login", data),
  getMe: () => API.get("/auth/me"),
};

// Projects API
export const projectsAPI = {
  getAll: () => API.get("/projects"),
  getFeatured: () => API.get("/projects/featured"),
  getBySlug: (slug) => API.get(`/projects/slug/${slug}`),
  getById: (id) => API.get(`/projects/${id}`),
  create: (data) =>
    API.post("/projects", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, data) =>
    API.put(`/projects/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  delete: (id) => API.delete(`/projects/${id}`),
};

// Skills API
export const skillsAPI = {
  getAll: () => API.get("/skills"),
  getById: (id) => API.get(`/skills/${id}`),
  create: (data) => API.post("/skills", data),
  update: (id, data) => API.put(`/skills/${id}`, data),
  delete: (id) => API.delete(`/skills/${id}`),
};

// Contact APIs
export const contactAPI = {
  submit: (data) => API.post("/contact", data),
  getAll: () => API.get("/contact"),
  getUnreadCount: () => API.get("/contact/unread-count"),
  getById: (id) => API.get(`/contact/${id}`),
  markAsRead: (id) => API.patch(`/contact/${id}/read`),
  delete: (id) => API.delete(`/contact/${id}`),
};

export default API;
