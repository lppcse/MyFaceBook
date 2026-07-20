import React from 'react';
import { useSocial } from '../context/SocialContext';
import { 
  Home, Users, MessageSquare, Bell, Heart, 
  Bookmark, ShieldCheck, HelpCircle, Activity, Globe, ListFilter
} from 'lucide-react';

export const SidebarLeft: React.FC = () => {
  const { currentUser, currentView, navigate, profiles, messages, notifications } = useSocial();

  const friendRequestsCount = profiles.filter(p => p.isPendingReceived).length;
  const unreadMessagesCount = messages.filter(
    msg => msg.receiverId === currentUser.id && !msg.isRead
  ).length;
  const unreadNotifsCount = notifications.filter(n => !n.isRead).length;

  return (
    <div id="sidebar-left" className="hidden lg:flex flex-col space-y-6 w-64 pr-4 py-4 shrink-0">
      {/* Current User Quick link */}
      <div 
        id="sidebar-user-card"
        onClick={() => navigate('profile', currentUser.id)}
        className="flex items-center space-x-3 p-2.5 rounded-xl hover:bg-gray-100 cursor-pointer transition-all border border-transparent hover:border-gray-200"
      >
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className="w-10 h-10 rounded-full object-cover border border-gray-200"
          referrerPolicy="no-referrer"
        />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 truncate text-sm">{currentUser.name}</p>
          <p className="text-xs text-gray-500 truncate">{currentUser.occupation}</p>
        </div>
      </div>

      {/* Primary Shortcuts */}
      <div className="space-y-1">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2.5 block mb-2">Shortcuts</span>

        <button
          onClick={() => navigate('home')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
            currentView === 'home'
              ? 'bg-blue-50 text-blue-700 shadow-sm'
              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center space-x-3">
            <Home className={`w-5 h-5 ${currentView === 'home' ? 'text-blue-600' : 'text-gray-500'}`} />
            <span>Home Feed</span>
          </div>
        </button>

        <button
          onClick={() => navigate('friends')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
            currentView === 'friends'
              ? 'bg-blue-50 text-blue-700 shadow-sm'
              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center space-x-3">
            <Users className={`w-5 h-5 ${currentView === 'friends' ? 'text-blue-600' : 'text-gray-500'}`} />
            <span>Connect Friends</span>
          </div>
          {friendRequestsCount > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
              {friendRequestsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => navigate('messenger')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
            currentView === 'messenger'
              ? 'bg-blue-50 text-blue-700 shadow-sm'
              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center space-x-3">
            <MessageSquare className={`w-5 h-5 ${currentView === 'messenger' ? 'text-blue-600' : 'text-gray-500'}`} />
            <span>Direct Chat</span>
          </div>
          {unreadMessagesCount > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              {unreadMessagesCount}
            </span>
          )}
        </button>

        <button
          onClick={() => navigate('notifications')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
            currentView === 'notifications'
              ? 'bg-blue-50 text-blue-700 shadow-sm'
              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center space-x-3">
            <Bell className={`w-5 h-5 ${currentView === 'notifications' ? 'text-blue-600' : 'text-gray-500'}`} />
            <span>Notifications</span>
          </div>
          {unreadNotifsCount > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              {unreadNotifsCount}
            </span>
          )}
        </button>
      </div>

      {/* Utility/Static shortcuts */}
      <div className="space-y-1 border-t border-gray-100 pt-4">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2.5 block mb-2">Explore Pages</span>

        <div className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50 cursor-pointer">
          <Bookmark className="w-5 h-5 text-gray-400" />
          <span>Saved Posts</span>
        </div>

        <div className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50 cursor-pointer">
          <Globe className="w-5 h-5 text-gray-400" />
          <span>News & Events</span>
        </div>

        <div className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50 cursor-pointer">
          <Activity className="w-5 h-5 text-gray-400" />
          <span>My Activity</span>
        </div>
      </div>

      {/* Meta details */}
      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2 mt-auto">
        <div className="flex items-center space-x-2 text-blue-600 font-bold text-xs uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>MyFaceBook Stack</span>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">
          Dynamic Client SPA running with rich mock generators. Loaded with <strong>150 distinct profile</strong> templates and realistic interactions.
        </p>
        <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono pt-1">
          <span>Active Session</span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
        </div>
      </div>
    </div>
  );
};
