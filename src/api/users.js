import api from "./axios";

export const searchUsers = (q) => api.get(`/users/search?q=${encodeURIComponent(q)}`);
export const getUserProfile = (id) => api.get(`/users/${id}`);
