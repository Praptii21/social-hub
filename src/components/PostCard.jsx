import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toggleLike, getLikesCount } from "../api/likes";
import { getComments, addComment, deleteComment } from "../api/comments";
import FollowButton from "./FollowButton";
import { AuthContext } from "../context/AuthContext";
import { updatePost, deletePost } from "../api/posts";

const PostCard = ({ post, refreshPosts, showFollow = false }) => {
  if (!post) return null;
  const { user } = useContext(AuthContext);
  const [likesCount, setLikesCount] = useState(post.likes_count ?? 0);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content || "");
  const isOwner = user?.id && post.user_id === user.id;
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadCount = async () => {
      try {
        const res = await getLikesCount(post.id);
        if (isMounted) {
          setLikesCount(res.data.likes_count ?? 0);
        }
      } catch (err) {
        console.error("Failed to load likes count", err);
      }
    };
    loadCount();
    return () => {
      isMounted = false;
    };
  }, [post.id]);

  const handleLike = async () => {
    try {
      await toggleLike(post.id);
      const res = await getLikesCount(post.id);
      setLikesCount(res.data.likes_count ?? 0);
      if (refreshPosts) {
        refreshPosts();
      }
    } catch (err) {
      console.error("Like failed", err);
    }
  };

  const handleEdit = async () => {
    if (!editContent.trim()) return;
    try {
      await updatePost(post.id, { content: editContent });
      setIsEditing(false);
      if (refreshPosts) {
        refreshPosts();
      }
    } catch (err) {
      console.error("Edit failed", err);
    }
  };

  const handleDelete = async () => {
    const ok = window.confirm("Delete this post?");
    if (!ok) return;
    try {
      await deletePost(post.id);
      if (refreshPosts) {
        refreshPosts();
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const loadComments = async () => {
    try {
      setLoadingComments(true);
      const res = await getComments(post.id);
      setComments(res.data || []);
    } catch (err) {
      console.error("Failed to load comments", err);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    try {
      await addComment(post.id, { content: commentText.trim() });
      setCommentText("");
      await loadComments();
    } catch (err) {
      console.error("Add comment failed", err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      await loadComments();
    } catch (err) {
      console.error("Delete comment failed", err);
    }
  };

  const timeAgo = (value) => {
    if (!value) return "";
    const date = new Date(value);
    const diff = Date.now() - date.getTime();
    if (Number.isNaN(diff)) return "";
    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className={`card mb-3 shadow-sm bg-white ${isOwner ? "post-own" : ""}`}>
      <div className="card-body">
        {/* Username in Blue/Black to be visible */}
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h6 className="fw-bold mb-1" style={{ color: "#007bff" }}>
              <Link to={`/user/${post.user_id}`} className="post-username">
                @{post.username || post.user?.username || "unknown_user"}
              </Link>
            </h6>
            <small className="text-muted">{timeAgo(post.created_at)}</small>
          </div>
          {showFollow && post.user_id && user?.id && post.user_id !== user.id ? (
            <FollowButton userId={post.user_id} />
          ) : null}
        </div>

        {/* Force text to black so it's not white-on-white */}
        {isEditing ? (
          <textarea
            className="form-control mb-2 text-dark"
            rows="3"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
        ) : (
          <p className="card-text text-dark">
            {post.content}
          </p>
        )}

        <div className="d-flex align-items-center justify-content-between">
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={handleLike}
          >
            ❤️ {likesCount}
          </button>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => {
              const next = !showComments;
              setShowComments(next);
              if (next) loadComments();
            }}
          >
            Comments
          </button>
          {isOwner ? (
            <div className="d-flex gap-2">
              {isEditing ? (
                <>
                  <button className="btn btn-success btn-sm" onClick={handleEdit}>
                    Save
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      setIsEditing(false);
                      setEditContent(post.content || "");
                    }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button className="btn btn-outline-primary btn-sm" onClick={() => setIsEditing(true)}>
                    Edit
                  </button>
                  <button className="btn btn-outline-danger btn-sm" onClick={handleDelete}>
                    Delete
                  </button>
                </>
              )}
            </div>
          ) : null}
        </div>

        {showComments && (
          <div className="mt-3">
            <div className="d-flex gap-2 mb-2">
              <input
                className="form-control form-control-sm"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button className="btn btn-primary btn-sm" onClick={handleAddComment}>
                Post
              </button>
            </div>
            {loadingComments ? (
              <div className="text-muted">Loading comments...</div>
            ) : comments.length === 0 ? (
              <div className="text-muted">No comments yet.</div>
            ) : (
              <div className="comment-list">
                {comments.map((c) => (
                  <div key={c.id} className="comment-item">
                    <div className="d-flex justify-content-between">
                      <div>
                        <Link to={`/user/${c.user_id}`} className="comment-username">
                          @{c.username}
                        </Link>
                        <span className="comment-text"> {c.content}</span>
                      </div>
                      <div className="comment-meta">
                        <small className="text-muted">{timeAgo(c.created_at)}</small>
                        {user?.id === c.user_id && (
                          <button
                            className="btn btn-link btn-sm text-danger"
                            onClick={() => handleDeleteComment(c.id)}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
