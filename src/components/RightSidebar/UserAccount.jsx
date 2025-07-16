// UserAccount.jsx - Updated to work with Login/SignUp pages
import React from 'react';
import { User, LogIn, UserPlus, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserAccount = ({ 
  isUserMenuOpen, 
  setIsUserMenuOpen, 
  isLoggedIn, 
  onLogout 
}) => {
  const navigate = useNavigate();
  const handleLogin = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate("/login")
    // onLogin();
  };

  const handleSignup = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate("/signup")
    // onSignup();
  };

  const handleLogout = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onLogout();
  };

  return (
    <div className="user-menu">
      <button
        className="user-icon-button"
        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
        type="button"
        aria-label="User menu"
      >
        <User size={24} />
      </button>

      {isUserMenuOpen && (
        <div className="user-dropdown">
          {isLoggedIn ? (
            <>
              <div className="user-info">
                <span>Welcome, User!</span>
              </div>
              <button onClick={handleLogout} className="menu-item" type="button">
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={handleLogin} className="menu-item" type="button">
                <LogIn size={16} />
                Login
              </button>
              <button onClick={handleSignup} className="menu-item" type="button">
                <UserPlus size={16} />
                Sign Up
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UserAccount;