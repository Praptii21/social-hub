import { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext"; // Import your context
import Navbar from "../components/Navbar";
import ProfileCard from "../components/ProfileCard";
import PostList from "../components/PostList";
import CreatePost from "../components/CreatePost";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext); // Get logged-in user details

  const fetchPosts = async () => {
    try {
      const res = await api.get("/posts");
      setPosts(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Filter posts created by the current user for the left section
  const myPosts = posts.filter(p => p.user?.id === user?.id || p.user_id === user?.id);

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <div className="row">
          {/* Section 1: My Personal Posts (Left Side) */}
          <div className="col-md-4 border-end">
            <ProfileCard />
            <h5 className="mt-4 text-white">My Recent Activity</h5>
            <hr className="text-white"/>
            {loading ? (
              <p className="text-muted">Loading my posts...</p>
            ) : (
              <PostList posts={myPosts} refreshPosts={fetchPosts} showFollow={false} />
            )}
          </div>

          {/* Section 2: General Feed (Right Side) */}
          <div className="col-md-8">
            <CreatePost refreshPosts={fetchPosts} />
            <h5 className="mt-4 text-white">Community Feed</h5>
            <hr className="text-white"/>
            {loading ? (
              <div className="text-center text-white">Loading community feed...</div>
            ) : (
              <PostList posts={posts} refreshPosts={fetchPosts} showFollow={true} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Feed;
