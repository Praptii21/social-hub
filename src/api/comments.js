import api from "./axios";

export const getComments = (postId) => api.get(`/comments/post/${postId}`);
export const addComment = (postId, data) => api.post(`/comments/${postId}`, data);
export const deleteComment = (commentId) => api.delete(`/comments/${commentId}`);
