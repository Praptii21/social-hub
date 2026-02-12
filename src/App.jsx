import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { useContext } from "react";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
// Added missing imports
import Followers from "./pages/Followers"; 
import Following from "./pages/Following";
import UserProfile from "./pages/UserProfile";

// PrivateRoute component
const PrivateRoute = ({ children }) => {
  const { token } = useContext(AuthContext);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const PrivateRoute = ({ children }) => {
    const { token } = useContext(AuthContext);
    return token ? children : <Navigate to="/login" />;
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />


          <Route
            path="/profile"
            element={<PrivateRoute><Profile /></PrivateRoute>}
          />

          <Route
            path="/user/:id/followers"
            element={<PrivateRoute><Followers /></PrivateRoute>}
          />

          <Route
            path="/user/:id/following"
            element={<PrivateRoute><Following /></PrivateRoute>}
          />

          <Route
            path="/user/:id"
            element={<PrivateRoute><UserProfile /></PrivateRoute>}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
export default App;
