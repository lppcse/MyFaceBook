import React, { useState } from 'react';
import { useSocial } from '../context/SocialContext';
import { PostCard } from './PostCard';
import { 
  Briefcase, MapPin, Heart, Users, ShieldAlert, Edit2, 
  MessageSquare, UserPlus, UserMinus, Check, Camera, Image,
  X, Info, PhoneCall, Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ProfileView: React.FC = () => {
  const { 
    currentUser, 
    profiles, 
    posts, 
    navigate,
    activeProfileId,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    unfriend,
    updateMyProfile
  } = useSocial();

  const [activeTab, setActiveTab] = useState<'posts' | 'about' | 'friends' | 'photos'>('posts');
  const [isEditing, setIsEditing] = useState(false);

  // Form states for profile editing
  const [editName, setEditName] = useState(currentUser.name);
  const [editBio, setEditBio] = useState(currentUser.bio);
  const [editOcc, setEditOcc] = useState(currentUser.occupation);
  const [editCity, setEditCity] = useState(currentUser.city);
  const [editRel, setEditRel] = useState(currentUser.relationship);
  const [editAvatar, setEditAvatar] = useState(currentUser.avatar);
  const [editCover, setEditCover] = useState(currentUser.coverPhoto);

  // 1. Identify the target profile to render
  const isMe = !activeProfileId || activeProfileId === currentUser.id;
  const profile = isMe 
    ? currentUser 
    : (profiles.find((p) => p.id === activeProfileId) || currentUser);

  // 2. Fetch target profile's authored posts
  const profilePosts = posts.filter((post) => post.authorId === profile.id);

  // 3. Filter photos tab (all posts with images)
  const profilePhotos = posts.filter((post) => post.authorId === profile.id && post.imageUrl);

  // 4. Friends list (Get other profiles who are friends)
  const friendsList = profiles.filter((p) => p.isFriend && p.id !== currentUser.id).slice(0, 12);

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMyProfile(editName, editBio, editOcc, editCity, editRel, editAvatar, editCover);
    setIsEditing(false);
  };

  // Pre-configured preset photos if they want to edit their cover or avatar with options
  const avatarPresets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces&auto=format',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces&auto=format',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces&auto=format',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces&auto=format'
  ];

  const coverPresets = [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=300&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=300&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&h=300&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800&h=300&fit=crop&auto=format'
  ];

  return (
    <div id="profile-container" className="flex-1 max-w-4xl mx-auto py-4 space-y-6">
      {/* PROFILE HEADER BLOCK */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden relative">
        {/* COVER PHOTO */}
        <div className="h-56 sm:h-72 w-full bg-gray-100 relative group overflow-hidden">
          <img
            src={profile.coverPhoto}
            alt="Profile Cover"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {isMe && (
            <button
              onClick={() => setIsEditing(true)}
              className="absolute bottom-3 right-3 bg-white/90 hover:bg-white text-gray-800 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm flex items-center space-x-1.5 transition-all"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Edit Cover Photo</span>
            </button>
          )}
        </div>

        {/* PROFILE INFO OVERLAY */}
        <div className="px-6 pb-6 relative flex flex-col items-center sm:items-start text-center sm:text-left">
          {/* Overlapping Avatar */}
          <div className="relative -mt-20 sm:-mt-24 mb-4 sm:mb-0 shrink-0">
            <div className="w-36 h-36 rounded-full ring-4 ring-white overflow-hidden shadow-md bg-white border border-gray-100">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            {isMe && (
              <button
                onClick={() => setIsEditing(true)}
                className="absolute bottom-1 right-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 shadow-md hover:scale-105 transition-all"
              >
                <Camera className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Profile text details */}
          <div className="sm:pl-4 sm:pt-4 flex-1 w-full flex flex-col sm:flex-row items-center sm:items-start justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-extrabold text-gray-950 flex items-center justify-center sm:justify-start space-x-2">
                <span>{profile.name}</span>
                {(!isMe && (profile.id === 'prof_1' || profile.id === 'prof_2' || profile.id === 'prof_3')) && (
                  <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.5 rounded-full select-none flex items-center space-x-0.5">
                    <Check className="w-3 h-3" />
                    <span>VERIFIED</span>
                  </span>
                )}
              </h1>
              <p className="text-xs text-gray-400 font-medium">@{profile.username}</p>
              <p className="text-sm text-gray-700 font-semibold">{profile.occupation}</p>
              <p className="text-xs text-gray-500 flex items-center justify-center sm:justify-start space-x-1">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                <span>{profile.city}</span>
              </p>
              {profile.bio && (
                <p className="text-xs text-gray-600 max-w-md pt-2 italic leading-relaxed">
                  "{profile.bio}"
                </p>
              )}
            </div>

            {/* Dynamic Friendship / Management Action Buttons */}
            <div className="mt-6 sm:mt-0 flex items-center space-x-2.5">
              {isMe ? (
                <button
                  id="profile-edit-trigger-btn"
                  onClick={() => setIsEditing(true)}
                  className="px-5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-full transition-all flex items-center space-x-2 border border-blue-100"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Profile Template</span>
                </button>
              ) : (
                <>
                  {profile.isFriend ? (
                    <>
                      <button
                        onClick={() => unfriend(profile.id)}
                        className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-full transition-colors flex items-center space-x-1.5"
                      >
                        <UserMinus className="w-3.5 h-3.5" />
                        <span>Connected</span>
                      </button>
                      <button
                        onClick={() => navigate('messenger', profile.id)}
                        className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-full transition-colors flex items-center space-x-1.5 shadow-sm"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Message</span>
                      </button>
                    </>
                  ) : profile.isPendingReceived ? (
                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => acceptFriendRequest(profile.id)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-full transition-colors"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => rejectFriendRequest(profile.id)}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold rounded-full transition-colors"
                      >
                        Ignore
                      </button>
                    </div>
                  ) : profile.isPendingSent ? (
                    <button
                      className="px-4 py-2.5 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold rounded-full transition-colors cursor-not-allowed"
                      disabled
                    >
                      Request Pending
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => sendFriendRequest(profile.id)}
                        className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-full transition-colors flex items-center space-x-1.5 shadow-sm"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Connect Friend</span>
                      </button>
                      <button
                        onClick={() => navigate('messenger', profile.id)}
                        className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-full transition-colors"
                      >
                        Message
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* TABS SELECTOR */}
        <div className="flex border-t border-gray-100 bg-gray-50/50 px-4">
          <button
            onClick={() => setActiveTab('posts')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-all relative ${
              activeTab === 'posts' 
                ? 'text-blue-600 border-blue-600' 
                : 'text-gray-500 border-transparent hover:text-gray-800'
            }`}
          >
            Posts ({profilePosts.length})
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-all relative ${
              activeTab === 'about' 
                ? 'text-blue-600 border-blue-600' 
                : 'text-gray-500 border-transparent hover:text-gray-800'
            }`}
          >
            About & Bio
          </button>
          <button
            onClick={() => setActiveTab('friends')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-all relative ${
              activeTab === 'friends' 
                ? 'text-blue-600 border-blue-600' 
                : 'text-gray-500 border-transparent hover:text-gray-800'
            }`}
          >
            Connections
          </button>
          <button
            onClick={() => setActiveTab('photos')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-all relative ${
              activeTab === 'photos' 
                ? 'text-blue-600 border-blue-600' 
                : 'text-gray-500 border-transparent hover:text-gray-800'
            }`}
          >
            Photos ({profilePhotos.length})
          </button>
        </div>
      </div>

      {/* DYNAMIC TAB BODY */}
      <div className="space-y-4">
        {activeTab === 'posts' && (
          <div className="space-y-5">
            {profilePosts.length > 0 ? (
              profilePosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))
            ) : (
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-12 text-center text-gray-500">
                <p className="text-sm font-semibold">No posts published yet</p>
                <p className="text-xs text-gray-400 mt-1">Updates shared by this profile will appear here.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'about' && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-widest text-gray-400 mb-3">Professional Overview</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                  <Briefcase className="w-5 h-5 text-blue-600 shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-400 font-mono">OCCUPATION</p>
                    <p className="text-xs font-bold text-gray-800">{profile.occupation}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                  <MapPin className="w-5 h-5 text-blue-600 shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-400 font-mono">LOCATION</p>
                    <p className="text-xs font-bold text-gray-800">{profile.city}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-5">
              <h3 className="text-sm font-extrabold uppercase tracking-widest text-gray-400 mb-3">Personal & Social Status</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                  <Heart className="w-5 h-5 text-pink-600 shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-400 font-mono">RELATIONSHIP STATUS</p>
                    <p className="text-xs font-bold text-gray-800">{profile.relationship}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                  <Users className="w-5 h-5 text-teal-600 shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-400 font-mono">COMMUNITY FOLLOWERS</p>
                    <p className="text-xs font-bold text-gray-800">{profile.followersCount} Followers</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-5 space-y-3">
              <h3 className="text-sm font-extrabold uppercase tracking-widest text-gray-400">Biography</h3>
              <p className="text-sm text-gray-700 leading-relaxed bg-blue-50/40 p-4 rounded-xl border border-blue-50/80">
                {profile.bio || "No custom biography provided yet. This is a consistent MyFaceBook social profile container."}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'friends' && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-sm font-extrabold text-gray-900">Friends & Connections</h3>
                <p className="text-xs text-gray-400">A consistent template displaying standard connected users</p>
              </div>
            </div>

            {isMe ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {friendsList.length > 0 ? (
                  friendsList.map((friend) => (
                    <div
                      key={friend.id}
                      onClick={() => navigate('profile', friend.id)}
                      className="p-3 border border-gray-100 rounded-xl hover:bg-gray-50 cursor-pointer flex items-center space-x-2.5 transition-colors"
                    >
                      <img
                        src={friend.avatar}
                        alt={friend.name}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-900 truncate hover:underline">{friend.name}</p>
                        <p className="text-[10px] text-gray-400 truncate">{friend.occupation}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 py-4 text-center col-span-full">No connected friends yet. Visit other profiles to add them!</p>
                )}
              </div>
            ) : (
              <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-500">
                <Info className="w-8 h-8 text-gray-400 mx-auto" />
                <p className="text-xs font-bold mt-2">Privacy Shield Active</p>
                <p className="text-[11px] text-gray-400 mt-0.5">This profile template only lists connections for authorized account requests.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'photos' && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-extrabold text-gray-900 mb-4">Shared Photo Gallery</h3>
            {profilePhotos.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {profilePhotos.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => navigate('home')}
                    className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 cursor-pointer group"
                  >
                    <img
                      src={post.imageUrl}
                      alt="Timeline Photo"
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-350"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">View Post</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 text-center py-8">No photos have been uploaded by this user yet.</p>
            )}
          </div>
        )}
      </div>

      {/* INLINE EDIT PROFILE DIALOG */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden text-gray-800"
            >
              <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="font-extrabold text-sm uppercase tracking-wider text-gray-500">Edit My Profile Template</h3>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="p-1 rounded-full hover:bg-gray-200 text-gray-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="p-6 space-y-4 max-h-120 overflow-y-auto">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">My Display Name</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Biography / Slogan</label>
                  <textarea
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all min-h-16 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Occupation</label>
                    <input
                      type="text"
                      value={editOcc}
                      onChange={(e) => setEditOcc(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs outline-none focus:bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">City & State</label>
                    <input
                      type="text"
                      value={editCity}
                      onChange={(e) => setEditCity(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs outline-none focus:bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Relationship Status</label>
                  <select
                    value={editRel}
                    onChange={(e) => setEditRel(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs focus:bg-white outline-none"
                  >
                    <option value="Single">Single</option>
                    <option value="In a relationship">In a relationship</option>
                    <option value="Married">Married</option>
                    <option value="Engaged">Engaged</option>
                    <option value="It's complicated">It's complicated</option>
                  </select>
                </div>

                {/* Cover Photo Preset Grid */}
                <div className="space-y-2 border-t border-gray-100 pt-3">
                  <label className="text-xs font-bold text-gray-500 uppercase block">Choose Preset Cover Photo</label>
                  <div className="grid grid-cols-4 gap-2">
                    {coverPresets.map((img, i) => (
                      <div
                        key={i}
                        onClick={() => setEditCover(img)}
                        className={`relative aspect-video rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                          editCover === img ? 'border-blue-600 scale-95 shadow-sm' : 'border-transparent'
                        }`}
                      >
                        <img src={img} alt="Cover option" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Avatar Preset Grid */}
                <div className="space-y-2 border-t border-gray-100 pt-3">
                  <label className="text-xs font-bold text-gray-500 uppercase block">Choose Preset Profile Face</label>
                  <div className="grid grid-cols-4 gap-2">
                    {avatarPresets.map((img, i) => (
                      <div
                        key={i}
                        onClick={() => setEditAvatar(img)}
                        className={`relative aspect-square rounded-full overflow-hidden cursor-pointer border-2 transition-all ${
                          editAvatar === img ? 'border-blue-600 scale-95 shadow-sm' : 'border-transparent'
                        }`}
                      >
                        <img src={img} alt="Avatar option" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-200 rounded-full text-xs font-bold text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-bold shadow-sm"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
