import React, { useState, useRef, useEffect } from 'react';
import { useSocial } from '../context/SocialContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, Search, Smile, Image, Phone, Video, Info, 
  CheckCheck, ShieldCheck, HelpCircle, MessageSquare
} from 'lucide-react';

export const MessengerView: React.FC = () => {
  const { 
    currentUser, 
    profiles, 
    messages, 
    sendMessage, 
    activeChatUserId, 
    markChatAsRead,
    navigate,
    isTyping 
  } = useSocial();

  const [messageInput, setMessageInput] = useState('');
  const [contactsSearch, setContactsSearch] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Get friends lists to converse with
  const connectedFriends = profiles.filter((p) => p.isFriend && p.id !== currentUser.id);

  // Filter contacts by search input
  const filteredContacts = connectedFriends.filter((c) =>
    c.name.toLowerCase().includes(contactsSearch.toLowerCase())
  );

  // 2. Identify the active chat friend
  const activeFriend = activeChatUserId 
    ? profiles.find((p) => p.id === activeChatUserId) 
    : null;

  // 3. Filter messages between me and the active friend
  const activeChatMessages = messages.filter(
    (msg) =>
      (msg.senderId === currentUser.id && msg.receiverId === activeChatUserId) ||
      (msg.senderId === activeChatUserId && msg.receiverId === currentUser.id)
  );

  // Mark messages as read whenever the active chat user changes, or new messages arrive
  useEffect(() => {
    if (activeChatUserId) {
      markChatAsRead(activeChatUserId);
    }
  }, [activeChatUserId, messages.length]);

  // Scroll to bottom of chat history when new messages arrive or typing status changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChatMessages.length, isTyping]);

  const handleSendMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeChatUserId) return;
    sendMessage(activeChatUserId, messageInput);
    setMessageInput('');
  };

  // Helper to count unread messages from a specific friend
  const getUnreadCount = (friendId: string) => {
    return messages.filter(
      (msg) => msg.senderId === friendId && msg.receiverId === currentUser.id && !msg.isRead
    ).length;
  };

  // Get last message from a specific friend
  const getLastMessageText = (friendId: string) => {
    const thread = messages.filter(
      (msg) =>
        (msg.senderId === currentUser.id && msg.receiverId === friendId) ||
        (msg.senderId === friendId && msg.receiverId === currentUser.id)
    );
    if (thread.length === 0) return 'No conversation yet';
    const last = thread[thread.length - 1];
    return last.senderId === currentUser.id ? `You: ${last.content}` : last.content;
  };

  return (
    <div id="messenger-container" className="flex-1 bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden flex h-[calc(100vh-120px)] min-h-[450px]">
      {/* LEFT PANEL: Contacts Directory */}
      <div className="w-80 border-r border-gray-200 flex flex-col h-full bg-gray-50/50 shrink-0">
        {/* Contact Search Box */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <h3 className="text-lg font-extrabold text-gray-950 mb-3">Chats</h3>
          <div className="flex items-center bg-gray-100 rounded-full px-3 py-2 border border-transparent focus-within:border-blue-400 focus-within:bg-white transition-all">
            <Search className="text-gray-400 w-4 h-4 mr-2" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={contactsSearch}
              onChange={(e) => setContactsSearch(e.target.value)}
              className="bg-transparent border-none outline-none text-xs text-gray-800 w-full placeholder-gray-400"
            />
          </div>
        </div>

        {/* Contacts scrolling body */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredContacts.length > 0 ? (
            filteredContacts.map((friend) => {
              const isActive = friend.id === activeChatUserId;
              const unreadCount = getUnreadCount(friend.id);
              const lastMsg = getLastMessageText(friend.id);

              return (
                <div
                  key={friend.id}
                  onClick={() => navigate('messenger', friend.id)}
                  className={`flex items-center space-x-3 p-3 rounded-2xl cursor-pointer transition-all border ${
                    isActive
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100'
                      : 'hover:bg-gray-100 border-transparent text-gray-800'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={friend.avatar}
                      alt={friend.name}
                      className="w-11 h-11 rounded-full object-cover border border-gray-200"
                      referrerPolicy="no-referrer"
                    />
                    {friend.isOnline && (
                      <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <p className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-gray-900'}`}>
                        {friend.name}
                      </p>
                      {friend.isOnline && !isActive && (
                        <span className="text-[9px] text-green-500 font-semibold uppercase font-mono">active</span>
                      )}
                    </div>
                    <p className={`text-[11px] truncate mt-0.5 ${isActive ? 'text-blue-100' : 'text-gray-500 font-medium'}`}>
                      {lastMsg}
                    </p>
                  </div>

                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center shrink-0">
                      {unreadCount}
                    </span>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-6 text-center text-gray-400 text-xs">
              {connectedFriends.length === 0 
                ? "No friends connected yet. Go to 'Connect Friends' tab to find and add connections!"
                : "No matching chats found."}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL: Chat Thread */}
      <div className="flex-1 flex flex-col h-full bg-white relative">
        {activeFriend ? (
          <>
            {/* Chat Window Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white shadow-xs z-10">
              <div className="flex items-center space-x-3">
                <img
                  src={activeFriend.avatar}
                  alt={activeFriend.name}
                  onClick={() => navigate('profile', activeFriend.id)}
                  className="w-10 h-10 rounded-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0">
                  <h4 
                    onClick={() => navigate('profile', activeFriend.id)}
                    className="text-sm font-extrabold text-gray-950 cursor-pointer hover:underline"
                  >
                    {activeFriend.name}
                  </h4>
                  <p className="text-xs text-gray-400 truncate flex items-center space-x-1">
                    <span>{activeFriend.occupation}</span>
                    <span>•</span>
                    <span className={activeFriend.isOnline ? 'text-green-500 font-bold' : 'text-gray-400'}>
                      {activeFriend.isOnline ? 'Active Now' : 'Offline'}
                    </span>
                  </p>
                </div>
              </div>

              {/* Call and Info placeholders to enrich the visual header */}
              <div className="flex items-center space-x-1">
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
                  <Phone className="w-4.5 h-4.5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
                  <Video className="w-4.5 h-4.5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
                  <Info className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>

            {/* Chat Window Messages List */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50 space-y-3.5">
              {activeChatMessages.map((msg) => {
                const isSentByMe = msg.senderId === currentUser.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex items-end space-x-2 max-w-[80%] ${
                      isSentByMe ? 'ml-auto justify-end' : ''
                    }`}
                  >
                    {!isSentByMe && (
                      <img
                        src={activeFriend.avatar}
                        alt={activeFriend.name}
                        className="w-7 h-7 rounded-full object-cover border border-gray-200 shrink-0 mb-1"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    <div className="space-y-0.5">
                      <div
                        className={`p-3 text-xs leading-relaxed shadow-3xs ${
                          isSentByMe
                            ? 'bg-blue-600 text-white rounded-2xl rounded-br-none'
                            : 'bg-white text-gray-800 border border-gray-200 rounded-2xl rounded-bl-none'
                        }`}
                      >
                        {msg.content}
                      </div>
                      <p className={`text-[9px] text-gray-400 font-mono ${isSentByMe ? 'text-right' : ''}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* Simulated active typing bubble indicator */}
              {isTyping && (
                <div className="flex items-end space-x-2 max-w-[80%]">
                  <img
                    src={activeFriend.avatar}
                    alt={activeFriend.name}
                    className="w-7 h-7 rounded-full object-cover border border-gray-200 shrink-0 mb-1"
                    referrerPolicy="no-referrer"
                  />
                  <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-bl-none shadow-3xs flex items-center space-x-1.5">
                    <span className="text-[11px] text-gray-500 font-medium italic">{activeFriend.name.split(' ')[0]} is writing</span>
                    <span className="flex space-x-1">
                      <span className="block h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="block h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="block h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Chat Window Message Composer Form */}
            <form onSubmit={handleSendMessageSubmit} className="p-3 bg-white border-t border-gray-200 flex items-center space-x-2">
              <button type="button" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors shrink-0">
                <Image className="w-5 h-5" />
              </button>
              
              <div className="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-2 border border-transparent focus-within:border-blue-400 focus-within:bg-white transition-all">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="bg-transparent border-none outline-none text-xs text-gray-800 w-full placeholder-gray-400"
                />
                <button type="button" className="text-gray-400 hover:text-gray-600 px-1.5 shrink-0">
                  <Smile className="w-4.5 h-4.5" />
                </button>
              </div>

              <button
                type="submit"
                disabled={!messageInput.trim()}
                className={`p-2.5 rounded-full flex items-center justify-center transition-all shrink-0 ${
                  messageInput.trim()
                    ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-sm shadow-blue-100'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          /* Welcome Default Screen (when no contact is chosen) */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-50/20">
            <div className="p-5 bg-blue-50 rounded-full text-blue-600 shadow-sm border border-blue-100 mb-4 animate-bounce">
              <MessageSquare className="w-10 h-10" />
            </div>
            <h3 className="text-base font-extrabold text-gray-950">MyFaceBook Messenger</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm">
              Select any of your connected friends from the sidebar to launch real-time secure messaging with dynamic typing auto-replies.
            </p>
            <div className="mt-6 flex items-center space-x-1 bg-green-50 border border-green-200 text-green-700 text-[11px] font-bold px-3 py-1.5 rounded-full">
              <ShieldCheck className="w-4 h-4 text-green-600 shrink-0" />
              <span>Simulated SSL Encrypted Chat Tunnel Active</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
