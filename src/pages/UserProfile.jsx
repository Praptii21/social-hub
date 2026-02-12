import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getUserProfile } from "../api/users";
import { getFollowCount } from "../api/follow";
import api from "../api/axios";
import PostList from "../components/PostList";
import FollowButton from "../components/FollowButton";

const UserProfile = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [followStats, setFollowStats] = useState({ followers: 0, following: 0 });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await getUserProfile(id);
      setProfile(res.data);
    } catch (err) {
      console.error("Failed to load profile", err);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/posts/user/${id}`);
      setPosts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load user posts", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFollowStats = async () => {
    try {
      const res = await getFollowCount(id);
      setFollowStats({
        followers: res.data.followers ?? 0,
        following: res.data.following ?? 0,
      });
    } catch (err) {
      console.error("Failed to load follow counts", err);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProfile();
      fetchPosts();
      fetchFollowStats();
    }
  }, [id]);

  if (!profile) return <div className="text-center mt-5 text-white">Loading profile...</div>;

  const isSelf = user?.id && String(user.id) === String(profile.id);

  return (
    <div className="container mt-4">
      <div className="card shadow-sm mb-4 profile-header-card">
        <div className="card-body text-center">
          <h2 className="fw-bold">@{profile.username}</h2>
          <p className="profile-bio mb-1">{profile.bio || "No bio yet..."}</p>
          <div className="profile-stats mb-3">
            <div>
              <div className="profile-stat-value">{followStats.followers}</div>
              <div className="profile-stat-label">Followers</div>
            </div>
            <div>
              <div className="profile-stat-value">{followStats.following}</div>
              <div className="profile-stat-label">Following</div>
            </div>
          </div>
          {!isSelf ? <FollowButton userId={profile.id} /> : null}
        </div>
      </div>

      <h4 className="mb-3 text-white">Posts</h4>
      {loading ? (
        <div className="text-center text-white">Loading posts...</div>
      ) : (
        <PostList posts={posts} refreshPosts={fetchPosts} showFollow={false} />
      )}
    </div>
  );
};

export default UserProfile;
