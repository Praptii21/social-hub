import { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import PostCard from "../components/PostCard";
import PostList from "../components/PostList";
import CreatePost from "../components/CreatePost";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getFollowCount } from "../api/follow";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newBio, setNewBio] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [followStats, setFollowStats] = useState({ followers: 0, following: 0 });
  const [allPosts, setAllPosts] = useState([]);
  const [loadingAll, setLoadingAll] = useState(true);
  const [activeTab, setActiveTab] = useState("my");

  const fetchMyPosts = async () => {
    try {
      setLoading(true);
      // Fallback logic: If a specific user endpoint fails, get all and filter
      const res = await api.get("/posts");
      const filtered = res.data.filter(p => 
        p.user_id === user.id || p.user?.id === user.id
      );
      setUserPosts(filtered);
    } catch (err) {
      console.error("Error fetching user posts", err);
      toast.error("Could not load your posts.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllPosts = async () => {
    try {
      setLoadingAll(true);
      const res = await api.get("/posts");
      setAllPosts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch community posts", err);
      toast.error("Could not load community feed.");
    } finally {
      setLoadingAll(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyPosts();
      fetchAllPosts();
      setNewBio(user.bio || "");
      getFollowCount(user.id)
        .then((res) => {
          setFollowStats({
            followers: res.data.followers ?? 0,
            following: res.data.following ?? 0,
          });
        })
        .catch((err) => {
          console.error("Failed to load follow counts", err);
        });
    }
  }, [user]);

const handleUpdateBio = async () => {
  try {
    const res = await api.put("/users/me", { bio: newBio });

    setUser(prev => ({
      ...prev,
      bio: res.data.bio
    }));

    setIsEditing(false);
    toast.success("Bio updated successfully! ✨");
  } catch (err) {
    console.error("Update Error:", err.response?.data || err.message);
    toast.error(err.response?.data?.message || "Failed to update bio.");
  }
};


  if (!user) return <div className="text-center mt-5 text-white">Loading profile...</div>;

  return (
    <div className="container mt-4">
      <ToastContainer />
      
      {/* Profile Header */}
      <div className="card shadow-sm mb-4 profile-header-card">
        <div className="card-body text-center">
          <h2 className="fw-bold">@{user.username}</h2>
          <p className="profile-bio mb-1">
            {user.bio || "No bio yet..."}
          </p>
          <div className="profile-stats mb-2">
            <div>
              <div className="profile-stat-value">{followStats.followers}</div>
              <div className="profile-stat-label">Followers</div>
            </div>
            <div>
              <div className="profile-stat-value">{followStats.following}</div>
              <div className="profile-stat-label">Following</div>
            </div>
          </div>
          {isEditing ? (
            <div className="mt-3">
              <textarea 
  className="form-control mb-2 text-dark bg-light" // Force dark text and light grey bg
  value={newBio}
  onChange={(e) => setNewBio(e.target.value)}
  style={{ color: "#212529", backgroundColor: "#f8f9fa" }} // Extra insurance
/>
              <button className="btn btn-success me-2" onClick={handleUpdateBio}>Save</button>
              <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          ) : (
            <div>
              <button className="btn btn-outline-primary btn-sm" onClick={() => setIsEditing(true)}>Edit Bio</button>
            </div>
      )}
        </div>
      </div>

      <hr className="text-white"/>

      {/* Tabs */}
      <div className="profile-tabs mb-4">
        <button
          className={`profile-tab ${activeTab === "my" ? "active" : ""}`}
          onClick={() => setActiveTab("my")}
        >
          My Posts
        </button>
        <button
          className={`profile-tab ${activeTab === "liked" ? "active" : ""}`}
          onClick={() => setActiveTab("liked")}
        >
          Liked Posts
        </button>
        <button
          className={`profile-tab ${activeTab === "saved" ? "active" : ""}`}
          onClick={() => setActiveTab("saved")}
        >
          Saved
        </button>
      </div>

      {activeTab === "my" && (
        <>
          {/* Your Activity Section */}
          <h4 className="mb-3 text-white">My Activity</h4>
          <div className="row">
            {loading ? (
              <p className="text-white">Loading posts...</p>
            ) : userPosts.length > 0 ? (
              userPosts.map((post) => (
                <div className="col-12" key={post.id}>
                  <PostCard post={post} refreshPosts={fetchMyPosts} />
                </div>
              ))
            ) : (
              <p className="text-muted ms-3">You haven't posted anything yet.</p>
            )}
          </div>

          <hr className="text-white" />

          {/* Community Feed Section */}
          <h4 className="mb-3 text-white">Community Feed</h4>
          <CreatePost refreshPosts={fetchAllPosts} />
          {loadingAll ? (
            <div className="text-center text-white">Loading community feed...</div>
          ) : (
            <PostList posts={allPosts} refreshPosts={fetchAllPosts} showFollow={true} />
          )}
        </>
      )}

      {activeTab === "liked" && (
        <div className="text-muted">
          Liked posts will appear here once we wire the backend endpoint.
        </div>
      )}

      {activeTab === "saved" && (
        <div className="text-muted">
          Saved posts will appear here once we add the save feature.
        </div>
      )}
    </div>
  );
};

export default Profile;
