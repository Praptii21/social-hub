import api from "./axios";

export const toggleLike = (postId) => api.post(`/likes/${postId}`);
export const getLikesCount = (postId) => api.get(`/likes/${postId}/count`);
