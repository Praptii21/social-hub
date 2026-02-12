import { Button } from "reactstrap";
import { AuthContext } from "../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { searchUsers } from "../api/users";

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    let timer;
    if (user && query.trim().length >= 2) {
      setSearching(true);
      timer = setTimeout(async () => {
        try {
          const res = await searchUsers(query.trim());
          setResults(res.data || []);
        } catch (err) {
          console.error("Search failed", err);
          setResults([]);
        } finally {
          setSearching(false);
        }
      }, 300);
    } else {
      setResults([]);
    }
    return () => clearTimeout(timer);
  }, [query, user]);

  return (
    <div className="d-flex justify-content-between px-4 py-3 border-bottom">
      <h4>SocialApp</h4>

      {user ? (
        <div className="d-flex align-items-center gap-3">
          <div className="nav-search">
            <input
              className="form-control form-control-sm"
              placeholder="Search users..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {(searching || results.length > 0) && (
              <div className="nav-search-results">
                {searching && <div className="nav-search-item">Searching...</div>}
                {!searching && results.length === 0 && (
                  <div className="nav-search-item">No users found</div>
                )}
                {!searching && results.map((u) => (
                  <Link
                    key={u.id}
                    className="nav-search-item"
                    to={`/user/${u.id}`}
                    onClick={() => {
                      setQuery("");
                      setResults([]);
                    }}
                  >
                    <div className="fw-semibold">@{u.username}</div>
                    <small className="text-muted">{u.bio || "No bio"}</small>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <span className="me-2">Hi {user.username} </span>
          <Button color="danger" onClick={logoutUser}>Logout</Button>
        </div>
      ) : (
        <div style={{ display: "flex", gap: "10px" }}>
          <Button color="primary" onClick={() => navigate("/login")}>Login</Button>
          <Button color="primary" onClick={() => navigate("/register")}>Register</Button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
