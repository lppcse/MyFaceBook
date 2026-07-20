import React, { useEffect } from 'react';
import { useSocial } from '../context/SocialContext';
import { 
  Bell, Check, UserPlus, MessageSquare, Heart, 
  MessageCircle, Sparkles, Trash2, ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';

export const NotificationsView: React.FC = () => {
  const { 
    notifications, 
    markNotificationsAsRead, 
    navigate 
  } = useSocial();

  // Mark all as read when opening this specific panel page view
  useEffect(() => {
    markNotificationsAsRead();
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
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
      default:
        return <Bell className="text-gray-500 w-5 h-5" />;
    }
  };

  const handleNotifClick = (notif: any) => {
    if (notif.type === 'friend_request') {
      navigate('friends');
    } else if (notif.type === 'message') {
      navigate('messenger', notif.senderId);
    } else {
      // Go home to inspect likes or comments, or view sender profile
      navigate('profile', notif.senderId);
    }
  };

  return (
    <div id="notifications-panel-container" className="flex-1 py-4 space-y-6 max-w-2xl mx-auto">
      {/* Header card */}
      <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-gray-950 flex items-center space-x-2">
            <Bell className="w-5.5 h-5.5 text-blue-600" />
            <span>Notifications Hub</span>
          </h2>
          <p className="text-xs text-gray-400">Chronological history of interactions with your MyFaceBook account.</p>
        </div>

        <span className="text-[10px] bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full font-extrabold flex items-center space-x-1">
          <Check className="w-3.5 h-3.5" />
          <span>All Up to Date</span>
        </span>
      </div>

      {/* Notifications list */}
      <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden divide-y divide-gray-100">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleNotifClick(notif)}
              className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors flex items-start space-x-4 ${
                !notif.isRead ? 'bg-blue-50/45 hover:bg-blue-50' : ''
              }`}
            >
              {/* Type icon indicator wrapper */}
              <div className="p-2 rounded-xl bg-white shadow-2xs border border-gray-100 shrink-0">
                {getIcon(notif.type)}
              </div>

              {/* Notification Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <img
                    src={notif.senderAvatar}
                    alt={notif.senderName}
                    className="w-7 h-7 rounded-full object-cover border border-gray-100 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <p className="text-xs font-extrabold text-gray-900 truncate">
                    {notif.senderName}
                  </p>
                </div>
                <p className="text-xs text-gray-700 mt-1 leading-relaxed">
                  {notif.content}
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-[10px] text-gray-400 font-mono">{notif.createdAt}</span>
                  {!notif.isRead && (
                    <>
                      <span className="text-gray-300 text-[10px]">•</span>
                      <span className="text-[9px] bg-blue-600 text-white font-black px-1.5 py-0.5 rounded-full select-none">
                        NEW
                      </span>
                    </>
                  )}
                </div>
              </div>

              <ArrowRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity self-center shrink-0" />
            </div>
          ))
        ) : (
          <div className="p-12 text-center text-gray-500">
            <Bell className="w-8 h-8 text-gray-300 mx-auto" />
            <p className="text-xs font-bold mt-2">No recent alerts</p>
            <p className="text-[10px] text-gray-400 mt-0.5">We'll alert you here when friend requests, comments or likes arrive.</p>
          </div>
        )}
      </div>

      {/* Helper simulation box to trigger actions easily */}
      <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl flex items-start space-x-3 text-gray-700">
        <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-blue-900">Interactive Sandbox Active</h4>
          <p className="text-[11px] text-blue-800 leading-relaxed">
            Real-time push events are running. You can trigger custom mock events using the <strong>Simulation Sandbox</strong> button in the top navigation bar to test notifications instantly.
          </p>
        </div>
      </div>
    </div>
  );
};
