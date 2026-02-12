import { useState } from "react";
import Navbar from "../components/Navbar";
import AuthModal from "../components/AuthModal";

const Home = () => {
  const [modalType, setModalType] = useState(null);

  return (
    <>
      <Navbar
        onLogin={() => setModalType("login")}
        onRegister={() => setModalType("register")}
      />

      <AuthModal
        type={modalType}
        isOpen={modalType !== null}
        toggle={() => setModalType(null)}
      />

      <div className="hero text-center mt-5">
        <h1>Welcome to SocialApp 🚀</h1>
        <p>Connect. Share. Build.</p>
      </div>
    </>
  );
};

export default Home;
