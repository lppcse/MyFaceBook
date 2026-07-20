import React from 'react';
import { useSocial } from '../context/SocialContext';
import { motion, AnimatePresence } from 'motion/react';
import { UserPlus, MessageSquare, Heart, MessageCircle, X, Bell } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { activeNotification, clearNotification, navigate } = useSocial();

  const getIcon = () => {
    if (!activeNotification) return <Bell className="text-blue-500 w-5 h-5" />;
    switch (activeNotification.type) {
      case 'friend_request':
        return <UserPlus className="text-blue-600 w-5 h-5" />;
      case 'friend_accept':
        return <UserPlus className="text-green-600 w-5 h-5" />;
      case 'message':
        return <MessageSquare className="text-purple-600 w-5 h-5" />;
      case 'post_like':
        return <Heart className="text-red-500 fill-red-500 w-5 h-5" />;
      case 'post_comment':
        return <MessageCircle className="text-teal-600 w-5 h-5" />;
    }
  };

  const getBgColor = () => {
    if (!activeNotification) return 'bg-blue-50 border-blue-200';
    switch (activeNotification.type) {
      case 'friend_request':
        return 'bg-blue-50 border-blue-200';
      case 'friend_accept':
        return 'bg-green-50 border-green-200';
      case 'message':
        return 'bg-purple-50 border-purple-200';
      case 'post_like':
        return 'bg-red-50 border-red-200';
      case 'post_comment':
        return 'bg-teal-50 border-teal-200';
    }
  };

  const handleToastClick = () => {
    if (!activeNotification) return;

    if (activeNotification.type === 'friend_request') {
      navigate('friends');
    } else if (activeNotification.type === 'message') {
      navigate('messenger', activeNotification.senderId);
    } else if (activeNotification.type === 'friend_accept') {
      navigate('profile', activeNotification.senderId);
    } else {
      // Go home to see post, or dynamic scrolling
      navigate('home');
    }
    clearNotification();
  };

  return (
    <div id="toast-container" className="fixed top-20 right-4 z-50 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      <AnimatePresence>
        {activeNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            className={`pointer-events-auto w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl border ${getBgColor()} overflow-hidden`}
          >
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 p-2 rounded-lg bg-white shadow-sm border border-gray-100">
                  {getIcon()}
                </div>
                <div className="ml-3 flex-1 pt-0.5 cursor-pointer" onClick={handleToastClick}>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {activeNotification.type === 'friend_request' ? 'Friend Request' : 
                     activeNotification.type === 'message' ? 'New Message' : 
                     activeNotification.type === 'friend_accept' ? 'Connection Made' : 'Notification'}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <img
                      className="h-8 w-8 rounded-full object-cover border border-gray-200"
                      src={activeNotification.senderAvatar}
                      alt={activeNotification.senderName}
                      referrerPolicy="no-referrer"
                    />
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activeNotification.senderName}
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                    {activeNotification.content}
                  </p>
                  <p className="mt-1.5 text-[10px] text-gray-400 font-mono">
                    Just now • Click to view
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                  <button
                    id="close-toast"
                    type="button"
                    className="inline-flex rounded-md p-1.5 text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearNotification();
                    }}
                  >
                    <span className="sr-only">Close</span>
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
