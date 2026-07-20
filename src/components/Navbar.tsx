import React, { useState, useRef, useEffect } from 'react';
import { useSocial } from '../context/SocialContext';
import { 
  Search, Home, Users, MessageSquare, Bell, Sparkles, User, 
  Settings, LogOut, Check, X, ShieldAlert, Zap, Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Navbar: React.FC = () => {
  const { 
    currentUser, 
    notifications, 
    messages, 
    currentView, 
    navigate,
    profiles,
    isSimulating,
    setSimulationMode,
    triggerMockFriendRequest,
    triggerMockMessage,
    triggerMockLikeOrComment
  } = useSocial();

  const [searchFocused, setSearchFocused] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotificationsMenu, setShowNotificationsMenu] = useState(false);
  const [showSandboxMenu, setShowSandboxMenu] = useState(false);

  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);
  const sandboxMenuRef = useRef<HTMLDivElement>(null);

  // Unread friend requests from notification state
  const friendRequestsCount = profiles.filter(p => p.isPendingReceived).length;

  // Unread messages count
  const unreadMessagesCount = messages.filter(
    msg => msg.receiverId === currentUser.id && !msg.isRead
  ).length;

  // Unread general notifications
  const unreadNotifsCount = notifications.filter(n => !n.isRead).length;

  // Filter profiles based on search query
  const searchResults = searchInput.trim()
    ? profiles.filter(p => 
        p.name.toLowerCase().includes(searchInput.toLowerCase()) ||
        p.occupation.toLowerCase().includes(searchInput.toLowerCase()) ||
        p.city.toLowerCase().includes(searchInput.toLowerCase())
      ).slice(0, 5)
    : [];

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target as Node)) {
        setShowNotificationsMenu(false);
      }
      if (sandboxMenuRef.current && !sandboxMenuRef.current.contains(e.target as Node)) {
        setShowSandboxMenu(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSearchResultClick = (profileId: string) => {
    navigate('profile', profileId);
    setSearchInput('');
    setSearchFocused(false);
  };

  return (
    <nav id="app-navbar" className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm px-4 py-2 flex items-center justify-between">
      {/* LEFT SECTION: Logo & Search */}
      <div className="flex items-center space-x-3 flex-1 max-w-xs sm:max-w-md">
        {/* Brand Logo */}
        <div 
          id="navbar-brand" 
          onClick={() => navigate('home')} 
          className="cursor-pointer text-blue-600 font-extrabold text-2xl tracking-tight select-none flex items-center space-x-1"
        >
          <span className="bg-blue-600 text-white px-2.5 py-1 rounded-lg text-xl font-black shadow-md shadow-blue-200">f</span>
          <span className="hidden sm:inline text-blue-600 font-black">MyFaceBook</span>
        </div>

        {/* Global Search Bar */}
        <div className="relative flex-1">
          <div className="flex items-center bg-gray-100 rounded-full px-3 py-1.5 border border-transparent focus-within:border-blue-400 focus-within:bg-white transition-all">
            <Search className="text-gray-400 w-4 h-4 mr-2" />
            <input
              id="global-search-input"
              type="text"
              placeholder="Search profiles, titles..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              className="bg-transparent border-none outline-none text-sm text-gray-800 w-full placeholder-gray-400"
            />
            {searchInput && (
              <X 
                className="text-gray-400 hover:text-gray-600 w-4 h-4 cursor-pointer" 
                onClick={() => setSearchInput('')}
              />
            )}
          </div>

          {/* Search Dropdown Panel */}
          <AnimatePresence>
            {searchFocused && (searchInput.trim() || searchResults.length > 0) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute left-0 mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 max-h-96 overflow-y-auto"
              >
                <div className="p-2 border-b border-gray-50 bg-gray-50 flex justify-between items-center">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2">Matches in MyFaceBook</span>
                  <X 
                    className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer" 
                    onClick={() => setSearchFocused(false)}
                  />
                </div>
                {searchResults.length > 0 ? (
                  <div className="p-1 space-y-0.5">
                    {searchResults.map((result) => (
                      <div
                        key={result.id}
                        onClick={() => handleSearchResultClick(result.id)}
                        className="flex items-center space-x-3 p-2 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"
                      >
                        <img
                          src={result.avatar}
                          alt={result.name}
                          className="w-10 h-10 rounded-full object-cover border border-gray-100"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{result.name}</p>
                          <p className="text-xs text-gray-500 truncate">{result.occupation} • {result.city}</p>
                        </div>
                        {result.isFriend && (
                          <span className="text-[10px] bg-green-100 text-green-700 font-medium px-1.5 py-0.5 rounded-full">
                            Friend
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-gray-500">
                    No users matching "{searchInput}" found. Try "Connor", "Marcus" or "Designer".
                  </div>
                )}
                {/* General search prompt */}
                <div className="p-2 text-center text-xs text-gray-400 border-t border-gray-50 bg-gray-50">
                  Showing top {searchResults.length} matches out of 150+ profiles
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* MIDDLE SECTION: Navigation Icons (Desktop/Tablet) */}
      <div className="hidden md:flex items-center space-x-1 lg:space-x-4">
        <button
          id="nav-home-btn"
          onClick={() => navigate('home')}
          className={`relative p-3 rounded-xl transition-all ${
            currentView === 'home' 
              ? 'text-blue-600 bg-blue-50 font-bold scale-105' 
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
          }`}
          title="Home Feed"
        >
          <Home className="w-5.5 h-5.5" />
          {currentView === 'home' && (
            <motion.div layoutId="nav-underline" className="absolute bottom-0 left-2 right-2 h-0.5 bg-blue-600 rounded-full" />
          )}
        </button>

        <button
          id="nav-friends-btn"
          onClick={() => navigate('friends')}
          className={`relative p-3 rounded-xl transition-all ${
            currentView === 'friends' 
              ? 'text-blue-600 bg-blue-50 font-bold scale-105' 
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
          }`}
          title="Friends & Connections"
        >
          <Users className="w-5.5 h-5.5" />
          {friendRequestsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full scale-90 animate-pulse">
              {friendRequestsCount}
            </span>
          )}
          {currentView === 'friends' && (
            <motion.div layoutId="nav-underline" className="absolute bottom-0 left-2 right-2 h-0.5 bg-blue-600 rounded-full" />
          )}
        </button>

        <button
          id="nav-messenger-btn"
          onClick={() => navigate('messenger')}
          className={`relative p-3 rounded-xl transition-all ${
            currentView === 'messenger' 
              ? 'text-blue-600 bg-blue-50 font-bold scale-105' 
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
          }`}
          title="Private Messenger"
        >
          <MessageSquare className="w-5.5 h-5.5" />
          {unreadMessagesCount > 0 && (
            <span className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full scale-90">
              {unreadMessagesCount}
            </span>
          )}
          {currentView === 'messenger' && (
            <motion.div layoutId="nav-underline" className="absolute bottom-0 left-2 right-2 h-0.5 bg-blue-600 rounded-full" />
          )}
        </button>

        <button
          id="nav-notifications-btn"
          onClick={() => navigate('notifications')}
          className={`relative p-3 rounded-xl transition-all ${
            currentView === 'notifications' 
              ? 'text-blue-600 bg-blue-50 font-bold scale-105' 
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
          }`}
          title="Notifications Hub"
        >
          <Bell className="w-5.5 h-5.5" />
          {unreadNotifsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full scale-90">
              {unreadNotifsCount}
            </span>
          )}
          {currentView === 'notifications' && (
            <motion.div layoutId="nav-underline" className="absolute bottom-0 left-2 right-2 h-0.5 bg-blue-600 rounded-full" />
          )}
        </button>
      </div>

      {/* RIGHT SECTION: Interactive Sandbox Controls & Profile Menu */}
      <div className="flex items-center space-x-2.5">
        {/* SIMULATION SANDBOX CONTROLLER */}
        <div ref={sandboxMenuRef} className="relative">
          <button
            id="sandbox-toggle-btn"
            onClick={() => setShowSandboxMenu(!showSandboxMenu)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              isSimulating 
                ? 'bg-amber-50 border-amber-200 text-amber-700 animate-pulse' 
                : 'bg-gray-100 border-gray-200 text-gray-600'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="hidden lg:inline">Simulation Sandbox</span>
            <span className={`w-2 h-2 rounded-full ${isSimulating ? 'bg-green-500' : 'bg-gray-400'}`}></span>
          </button>

          {/* Sandbox Controls Dropdown */}
          <AnimatePresence>
            {showSandboxMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-50 text-gray-800"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm flex items-center space-x-1.5 text-gray-900">
                    <Zap className="w-4.5 h-4.5 text-amber-500 fill-amber-100" />
                    <span>Real-time Sandbox</span>
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={isSimulating}
                      onChange={(e) => setSimulationMode(e.target.checked)}
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                  </label>
                </div>
                
                <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                  Toggle dynamic simulation. When enabled, some of the 150+ profiles periodically send friend requests, likes, or private chats with instant pop notifications!
                </p>

                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Trigger Actions Instantly</span>
                  
                  <button
                    onClick={() => {
                      triggerMockFriendRequest();
                      setShowSandboxMenu(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <span>Receive Friend Request</span>
                    <Users className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      triggerMockMessage();
                      setShowSandboxMenu(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 bg-purple-50 text-purple-700 text-xs font-semibold rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    <span>Receive Private Message</span>
                    <MessageSquare className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      triggerMockLikeOrComment();
                      setShowSandboxMenu(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 bg-pink-50 text-pink-700 text-xs font-semibold rounded-lg hover:bg-pink-100 transition-colors"
                  >
                    <span>Get Like / Post Comment</span>
                    <Heart className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* PROFILE DROPDOWN */}
        <div ref={profileMenuRef} className="relative">
          <button
            id="nav-profile-menu-btn"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-1.5 focus:outline-none"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-9 h-9 rounded-full object-cover border border-gray-200 hover:opacity-90 transition-opacity cursor-pointer"
              referrerPolicy="no-referrer"
            />
          </button>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 text-gray-800"
              >
                <div 
                  onClick={() => {
                    navigate('profile', currentUser.id);
                    setShowProfileMenu(false);
                  }}
                  className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer flex items-center space-x-3 transition-colors"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-12 h-12 rounded-full object-cover border border-gray-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 truncate">{currentUser.name}</p>
                    <p className="text-xs text-gray-500 truncate">@{currentUser.username}</p>
                    <p className="text-[10px] text-blue-600 font-semibold mt-0.5">View your Profile</p>
                  </div>
                </div>

                <div className="p-1.5 space-y-0.5">
                  <button
                    onClick={() => {
                      navigate('profile', currentUser.id);
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <User className="w-4 h-4 text-gray-500" />
                    <span>My Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate('friends');
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Users className="w-4 h-4 text-gray-500" />
                    <span>Manage Connections</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate('messenger');
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4 text-gray-500" />
                    <span>Chat Hub</span>
                  </button>
                </div>

                <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400 font-mono">
                  <span>Logged in as Admin</span>
                  <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">active</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
};
