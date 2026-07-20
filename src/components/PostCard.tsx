import React, { useState } from 'react';
import { Post } from '../types';
import { useSocial } from '../context/SocialContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, MessageCircle, Share2, MoreHorizontal, Send, 
  Trash2, ShieldAlert, CheckCircle, Smile
} from 'lucide-react';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { currentUser, likePost, addComment, navigate } = useSocial();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isShareAlertOpen, setIsShareAlertOpen] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    likePost(post.id);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(post.id, commentText);
    setCommentText('');
    setShowComments(true);
  };

  const handleShareClick = () => {
    setIsShareAlertOpen(true);
    setTimeout(() => {
      setIsShareAlertOpen(false);
    }, 2500);
  };

  const handleAuthorClick = () => {
    navigate('profile', post.authorId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden"
    >
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src={post.authorAvatar}
            alt={post.authorName}
            onClick={handleAuthorClick}
            className="w-10.5 h-10.5 rounded-full object-cover border border-gray-100 cursor-pointer hover:opacity-90 transition-opacity"
            referrerPolicy="no-referrer"
          />
          <div>
            <h4 
              onClick={handleAuthorClick}
              className="text-sm font-bold text-gray-950 cursor-pointer hover:underline flex items-center space-x-1.5"
            >
              <span>{post.authorName}</span>
              {/* Add blue checkmark to core profiles to look like verified accounts */}
              {(post.authorId === 'prof_1' || post.authorId === 'prof_2' || post.authorId === 'prof_3') && (
                <CheckCircle className="w-3.5 h-3.5 text-blue-500 fill-blue-50" />
              )}
            </h4>
            <div className="flex items-center space-x-1.5 mt-0.5">
              <span className="text-xs text-gray-400 font-mono">{post.createdAt}</span>
              <span className="text-gray-300 text-[10px]">•</span>
              <span className="text-xs text-gray-400 flex items-center">🌍 Public</span>
            </div>
          </div>
        </div>

        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Post Text Content */}
      <div className="px-4 pb-3">
        <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{post.content}</p>
      </div>

      {/* Post Attached Photo */}
      {post.imageUrl && (
        <div className="w-full bg-gray-50 border-y border-gray-100 max-h-120 overflow-hidden flex items-center justify-center">
          <img
            src={post.imageUrl}
            alt="Attached Content"
            className="w-full h-full object-cover max-h-110 select-none hover:scale-101 transition-transform duration-350"
            referrerPolicy="no-referrer"
          />
        </div>
      )}

      {/* Stats Counter Bar */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-1">
          <span className="flex items-center justify-center w-5 h-5 bg-blue-600 rounded-full text-white ring-2 ring-white">
            <Heart className="w-3 h-3 fill-white text-white" />
          </span>
          <span className="font-semibold text-gray-700">{post.likesCount} {post.likesCount === 1 ? 'like' : 'likes'}</span>
        </div>

        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setShowComments(!showComments)}
            className="hover:underline font-medium hover:text-blue-600"
          >
            {post.commentsCount} {post.commentsCount === 1 ? 'comment' : 'comments'}
          </button>
          <span>Share</span>
        </div>
      </div>

      {/* Action Buttons Bar */}
      <div className="px-2 py-1 flex items-center justify-around border-b border-gray-100 bg-gray-50/50">
        <button
          onClick={handleLike}
          className={`flex items-center justify-center space-x-2 py-2 px-4 rounded-xl text-xs font-semibold transition-all ${
            post.hasLiked 
              ? 'text-red-500 bg-red-50 hover:bg-red-100' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Heart className={`w-4 h-4 ${post.hasLiked ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
          <span>{post.hasLiked ? 'Liked' : 'Like'}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className={`flex items-center justify-center space-x-2 py-2 px-4 rounded-xl text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors ${
            showComments ? 'bg-blue-50 text-blue-600' : ''
          }`}
        >
          <MessageCircle className="w-4 h-4 text-gray-500" />
          <span>Comment</span>
        </button>

        <button
          onClick={handleShareClick}
          className="flex items-center justify-center space-x-2 py-2 px-4 rounded-xl text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        >
          <Share2 className="w-4 h-4 text-gray-500" />
          <span>Share</span>
        </button>
      </div>

      {/* Share Toast Banner */}
      <AnimatePresence>
        {isShareAlertOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-blue-600 text-white text-xs font-semibold text-center py-2 flex items-center justify-center space-x-1.5"
          >
            <span>🔗 Link copied to clipboard! Share on external squares.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comments Section Drawer */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-gray-50 overflow-hidden"
          >
            {/* Comment list */}
            <div className="p-4 space-y-3 border-b border-gray-100 max-h-80 overflow-y-auto">
              {post.comments.length > 0 ? (
                post.comments.map((comment) => (
                  <div key={comment.id} className="flex items-start space-x-2.5">
                    <img
                      src={comment.authorAvatar}
                      alt={comment.authorName}
                      onClick={() => navigate('profile', comment.authorId)}
                      className="w-8 h-8 rounded-full object-cover border border-gray-100 cursor-pointer hover:opacity-90 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1">
                      <div className="bg-white border border-gray-200 rounded-2xl p-3 shadow-2xs max-w-full">
                        <p 
                          onClick={() => navigate('profile', comment.authorId)}
                          className="text-xs font-bold text-gray-950 cursor-pointer hover:underline"
                        >
                          {comment.authorName}
                        </p>
                        <p className="text-xs text-gray-700 mt-1">{comment.content}</p>
                      </div>
                      <p className="text-[10px] text-gray-400 font-mono mt-1 ml-2">{comment.createdAt}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400 text-center py-2">No comments yet. Start the conversation!</p>
              )}
            </div>

            {/* Write comment input bar */}
            <form onSubmit={handleCommentSubmit} className="p-3 bg-white flex items-center space-x-2 border-t border-gray-100">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8.5 h-8.5 rounded-full object-cover border border-gray-200"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 flex items-center bg-gray-100 rounded-full px-3 py-1.5 border border-transparent focus-within:border-blue-400 focus-within:bg-white transition-all">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="bg-transparent border-none outline-none text-xs text-gray-800 w-full placeholder-gray-400"
                />
                <button type="button" className="text-gray-400 hover:text-gray-600 px-1.5">
                  <Smile className="w-4 h-4" />
                </button>
              </div>
              <button
                type="submit"
                disabled={!commentText.trim()}
                className={`p-2 rounded-full flex items-center justify-center transition-colors ${
                  commentText.trim()
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
