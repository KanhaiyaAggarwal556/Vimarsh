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
      className="fixed inset-0 w-full h-full flex items-center justify-center z-[2000]"
      style={{ background: "rgba(0,0,0,0.8)" }}
      onClick={onClose}
    >
      <div
        className="rounded-2xl shadow-lg flex flex-col w-[90%] max-w-[400px] p-8 border border-gray-700"
        style={{ backgroundColor: SIDEBAR_CONFIG.backgroundColor }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-3">
          <h5 className="text-white mb-0">More Options</h5>
          <button
            className="btn btn-outline-light btn-sm border-0"
            onClick={onClose}
          >
            <AiOutlineClose size={20} />
          </button>
        </div>
        
        <div className="flex flex-col gap-2">
          {MORE_ITEMS.map(({ id, to, icon, label }) => (
            <Link
              key={id}
              to={to}
              className="nav-link text-white flex items-center p-3 rounded no-underline bg-white/10 transition-colors duration-300 hover:bg-white/20"
              onClick={onClose}
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