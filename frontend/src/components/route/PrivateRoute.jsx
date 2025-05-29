// src/routes/PrivateRoute.jsx
import { useAuth } from "../../context/AuthContext";
import LoginModal from "../LoginModal";
import { useState } from "react";

const PrivateRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const [showModal, setShowModal] = useState(true);

  if (isLoggedIn) {
    return children;
  }

  return (
    <>
      <LoginModal isVisible={showModal} onClose={() => setShowModal(false)} />
      {!showModal && <p style={{ padding: "20px", textAlign: "center" }}>Bạn cần đăng nhập để tiếp tục.</p>}
    </>
  );
};

export default PrivateRoute;
