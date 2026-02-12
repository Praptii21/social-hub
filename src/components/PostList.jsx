import PostCard from "./PostCard";

const PostList = ({ posts, refreshPosts, showFollow = false }) => {
  // 1. Prevent crash if posts is null/undefined
  if (!posts || posts.length === 0) {
    return <div className="text-center mt-3">No posts found.</div>;
  }

  return (
    <div>
      {posts.map((post) => (
        <PostCard 
          key={post.id} 
          post={post} 
          refreshPosts={refreshPosts}
          showFollow={showFollow}
        />
      ))}
    </div>
  );
};

export default PostList;
