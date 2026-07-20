import React, { useState } from 'react';
import { useSocial } from '../context/SocialContext';
import { 
  Users, UserCheck, UserPlus, HelpCircle, 
  Search, ShieldCheck, Heart, Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';

export const FriendRequestsView: React.FC = () => {
  const { 
    profiles, 
    acceptFriendRequest, 
    rejectFriendRequest, 
    sendFriendRequest, 
    navigate 
  } = useSocial();

  const [searchFilter, setSearchFilter] = useState('');

  // 1. Pending requests RECEIVED (others added us)
  const pendingReceived = profiles.filter((p) => p.isPendingReceived);

  // 2. Pending requests SENT (we added others)
  const pendingSent = profiles.filter((p) => p.isPendingSent);

  // 3. Already friends list
  const friends = profiles.filter((p) => p.isFriend);

  // 4. Friend suggestions (not me, not friends, no pending requests)
  const suggestions = profiles.filter(
    (p) => p.id !== 'user_me' && !p.isFriend && !p.isPendingReceived && !p.isPendingSent
  );

  // Filter lists by search query
  const filteredSuggestions = suggestions.filter((p) =>
    p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    p.occupation.toLowerCase().includes(searchFilter.toLowerCase()) ||
    p.city.toLowerCase().includes(searchFilter.toLowerCase())
  ).slice(0, 30); // show top 30 suggested templates

  const filteredFriends = friends.filter((p) =>
    p.name.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div id="friends-manager-container" className="flex-1 py-4 space-y-6 max-w-full">
      {/* Search Header */}
      <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-gray-950 flex items-center space-x-2">
              <Users className="w-6 h-6 text-blue-600" />
              <span>Connect with Friends</span>
            </h2>
            <p className="text-xs text-gray-400">Discover friends, pending invitations, and active suggestions across MyFaceBook.</p>
          </div>
          <span className="text-[10px] font-mono bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">
            150+ Profiles Available
          </span>
        </div>

        <div className="flex items-center bg-gray-100 rounded-full px-3.5 py-2 border border-transparent focus-within:border-blue-400 focus-within:bg-white transition-all">
          <Search className="text-gray-400 w-4 h-4 mr-2" />
          <input
            type="text"
            placeholder="Filter suggestions by name, city or job title..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="bg-transparent border-none outline-none text-xs text-gray-800 w-full placeholder-gray-400"
          />
        </div>
      </div>

      {/* PENDING RECEIVED REQUESTS */}
      {pendingReceived.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-widest flex items-center space-x-1.5">
            <span>Incoming Invitations</span>
            <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-black">
              {pendingReceived.length}
            </span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pendingReceived.map((req) => (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-gray-200 rounded-2xl p-4 shadow-2xs flex items-center justify-between"
              >
                <div 
                  onClick={() => navigate('profile', req.id)}
                  className="flex items-center space-x-3 cursor-pointer flex-1 min-w-0"
                >
                  <img
                    src={req.avatar}
                    alt={req.name}
                    className="w-12 h-12 rounded-full object-cover border border-gray-100 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold text-gray-950 truncate hover:underline">{req.name}</p>
                    <p className="text-[10px] text-gray-500 truncate">{req.occupation}</p>
                    <p className="text-[9px] text-blue-600 font-semibold mt-0.5 font-mono">Sent you a request</p>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 shrink-0 ml-3">
                  <button
                    onClick={() => acceptFriendRequest(req.id)}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded-full transition-colors"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => rejectFriendRequest(req.id)}
                    className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-[10px] font-bold rounded-full transition-colors"
                  >
                    Ignore
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* MY CONNECTIONS (ALREADY FRIENDS) */}
      {filteredFriends.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-widest">
            My Connections ({filteredFriends.length})
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredFriends.map((f) => (
              <div
                key={f.id}
                onClick={() => navigate('profile', f.id)}
                className="bg-white border border-gray-100 rounded-2xl p-3 shadow-3xs hover:border-blue-200 cursor-pointer text-center flex flex-col items-center transition-all group"
              >
                <div className="relative">
                  <img
                    src={f.avatar}
                    alt={f.name}
                    className="w-14 h-14 rounded-full object-cover border border-gray-100"
                    referrerPolicy="no-referrer"
                  />
                  {f.isOnline && (
                    <span className="absolute bottom-0 right-0 block h-3.5 w-3.5 rounded-full bg-green-500 ring-2 ring-white animate-pulse" />
                  )}
                </div>
                <p className="text-xs font-bold text-gray-900 truncate w-full hover:underline mt-2.5">
                  {f.name}
                </p>
                <p className="text-[10px] text-gray-400 truncate w-full mt-0.5">
                  {f.occupation}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('messenger', f.id);
                  }}
                  className="mt-3 px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 text-[10px] font-bold rounded-full transition-colors w-full group-hover:bg-blue-600 group-hover:text-white"
                >
                  Send Chat
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUGGESTED ACCOUNTS (HUNDREDS OF PROFILES) */}
      <div className="space-y-3">
        <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-widest flex items-center justify-between">
          <span>Active Suggestions</span>
          <span className="text-[10px] font-mono text-gray-400 normal-case font-medium">Displaying {filteredSuggestions.length} candidates</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredSuggestions.length > 0 ? (
            filteredSuggestions.map((s) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between"
              >
                {/* Visual Cover Header */}
                <div className="h-14 w-full bg-gray-100 relative">
                  <img src={s.coverPhoto} alt="Cover template" className="w-full h-full object-cover opacity-60" />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-white" />
                </div>

                {/* Body Content */}
                <div className="px-4 pb-4 flex flex-col items-center text-center -mt-6">
                  <img
                    src={s.avatar}
                    alt={s.name}
                    onClick={() => navigate('profile', s.id)}
                    className="w-13 h-13 rounded-full object-cover border-2 border-white shadow-sm cursor-pointer hover:opacity-90 hover:scale-101 transition-all"
                    referrerPolicy="no-referrer"
                  />
                  
                  <div className="min-w-0 mt-2">
                    <p 
                      onClick={() => navigate('profile', s.id)}
                      className="text-xs font-bold text-gray-950 truncate hover:underline cursor-pointer"
                    >
                      {s.name}
                    </p>
                    <p className="text-[10px] text-gray-500 truncate mt-0.5">{s.occupation}</p>
                    <p className="text-[9px] text-gray-400 truncate mt-0.5">{s.city}</p>
                  </div>

                  <div className="w-full mt-4 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => navigate('profile', s.id)}
                      className="px-2.5 py-1.5 border border-gray-200 hover:bg-gray-50 text-[10px] font-bold rounded-full text-gray-600 transition-colors"
                    >
                      View
                    </button>
                    <button
                      onClick={() => sendFriendRequest(s.id)}
                      className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded-full shadow-sm flex items-center justify-center space-x-1 transition-colors"
                    >
                      <UserPlus className="w-3 h-3 shrink-0" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-8 text-center text-gray-500 bg-white border border-gray-200 rounded-2xl">
              <Search className="w-8 h-8 text-gray-300 mx-auto" />
              <p className="text-xs font-bold mt-2">No profiles matching search parameters</p>
              <p className="text-[10px] text-gray-400">Try cleaning your filter or search query.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
