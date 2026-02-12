import { Card, CardBody } from "reactstrap";
import { AuthContext } from "../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { getFollowCount } from "../api/follow";

const ProfileCard = () => {
  const { user } = useContext(AuthContext);
  const [followStats, setFollowStats] = useState({ followers: 0, following: 0 });

  useEffect(() => {
    if (!user?.id) return;
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
  }, [user?.id]);

  if (!user) return null;

  return (
    <Card className="mb-4 shadow profile-card">
      <CardBody className="text-center">
        <div className="profile-avatar">
          {user.username?.[0]?.toUpperCase() || "U"}
        </div>
        <h5 className="profile-username">@{user.username}</h5>
        <p className="profile-bio">{user.bio || "No bio yet"}</p>
        <div className="profile-stats">
          <div>
            <div className="profile-stat-value">{followStats.followers}</div>
            <div className="profile-stat-label">Followers</div>
          </div>
          <div>
            <div className="profile-stat-value">{followStats.following}</div>
            <div className="profile-stat-label">Following</div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default ProfileCard;
