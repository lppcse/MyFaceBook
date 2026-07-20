import React, { useState } from 'react';
import { useSocial } from '../context/SocialContext';
import { PostCard } from './PostCard';
import { 
  Image, Video, Smile, BookOpen, MessageSquare, Send, 
  Sparkles, CheckCircle, Radio, Clock, Heart, Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Feed: React.FC = () => {
  const { currentUser, posts, createPost, profiles, navigate } = useSocial();
  const [postContent, setPostContent] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [showPhotoGallery, setShowPhotoGallery] = useState(false);
  const [feedFilter, setFeedFilter] = useState<'all' | 'friends' | 'user'>('all');

  // Mini-Gallery of lovely stock options to attach to posts!
  const stockOptions = [
    { name: 'Beach Sunset', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=450&fit=crop&auto=format' },
    { name: 'Desk Workspace', url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=450&fit=crop&auto=format' },
    { name: 'Nature Wilderness', url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&h=450&fit=crop&auto=format' },
    { name: 'Cozy Coffee', url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&h=450&fit=crop&auto=format' },
    { name: 'City Skyscrapers', url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=450&fit=crop&auto=format' },
    { name: 'Fresh Baking', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=450&fit=crop&auto=format' },
  ];

  // Story tray mock entries (using active core profiles)
  const stories = [
    {
      id: 'story_me',
      name: 'Create Story',
      avatar: currentUser.avatar,
      bg: currentUser.coverPhoto,
      isMe: true
    },
    {
      id: 'story_1',
      name: 'Sarah Connor',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&auto=format',
      bg: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=200&h=300&fit=crop&auto=format',
    },
    {
      id: 'story_2',
      name: 'Marcus Aurelius',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format',
      bg: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=200&h=300&fit=crop&auto=format',
    },
    {
      id: 'story_3',
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&auto=format',
      bg: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&h=300&fit=crop&auto=format',
    },
    {
      id: 'story_4',
      name: 'James Cooper',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&auto=format',
      bg: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&h=300&fit=crop&auto=format',
    }
  ];

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim() && !selectedPhoto) return;
    createPost(postContent, selectedPhoto || undefined);
    setPostContent('');
    setSelectedPhoto(null);
    setShowPhotoGallery(false);
  };

  const handleSelectPhoto = (url: string) => {
    setSelectedPhoto(url === selectedPhoto ? null : url);
  };

  // Filter logic
  const filteredPosts = posts.filter((post) => {
    if (feedFilter === 'user') return post.authorId === currentUser.id;
    if (feedFilter === 'friends') {
      // Find out if author is friend
      const profile = profiles.find((p) => p.id === post.authorId);
      return profile?.isFriend || post.authorId === currentUser.id;
    }
    return true; // all
  });

  return (
    <div id="feed-container" className="flex-1 py-4 space-y-6 max-w-full">
      {/* 1. STORIES TRAY */}
      <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-none snap-x select-none">
        {stories.map((story, idx) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => {
              if (story.id === 'story_me') {
                setShowPhotoGallery(true);
              } else {
                // Visit story profile
                const p = profiles.find(x => x.name === story.name);
                if (p) navigate('profile', p.id);
              }
            }}
            className="relative w-28 h-44 rounded-2xl overflow-hidden shadow-sm shrink-0 border border-gray-100 cursor-pointer snap-start group"
          >
            {/* Background image template */}
            <img
              src={story.bg}
              alt="Story Background"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-350"
              referrerPolicy="no-referrer"
            />
            {/* Dark gradient mask */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent" />

            {/* Avatar or Plus Button */}
            {story.isMe ? (
              <div className="absolute bottom-2 left-2 right-2 flex flex-col items-center">
                <div className="w-9 h-9 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center -mt-6 shadow-md shadow-blue-100 z-10">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <span className="text-[10px] font-bold text-white mt-1 text-center truncate w-full">Create Story</span>
              </div>
            ) : (
              <>
                <div className="absolute top-2.5 left-2.5 w-9 h-9 rounded-full ring-3 ring-blue-500 overflow-hidden border border-white">
                  <img src={story.avatar} alt={story.name} className="w-full h-full object-cover" />
                </div>
                <span className="absolute bottom-2.5 left-2.5 text-[10px] font-bold text-white truncate w-[85%]">
                  {story.name}
                </span>
              </>
            )}
          </motion.div>
        ))}
      </div>

      {/* 2. CREATE POST BOX */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 space-y-4">
        <div className="flex items-start space-x-3">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-10.5 h-10.5 rounded-full object-cover border border-gray-100 cursor-pointer"
            onClick={() => navigate('profile', currentUser.id)}
            referrerPolicy="no-referrer"
          />
          <div className="flex-1">
            <textarea
              id="create-post-textarea"
              placeholder={`What's on your mind, ${currentUser.name.split(' ')[0]}?`}
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm text-gray-800 outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 min-h-20 max-h-40 transition-all resize-none"
            />
          </div>
        </div>

        {/* Selected Image Attachment Preview */}
        <AnimatePresence>
          {selectedPhoto && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative rounded-xl overflow-hidden border border-gray-200 max-h-52 bg-gray-50"
            >
              <img src={selectedPhoto} alt="Post Attachment" className="w-full h-full object-cover max-h-48" />
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-2 right-2 bg-gray-900/75 hover:bg-gray-900 text-white rounded-full p-1.5 transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4 rotate-45" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Photo Attachment Selector Drawer */}
        <AnimatePresence>
          {showPhotoGallery && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-gray-50 border border-gray-100 rounded-xl p-3 space-y-2 overflow-hidden"
            >
              <div className="flex justify-between items-center px-1">
                <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Select a High-Res Photo Template</span>
                <button 
                  onClick={() => setShowPhotoGallery(false)}
                  className="text-gray-400 hover:text-gray-600 text-xs font-semibold"
                >
                  Cancel
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {stockOptions.map((opt) => (
                  <div
                    key={opt.name}
                    onClick={() => handleSelectPhoto(opt.url)}
                    className={`relative aspect-video rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                      selectedPhoto === opt.url ? 'border-blue-500 scale-98 shadow-sm' : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img src={opt.url} alt={opt.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/10 hover:bg-transparent" />
                    <span className="absolute bottom-1.5 left-1.5 text-[9px] font-bold text-white bg-black/60 px-1 rounded">
                      {opt.name}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Share actions bar */}
        <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
          <div className="flex space-x-1">
            <button
              onClick={() => setShowPhotoGallery(!showPhotoGallery)}
              className="flex items-center space-x-2 py-1.5 px-3 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50 hover:text-green-600 transition-all"
            >
              <Image className="w-4 h-4 text-green-500" />
              <span>Photo</span>
            </button>
            <button
              onClick={() => {
                // Auto attach random photo
                const randomOpt = stockOptions[Math.floor(Math.random() * stockOptions.length)];
                setSelectedPhoto(randomOpt.url);
              }}
              className="flex items-center space-x-2 py-1.5 px-3 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50 hover:text-red-500 transition-all"
            >
              <Video className="w-4 h-4 text-red-500" />
              <span>Video</span>
            </button>
            <button className="hidden sm:flex items-center space-x-2 py-1.5 px-3 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50 hover:text-amber-500 transition-all">
              <Smile className="w-4 h-4 text-amber-500" />
              <span>Feeling</span>
            </button>
          </div>

          <button
            id="publish-post-btn"
            onClick={handlePostSubmit}
            disabled={!postContent.trim() && !selectedPhoto}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm flex items-center space-x-2 ${
              postContent.trim() || selectedPhoto
                ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-98 shadow-blue-100'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <span>Publish Post</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. FEED FILTER / PREFERENCES TAB BAR */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-1.5">
        <div className="flex space-x-2">
          <button
            onClick={() => setFeedFilter('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              feedFilter === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            All Updates
          </button>
          <button
            onClick={() => setFeedFilter('friends')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              feedFilter === 'friends'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            Connections Only
          </button>
          <button
            onClick={() => setFeedFilter('user')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              feedFilter === 'user'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            My Activity
          </button>
        </div>

        <span className="hidden sm:inline text-[10px] font-mono text-gray-400 font-semibold">
          Displaying {filteredPosts.length} posts
        </span>
      </div>

      {/* 4. POSTS TIMELINE LIST */}
      <div className="space-y-5">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 text-center">
            <Radio className="w-10 h-10 text-gray-300 mx-auto animate-pulse" />
            <h3 className="text-sm font-bold text-gray-900 mt-3">Nothing to display</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              No recent updates matching this filter preference. Try switching to 'All Updates' or write your own post above!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
