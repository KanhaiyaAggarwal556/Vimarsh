import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineClose } from "react-icons/ai";
import { MORE_ITEMS, SIDEBAR_CONFIG } from "@/config/navigationConfig";

interface MoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MoreModal: React.FC<MoreModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100"
      style={{
        background: "rgba(0,0,0,0.8)",
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        className="rounded-4 shadow-lg d-flex flex-column"
        style={{
          backgroundColor: SIDEBAR_CONFIG.backgroundColor,
          width: "90%",
          maxWidth: "400px",
          padding: "2rem",
          border: "1px solid #333",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="text-white mb-0">More Options</h5>
          <button
            className="btn btn-outline-light btn-sm"
            onClick={onClose}
            style={{ border: "none" }}
          >
            <AiOutlineClose size={20} />
          </button>
        </div>
        
        <div className="d-flex flex-column gap-2">
          {MORE_ITEMS.map(({ id, to, icon, label }) => (
            <Link
              key={id}
              to={to}
              className="nav-link text-white d-flex align-items-center p-3 rounded"
              style={{
                backgroundColor: "rgba(255,255,255,0.1)",
                transition: "background-color 0.3s",
                textDecoration: "none",
              }}
              onClick={onClose}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
              }}
            >
              <span className="me-3">{React.cloneElement(icon, { size: 20 })}</span>
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoreModal;