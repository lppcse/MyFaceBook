/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SocialProvider, useSocial } from './context/SocialContext';
import { Navbar } from './components/Navbar';
import { SidebarLeft } from './components/SidebarLeft';
import { SidebarRight } from './components/SidebarRight';
import { Feed } from './components/Feed';
import { ProfileView } from './components/ProfileView';
import { MessengerView } from './components/MessengerView';
import { FriendRequestsView } from './components/FriendRequestsView';
import { NotificationsView } from './components/NotificationsView';
import { NotificationToast } from './components/NotificationToast';
import { 
  Home, Users, MessageSquare, Bell, User, 
  Sparkles, Layers, ShieldCheck, Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

function AppContent() {
  const { currentView, navigate, currentUser, profiles, messages, notifications } = useSocial();

  // Badge counters for responsive bottom-nav bar
  const friendRequestsCount = profiles.filter(p => p.isPendingReceived).length;
  const unreadMessagesCount = messages.filter(
    msg => msg.receiverId === currentUser.id && !msg.isRead
  ).length;
  const unreadNotifsCount = notifications.filter(n => !n.isRead).length;

  const renderActiveView = () => {
    switch (currentView) {
      case 'home':
        return <Feed />;
      case 'profile':
        return <ProfileView />;
      case 'messenger':
        return <MessengerView />;
      case 'friends':
        return <FriendRequestsView />;
      case 'notifications':
        return <NotificationsView />;
      default:
        return <Feed />;
    }
  };

  return (
    <div id="app-shell" className="min-h-screen bg-gray-100 flex flex-col font-sans select-none pb-16 md:pb-0">
      {/* GLOBAL HIGH-FIDELITY NAVBAR */}
      <Navbar />

      {/* CORE CONTAINER STAGE */}
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 flex gap-6 flex-1 min-h-[calc(100vh-65px)]">
        
        {/* LEFT COMPACT SHORTCUT RAIL */}
        <SidebarLeft />

        {/* SWAPABLE MAIN PLATFORM WALL */}
        <main id="primary-content-wall" className="flex-1 min-w-0 py-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="h-full"
            >
              {renderActiveView()}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* RIGHT ACTIVE CONTACTS RAIL */}
        {currentView !== 'messenger' && <SidebarRight />}
      </div>

      {/* FLOATING SIMULATED NOTIFICATION BANNER */}
      <NotificationToast />

      {/* HIGHLY RESPONSIVE TABLET/MOBILE NAVIGATION BAR */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg px-2 py-1.5 flex justify-around items-center z-40">
        <button
          onClick={() => navigate('home')}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
            currentView === 'home' ? 'text-blue-600 font-bold scale-105' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[9px] mt-0.5">Home</span>
        </button>

        <button
          onClick={() => navigate('friends')}
          className={`relative flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
            currentView === 'friends' ? 'text-blue-600 font-bold scale-105' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Users className="w-5 h-5" />
          {friendRequestsCount > 0 && (
            <span className="absolute top-1 right-2 bg-red-500 text-white text-[8px] font-black h-4 w-4 rounded-full flex items-center justify-center animate-pulse">
              {friendRequestsCount}
            </span>
          )}
          <span className="text-[9px] mt-0.5">Friends</span>
        </button>

        <button
          onClick={() => navigate('messenger')}
          className={`relative flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
            currentView === 'messenger' ? 'text-blue-600 font-bold scale-105' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          {unreadMessagesCount > 0 && (
            <span className="absolute top-1 right-2 bg-red-500 text-white text-[8px] font-black h-4 w-4 rounded-full flex items-center justify-center">
              {unreadMessagesCount}
            </span>
          )}
          <span className="text-[9px] mt-0.5">Chats</span>
        </button>

        <button
          onClick={() => navigate('notifications')}
          className={`relative flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
            currentView === 'notifications' ? 'text-blue-600 font-bold scale-105' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Bell className="w-5 h-5" />
          {unreadNotifsCount > 0 && (
            <span className="absolute top-1 right-2 bg-red-500 text-white text-[8px] font-black h-4 w-4 rounded-full flex items-center justify-center">
              {unreadNotifsCount}
            </span>
          )}
          <span className="text-[9px] mt-0.5">Alerts</span>
        </button>

        <button
          onClick={() => navigate('profile', currentUser.id)}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
            currentView === 'profile' ? 'text-blue-600 font-bold scale-105' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <img
            src={currentUser.avatar}
            alt="My Profile"
            className="w-5.5 h-5.5 rounded-full object-cover border border-gray-200"
            referrerPolicy="no-referrer"
          />
          <span className="text-[9px] mt-0.5">Profile</span>
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <SocialProvider>
      <AppContent />
    </SocialProvider>
  );
}
