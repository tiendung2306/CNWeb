import React from "react";
import "./LoginModal.css";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

function LoginModal({ isVisible, onClose }) {
  const [isRegistering, setIsRegistering] = React.useState(false);

  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>&times;</button>
        {isRegistering ? (
          <RegisterForm onSwitch={() => setIsRegistering(false)} />
        ) : (
          <LoginForm onSwitch={() => setIsRegistering(true)} />
        )}
      </div>
    </div>
  );
}

export default LoginModal;
