import { useState, useEffect } from 'react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin?: () => void;
}

const LoginModal = ({ isOpen, onClose, onLogin }: LoginModalProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleLoginRedirect = () => {
    if (onLogin) {
      onLogin();
    } else {
      // Default behavior - redirect to login page
      window.location.href = '/i/account/login';
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-all duration-300 ${
        isOpen ? 'opacity-100 backdrop-blur-sm' : 'opacity-0 pointer-events-none'
      }`}
      onClick={handleBackdropClick}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div 
        className={`bg-gray-900 rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4 transform transition-all duration-300 ${
          isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-3 bg-blue-700 rounded-full flex items-center justify-center">
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              className="text-white"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Login to Continue</h2>
          <p className="text-gray-400 text-sm">
            Login before you type
          </p>
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 bg-gray-800 text-gray-300 rounded-lg font-medium hover:bg-gray-700 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleLoginRedirect}
            className="flex-1 py-2.5 px-4 bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-600 transition-all duration-200 shadow-lg"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;