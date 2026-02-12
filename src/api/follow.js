import api from "./axios";

export const followUser = (id) => api.post(`/follow/${id}`);
export const unfollowUser = (id) => api.delete(`/follow/${id}`);
export const getFollowCount = (id) => api.get(`/follow/count/${id}`);
export const isFollowing = (id) => api.get(`/follow/is-following/${id}`);
