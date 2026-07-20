import React from 'react';
import { useSocial } from '../context/SocialContext';
import { Sparkles, MessageCircle, UserPlus, HelpCircle, ExternalLink } from 'lucide-react';

export const SidebarRight: React.FC = () => {
  const { profiles, sendFriendRequest, navigate } = useSocial();

  // Get active online friends
  const onlineFriends = profiles.filter((p) => p.isFriend && p.isOnline).slice(0, 10);
  const offlineFriends = profiles.filter((p) => p.isFriend && !p.isOnline).slice(0, 5);

  // Get potential friend suggestions (not friends, no pending requests, not me)
  const suggestions = profiles
    .filter((p) => !p.isFriend && !p.isPendingReceived && !p.isPendingSent && p.id !== 'user_me')
    .slice(0, 3);

  const handleContactClick = (profileId: string) => {
    navigate('messenger', profileId);
  };

  return (
    <div id="sidebar-right" className="hidden xl:flex flex-col space-y-6 w-80 pl-6 py-4 shrink-0 border-l border-gray-100">
      {/* Sponsored Ads (Classic Facebook element) */}
      <div className="space-y-3">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Sponsored</span>

        <a 
          href="https://ai.studio/build" 
          target="_blank" 
          rel="noreferrer"
          className="flex items-start space-x-3 p-2 rounded-xl hover:bg-gray-50 transition-colors group cursor-pointer"
        >
          <div className="w-20 h-20 bg-blue-900 rounded-lg flex-shrink-0 flex items-center justify-center text-white text-xs font-bold font-mono text-center p-1 relative overflow-hidden">
            <span className="z-10 text-[9px] uppercase tracking-wider font-extrabold text-blue-200">AI Studio</span>
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 via-indigo-700 to-purple-800 opacity-80" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-gray-900 group-hover:text-blue-600 transition-colors flex items-center space-x-1">
              <span>Google AI Studio Build</span>
              <ExternalLink className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h4>
            <p className="text-[11px] text-gray-500 mt-1 line-clamp-2 leading-relaxed">
              Build and scale fully interactive web applications directly from plain English prompt instructions.
            </p>
            <p className="text-[10px] text-gray-400 font-mono mt-1">ai.studio/build</p>
          </div>
        </a>

        <a 
          href="https://images.unsplash.com" 
          target="_blank" 
          rel="noreferrer"
          className="flex items-start space-x-3 p-2 rounded-xl hover:bg-gray-50 transition-colors group cursor-pointer"
        >
          <div className="w-20 h-20 rounded-lg flex-shrink-0 overflow-hidden relative border border-gray-100">
            <img 
              src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=100&h=100&fit=crop&auto=format" 
              alt="Unsplash Promo" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-gray-900 group-hover:text-blue-600 transition-colors flex items-center space-x-1">
              <span>Beautiful Stock Imagery</span>
              <ExternalLink className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h4>
            <p className="text-[11px] text-gray-500 mt-1 line-clamp-2 leading-relaxed">
              Access millions of stunning, high-definition photography templates completely free.
            </p>
            <p className="text-[10px] text-gray-400 font-mono mt-1">unsplash.com</p>
          </div>
        </a>
      </div>

      {/* Friend Suggestions */}
      {suggestions.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Friend Suggestions</span>
            <span 
              onClick={() => navigate('friends')}
              className="text-xs text-blue-600 hover:underline cursor-pointer font-semibold"
            >
              See All
            </span>
          </div>

          <div className="space-y-3">
            {suggestions.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-1.5 rounded-xl hover:bg-gray-50 transition-all">
                <div 
                  onClick={() => navigate('profile', p.id)}
                  className="flex items-center space-x-2.5 cursor-pointer flex-1 min-w-0"
                >
                  <img
                    src={p.avatar}
                    alt={p.name}
                    className="w-9 h-9 rounded-full object-cover border border-gray-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate hover:underline">{p.name}</p>
                    <p className="text-[10px] text-gray-500 truncate">{p.occupation}</p>
                  </div>
                </div>

                <button
                  onClick={() => sendFriendRequest(p.id)}
                  className="p-1.5 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors flex items-center justify-center shrink-0 ml-2"
                  title="Add Friend"
                >
                  <UserPlus className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contacts / Friends list (Direct Messenger launcher) */}
      <div className="space-y-3 pt-4 border-t border-gray-100 flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Contacts</span>
          <span className="text-xs font-mono bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-bold">
            {onlineFriends.length} Online
          </span>
        </div>

        <div className="space-y-0.5 overflow-y-auto pr-1 flex-1">
          {onlineFriends.length > 0 ? (
            onlineFriends.map((p) => (
              <div
                key={p.id}
                onClick={() => handleContactClick(p.id)}
                className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors group border border-transparent hover:border-gray-200"
              >
                <div className="relative shrink-0">
                  <img
                    src={p.avatar}
                    alt={p.name}
                    className="w-8.5 h-8.5 rounded-full object-cover border border-gray-100"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                    {p.name}
                  </p>
                  <p className="text-[10px] text-green-600 font-medium truncate">Online Now</p>
                </div>
                <MessageCircle className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-all shrink-0" />
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-400 text-center py-4">No friends currently online. Go to 'Connect Friends' to add connections!</p>
          )}

          {offlineFriends.length > 0 && (
            <>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mt-3 mb-1 px-2">Offline Contacts</span>
              {offlineFriends.map((p) => (
                <div
                  key={p.id}
                  onClick={() => handleContactClick(p.id)}
                  className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors group opacity-65 hover:opacity-100"
                >
                  <img
                    src={p.avatar}
                    alt={p.name}
                    className="w-8.5 h-8.5 rounded-full object-cover border border-gray-200 grayscale"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-800 truncate">
                      {p.name}
                    </p>
                    <p className="text-[9px] text-gray-400 truncate">Last active {p.lastActive || 'recently'}</p>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
