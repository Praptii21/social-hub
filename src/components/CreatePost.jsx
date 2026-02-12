import { useState } from "react";
import { createPost } from "../api/posts";

const CreatePost = ({ refreshPosts }) => {
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      await createPost({ content });
      setContent(""); // Clear the box
      refreshPosts(); // Reload the feed
    } catch (err) {
      console.error("Failed to create post", err);
    }
  };

  return (
    <div className="card mb-4 shadow-sm bg-white">
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <textarea
            className="form-control mb-2 text-dark" // Added text-dark here
            placeholder="What's on your mind?"
            rows="3"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ backgroundColor: "#ffffff", color: "#000000" }} // Explicit fix
          ></textarea>
          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-primary">
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
