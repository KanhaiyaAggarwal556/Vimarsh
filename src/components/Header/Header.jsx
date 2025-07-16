import React, { useState } from 'react';
import { 
  Search, 
  MessageCircle, 
  Bell, 
  Settings, 
  User, 
  LogOut, 
  UserPlus,
  Home,
  Menu,
  X
} from 'lucide-react';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Change this based on your auth state
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(true); // Demo state
  const [notificationCount, setNotificationCount] = useState(3); // Demo count

  const handleLogin = () => {
    setIsLoggedIn(true);
    setHasNotifications(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowProfileDropdown(false);
  };

  const handleNavigation = (path) => {
    // Replace this with your navigation logic
    console.log(`Navigating to: ${path}`);
  };

  const SettingsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Settings</h2>
          <button
            onClick={() => setShowSettingsModal(false)}
            className="text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="border-b border-gray-700 pb-4">
            <h3 className="text-lg font-medium text-white mb-3">Account</h3>
            <div className="space-y-2">
              <button 
                onClick={() => handleNavigation('/profile')}
                className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded"
              >
                Edit Profile
              </button>
              <button 
                onClick={() => handleNavigation('/privacy')}
                className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded"
              >
                Privacy & Security
              </button>
              <button 
                onClick={() => handleNavigation('/notifications')}
                className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded"
              >
                Notification Settings
              </button>
            </div>
          </div>
          
          <div className="border-b border-gray-700 pb-4">
            <h3 className="text-lg font-medium text-white mb-3">Preferences</h3>
            <div className="space-y-2">
              <button 
                onClick={() => handleNavigation('/theme')}
                className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded"
              >
                Theme & Display
              </button>
              <button 
                onClick={() => handleNavigation('/language')}
                className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded"
              >
                Language
              </button>
              <button 
                onClick={() => handleNavigation('/accessibility')}
                className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded"
              >
                Accessibility
              </button>
            </div>
          </div>
          
          <div className="border-b border-gray-700 pb-4">
            <h3 className="text-lg font-medium text-white mb-3">Support</h3>
            <div className="space-y-2">
              <button 
                onClick={() => handleNavigation('/help')}
                className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded"
              >
                Help Center
              </button>
              <button 
                onClick={() => handleNavigation('/feedback')}
                className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded"
              >
                Send Feedback
              </button>
              <button 
                onClick={() => handleNavigation('/terms')}
                className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded"
              >
                Terms of Service
              </button>
            </div>
          </div>
          
          <div className="pt-2">
            <button 
              onClick={() => {
                setShowSettingsModal(false);
                handleLogout();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-black border-b border-gray-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavigation('/')}
              className="flex items-center gap-2 text-white hover:text-indigo-400 transition-colors"
            >
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-xl font-bold hidden sm:block">Twooter</span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 flex-1 justify-center max-w-2xl">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="search"
                placeholder="Search Twooter..."
                className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <>
                {/* Messages (Tweety) */}
                <button
                  onClick={() => handleNavigation('/messages')}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors"
                  title="Tweety"
                >
                  <MessageCircle size={20} />
                </button>

                {/* Notifications */}
                <button
                  onClick={() => handleNavigation('/notifications')}
                  className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors"
                  title="Notifications"
                >
                  <Bell size={20} />
                  {hasNotifications && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {notificationCount > 9 ? '9+' : notificationCount}
                      </span>
                    </span>
                  )}
                </button>

                {/* Settings */}
                <button
                  onClick={() => setShowSettingsModal(true)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors"
                  title="Settings"
                >
                  <Settings size={20} />
                </button>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="flex items-center gap-2 p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors"
                  >
                    <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                      <User size={16} className="text-white" />
                    </div>
                  </button>

                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-lg border border-gray-700 py-1">
                      <button
                        onClick={() => {
                          handleNavigation('/profile');
                          setShowProfileDropdown(false);
                        }}
                        className="w-full px-4 py-2 text-left text-gray-300 hover:text-white hover:bg-gray-800 flex items-center gap-2"
                      >
                        <User size={16} />
                        Profile
                      </button>
                      <button
                        onClick={() => {
                          setShowSettingsModal(true);
                          setShowProfileDropdown(false);
                        }}
                        className="w-full px-4 py-2 text-left text-gray-300 hover:text-white hover:bg-gray-800 flex items-center gap-2"
                      >
                        <Settings size={16} />
                        Settings
                      </button>
                      <hr className="border-gray-700 my-1" />
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-gray-300 hover:text-white hover:bg-gray-800 flex items-center gap-2"
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Login/Signup Buttons */
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleNavigation('/login')}
                  className="px-4 py-2 text-white border border-indigo-600 rounded-full hover:bg-indigo-600 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={handleLogin}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors"
          >
            {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-gray-800 py-4">
            {/* Mobile Search */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="search"
                  placeholder="Search Twooter..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            {isLoggedIn ? (
              <div className="space-y-2">
                <button
                  onClick={() => {
                    handleNavigation('/messages');
                    setShowMobileMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <MessageCircle size={20} />
                  Tweety
                </button>
                <button
                  onClick={() => {
                    handleNavigation('/notifications');
                    setShowMobileMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <Bell size={20} />
                  Notifications
                  {hasNotifications && (
                    <span className="ml-auto w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {notificationCount > 9 ? '9+' : notificationCount}
                      </span>
                    </span>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowSettingsModal(true);
                    setShowMobileMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <Settings size={20} />
                  Settings
                </button>
                <button
                  onClick={() => {
                    handleNavigation('/profile');
                    setShowMobileMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <User size={20} />
                  Profile
                </button>
                <hr className="border-gray-700 my-2" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <LogOut size={20} />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={() => {
                    handleNavigation('/login');
                    setShowMobileMenu(false);
                  }}
                  className="w-full px-4 py-3 text-white border border-indigo-600 rounded-full hover:bg-indigo-600 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    handleLogin();
                    setShowMobileMenu(false);
                  }}
                  className="w-full px-4 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Settings Modal */}
      {showSettingsModal && <SettingsModal />}

      {/* Dropdown backdrop */}
      {showProfileDropdown && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowProfileDropdown(false)}
        ></div>
      )}
    </div>
  );
}