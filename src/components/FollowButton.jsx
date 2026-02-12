import { useEffect, useState } from "react";
import { followUser, unfollowUser, isFollowing } from "../api/follow";

const FollowButton = ({ userId }) => {
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    isFollowing(userId).then(res => {
      setFollowing(res.data.following);
    });
  }, [userId]);

  const handleClick = async () => {
    setLoading(true);
    try {
      if (following) {
        await unfollowUser(userId);
        setFollowing(false);
      } else {
        await followUser(userId);
        setFollowing(true);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <button
      className={`btn ${following ? "btn-secondary" : "btn-primary"}`}
      onClick={handleClick}
      disabled={loading}
    >
      {following ? "Following" : "Follow"}
    </button>
  );
};

export default FollowButton;
