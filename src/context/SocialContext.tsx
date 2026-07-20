import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Profile, Post, Comment, Message, Notification } from '../types';
import {
  generateProfiles,
  generateInitialPosts,
  generateInitialMessages,
  generateInitialNotifications,
} from '../data/mockProfiles';
import { soundEffects } from '../lib/sounds';

interface SocialContextType {
  currentUser: Profile;
  profiles: Profile[];
  posts: Post[];
  messages: Message[];
  notifications: Notification[];
  currentView: 'home' | 'profile' | 'messenger' | 'friends' | 'notifications';
  activeProfileId: string | null; // For rendering profile template
  activeChatUserId: string | null; // For messenger active window
  activeNotification: Notification | null; // For sliding "push notifications" toast
  searchQuery: string;
  isSimulating: boolean;
  setSearchQuery: (query: string) => void;
  setSimulationMode: (enabled: boolean) => void;
  navigate: (view: 'home' | 'profile' | 'messenger' | 'friends' | 'notifications', id?: string | null) => void;
  createPost: (content: string, imageUrl?: string) => void;
  likePost: (postId: string) => void;
  addComment: (postId: string, content: string) => void;
  sendFriendRequest: (profileId: string) => void;
  acceptFriendRequest: (profileId: string) => void;
  rejectFriendRequest: (profileId: string) => void;
  unfriend: (profileId: string) => void;
  sendMessage: (receiverId: string, content: string) => void;
  markChatAsRead: (userId: string) => void;
  clearNotification: () => void;
  markNotificationsAsRead: () => void;
  updateMyProfile: (name: string, bio: string, occupation: string, city: string, relationship: string, avatar: string, coverPhoto: string) => void;
  triggerMockFriendRequest: () => void;
  triggerMockMessage: () => void;
  triggerMockLikeOrComment: () => void;
  isTyping: boolean; // Message reply typing simulation indicator
}

const SocialContext = createContext<SocialContextType | undefined>(undefined);

export const SocialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & UI state
  const [currentView, setCurrentView] = useState<'home' | 'profile' | 'messenger' | 'friends' | 'notifications'>('home');
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [activeChatUserId, setActiveChatUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNotification, setActiveNotification] = useState<Notification | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isSimulating, setIsSimulating] = useState(true);

  // Core Data State
  const [currentUser, setCurrentUser] = useState<Profile>(() => {
    const saved = localStorage.getItem('myfacebook_current_user');
    if (saved) return JSON.parse(saved);
    return {
      id: 'user_me',
      name: 'Alex Morgan',
      username: 'alex_morgan',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces&auto=format',
      coverPhoto: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=300&fit=crop&auto=format',
      bio: 'Full Stack Developer & Tech Enthusiast 📸✨. Coding the future, one elegant block at a time.',
      occupation: 'Lead Web Creator',
      city: 'San Francisco, CA',
      country: 'USA',
      relationship: 'Single',
      followersCount: 842,
      followingCount: 310,
      isFriend: false,
      isPendingReceived: false,
      isPendingSent: false,
      isOnline: true,
    };
  });

  const [profiles, setProfiles] = useState<Profile[]>(() => {
    const saved = localStorage.getItem('myfacebook_profiles');
    if (saved) return JSON.parse(saved);
    return generateProfiles();
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('myfacebook_posts');
    if (saved) return JSON.parse(saved);
    return generateInitialPosts(generateProfiles());
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('myfacebook_messages');
    if (saved) return JSON.parse(saved);
    return generateInitialMessages();
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('myfacebook_notifications');
    if (saved) return JSON.parse(saved);
    return generateInitialNotifications();
  });

  // Save to localStorage on state changes
  useEffect(() => {
    localStorage.setItem('myfacebook_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('myfacebook_profiles', JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem('myfacebook_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('myfacebook_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('myfacebook_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Unified navigation helper
  const navigate = (view: 'home' | 'profile' | 'messenger' | 'friends' | 'notifications', id?: string | null) => {
    setCurrentView(view);
    if (view === 'profile' && id) {
      setActiveProfileId(id);
    } else if (view === 'messenger' && id) {
      setActiveChatUserId(id);
      markChatAsRead(id);
    }
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Create post
  const createPost = (content: string, imageUrl?: string) => {
    const newPost: Post = {
      id: `user_post_${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      content,
      imageUrl,
      createdAt: 'Just now',
      likesCount: 0,
      commentsCount: 0,
      hasLiked: false,
      isPinned: false,
      comments: [],
    };

    setPosts((prev) => [newPost, ...prev]);
    soundEffects.playPop();
  };

  // Like / Unlike post
  const likePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const hasLiked = !post.hasLiked;
          if (hasLiked) {
            soundEffects.playLike();
          }
          return {
            ...post,
            hasLiked,
            likesCount: hasLiked ? post.likesCount + 1 : post.likesCount - 1,
          };
        }
        return post;
      })
    );
  };

  // Add Comment to post
  const addComment = (postId: string, content: string) => {
    if (!content.trim()) return;

    const newComment: Comment = {
      id: `comment_${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      content,
      createdAt: 'Just now',
    };

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            commentsCount: post.commentsCount + 1,
            comments: [...post.comments, newComment],
          };
        }
        return post;
      })
    );
    soundEffects.playPop();
  };

  // Send friend request
  const sendFriendRequest = (profileId: string) => {
    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id === profileId) {
          return { ...p, isPendingSent: true };
        }
        return p;
      })
    );
    soundEffects.playPop();
  };

  // Accept friend request
  const acceptFriendRequest = (profileId: string) => {
    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id === profileId) {
          return { ...p, isFriend: true, isPendingReceived: false, isPendingSent: false };
        }
        return p;
      })
    );

    // Filter out friend request notification
    setNotifications((prev) =>
      prev.map((notif) => {
        if (notif.type === 'friend_request' && notif.senderId === profileId) {
          return { ...notif, isRead: true };
        }
        return notif;
      })
    );

    // Create a notification for friend acceptance
    const sender = profiles.find((p) => p.id === profileId);
    if (sender) {
      const newNotif: Notification = {
        id: `notif_accept_${Date.now()}`,
        type: 'friend_accept',
        senderId: sender.id,
        senderName: sender.name,
        senderAvatar: sender.avatar,
        content: `is now connected with you! Start a conversation.`,
        isRead: false,
        createdAt: 'Just now',
        linkId: sender.id,
      };
      setNotifications((prev) => [newNotif, ...prev]);
      showPushNotification(newNotif);
    }
  };

  // Decline/Reject friend request
  const rejectFriendRequest = (profileId: string) => {
    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id === profileId) {
          return { ...p, isPendingReceived: false, isPendingSent: false };
        }
        return p;
      })
    );

    setNotifications((prev) =>
      prev.map((notif) => {
        if (notif.type === 'friend_request' && notif.senderId === profileId) {
          return { ...notif, isRead: true };
        }
        return notif;
      })
    );
  };

  // Unfriend
  const unfriend = (profileId: string) => {
    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id === profileId) {
          return { ...p, isFriend: false, isPendingReceived: false, isPendingSent: false };
        }
        return p;
      })
    );
  };

  // Send message
  const sendMessage = (receiverId: string, content: string) => {
    if (!content.trim()) return;

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      receiverId,
      content,
      createdAt: new Date().toISOString(),
      isRead: true, // we read our own
    };

    setMessages((prev) => [...prev, newMessage]);
    soundEffects.playMessageSent();

    // Trigger an automated chat reply helper
    triggerSimulatedChatReply(receiverId, content);
  };

  // Mark all messages as read with a specific user
  const markChatAsRead = (userId: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.senderId === userId && msg.receiverId === currentUser.id) {
          return { ...msg, isRead: true };
        }
        return msg;
      })
    );
  };

  // Clear toast notification
  const clearNotification = () => {
    setActiveNotification(null);
  };

  // Mark all general notifications as read
  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })));
  };

  // Update profile configuration
  const updateMyProfile = (
    name: string,
    bio: string,
    occupation: string,
    city: string,
    relationship: string,
    avatar: string,
    coverPhoto: string
  ) => {
    setCurrentUser((prev) => ({
      ...prev,
      name,
      bio,
      occupation,
      city,
      avatar: avatar || prev.avatar,
      coverPhoto: coverPhoto || prev.coverPhoto,
      relationship,
    }));
    soundEffects.playChime();
  };

  // Helper to show custom simulated Push Notification
  const showPushNotification = (notif: Notification) => {
    setActiveNotification(notif);
    soundEffects.playChime();
    
    // Play vibration effect if supported
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]);
    }

    // Auto-dismiss after 6 seconds
    setTimeout(() => {
      setActiveNotification((current) => (current?.id === notif.id ? null : current));
    }, 6000);
  };

  // Simulated Chat Reply generator (A simple AI/canned simulator to make chats feel live)
  const triggerSimulatedChatReply = (friendId: string, userMessage: string) => {
    const friend = profiles.find((p) => p.id === friendId);
    if (!friend) return;

    setIsTyping(true);

    // Custom deterministic smart responses based on user content
    const msgLower = userMessage.toLowerCase();
    let responseText = `Hi there! Hope you are doing great. I'm currently working, but let's connect properly later!`;

    if (msgLower.includes('hello') || msgLower.includes('hey') || msgLower.includes('hi')) {
      responseText = `Hey Alex! Great to hear from you. How's everything going in San Francisco? 😊`;
    } else if (msgLower.includes('project') || msgLower.includes('code') || msgLower.includes('dev')) {
      responseText = `Wow, that sounds fascinating! I always love hearing about your tech creations. Let's do a screen share sometime! 💻✨`;
    } else if (msgLower.includes('dinner') || msgLower.includes('food') || msgLower.includes('coffee')) {
      responseText = `Oh count me in! ☕️ I would absolutely love to grab a bite or chat over coffee soon. Let me check my calendar.`;
    } else if (msgLower.includes('help') || msgLower.includes('issue') || msgLower.includes('question')) {
      responseText = `I'm happy to help out! Tell me a bit more about what you need or what's on your mind.`;
    } else if (msgLower.includes('stoic') || msgLower.includes('philosophy') || msgLower.includes('life')) {
      responseText = `As we contemplate daily, keep your focus purely on what resides in your control. True peace is found inside! 🏛️🧘‍♂️`;
    }

    // Simulate typing delay (2 - 3.5 seconds)
    const delay = 1500 + Math.random() * 2000;
    setTimeout(() => {
      const newReply: Message = {
        id: `msg_reply_${Date.now()}`,
        senderId: friendId,
        receiverId: currentUser.id,
        content: responseText,
        createdAt: new Date().toISOString(),
        isRead: activeChatUserId === friendId, // Read if actively chatting
      };

      setMessages((prev) => [...prev, newReply]);
      setIsTyping(false);
      soundEffects.playPop();

      // If we are not currently looking at their chat window, send a push notification!
      if (activeChatUserId !== friendId) {
        const chatNotif: Notification = {
          id: `notif_msg_${Date.now()}`,
          type: 'message',
          senderId: friendId,
          senderName: friend.name,
          senderAvatar: friend.avatar,
          content: `sent you a private message: "${responseText.substring(0, 45)}${responseText.length > 45 ? '...' : ''}"`,
          isRead: false,
          createdAt: 'Just now',
          linkId: friendId,
        };
        setNotifications((prev) => [chatNotif, ...prev]);
        showPushNotification(chatNotif);
      }
    }, delay);
  };

  // --- Real-time Simulator Triggers for Sandbox / Dynamic Feeds ---

  // 1. Simulate a Friend Request from a random profile (push notification trigger)
  const triggerMockFriendRequest = () => {
    // Find a profile that isn't currently a friend and has no pending requests
    const candidates = profiles.filter((p) => !p.isFriend && !p.isPendingReceived && !p.isPendingSent && p.id !== currentUser.id);
    if (candidates.length === 0) return;

    const randomIndex = Math.floor(Math.random() * candidates.length);
    const chosen = candidates[randomIndex];

    // Update profile status
    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id === chosen.id) {
          return { ...p, isPendingReceived: true };
        }
        return p;
      })
    );

    // Create Friend Request notification
    const newNotif: Notification = {
      id: `notif_req_${Date.now()}`,
      type: 'friend_request',
      senderId: chosen.id,
      senderName: chosen.name,
      senderAvatar: chosen.avatar,
      content: 'sent you a friend request.',
      isRead: false,
      createdAt: 'Just now',
      linkId: chosen.id,
    };

    setNotifications((prev) => [newNotif, ...prev]);
    showPushNotification(newNotif);
  };

  // 2. Simulate a friend sending an unsolicited chat message
  const triggerMockMessage = () => {
    // Find online friends
    const friends = profiles.filter((p) => p.isFriend && p.isOnline);
    if (friends.length === 0) return;

    const chosen = friends[Math.floor(Math.random() * friends.length)];

    const seedCannedMsgs = [
      "Hey! Saw your latest post, looked absolutely amazing! How's everything?",
      "Are you free for a quick chat today? Wanted to ask you something about your project.",
      "Just found an awesome new coffee spot downtown, we should definitely go this weekend! ☕️",
      "Hope you are having a productive week! Keep killing it! 💪🚀",
      "Check this out! I was thinking we should collaborate on a design challenge."
    ];

    const randomMsg = seedCannedMsgs[Math.floor(Math.random() * seedCannedMsgs.length)];

    const newMessage: Message = {
      id: `msg_mock_${Date.now()}`,
      senderId: chosen.id,
      receiverId: currentUser.id,
      content: randomMsg,
      createdAt: new Date().toISOString(),
      isRead: activeChatUserId === chosen.id,
    };

    setMessages((prev) => [...prev, newMessage]);

    if (activeChatUserId !== chosen.id) {
      const chatNotif: Notification = {
        id: `notif_msg_${Date.now()}`,
        type: 'message',
        senderId: chosen.id,
        senderName: chosen.name,
        senderAvatar: chosen.avatar,
        content: `sent you a private message: "${randomMsg.substring(0, 45)}..."`,
        isRead: false,
        createdAt: 'Just now',
        linkId: chosen.id,
      };
      setNotifications((prev) => [chatNotif, ...prev]);
      showPushNotification(chatNotif);
    } else {
      soundEffects.playPop();
    }
  };

  // 3. Simulate likes or comments on the user's posts
  const triggerMockLikeOrComment = () => {
    // Find user's posts
    const userPosts = posts.filter((p) => p.authorId === currentUser.id);
    if (userPosts.length === 0) return;

    // Select random post
    const post = userPosts[Math.floor(Math.random() * userPosts.length)];
    const decider = Math.random() > 0.4; // 60% chance of like, 40% comment

    // Select random friend
    const friends = profiles.filter((p) => p.isFriend);
    if (friends.length === 0) return;
    const friend = friends[Math.floor(Math.random() * friends.length)];

    if (decider) {
      // LIKE
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id === post.id) {
            return { ...p, likesCount: p.likesCount + 1 };
          }
          return p;
        })
      );

      const likeNotif: Notification = {
        id: `notif_like_${Date.now()}`,
        type: 'post_like',
        senderId: friend.id,
        senderName: friend.name,
        senderAvatar: friend.avatar,
        content: `liked your post "${post.content.substring(0, 30)}${post.content.length > 30 ? '...' : ''}".`,
        isRead: false,
        createdAt: 'Just now',
        linkId: post.id,
      };

      setNotifications((prev) => [likeNotif, ...prev]);
      showPushNotification(likeNotif);
    } else {
      // COMMENT
      const commentTexts = [
        "Incredible stuff! Thanks for sharing this.",
        "Totally agree with this, Alex! Keep it up.",
        "Beautifully put! 👏👏",
        "This is really helpful! Saved for later."
      ];
      const commentContent = commentTexts[Math.floor(Math.random() * commentTexts.length)];

      const newComment: Comment = {
        id: `comment_mock_${Date.now()}`,
        authorId: friend.id,
        authorName: friend.name,
        authorAvatar: friend.avatar,
        content: commentContent,
        createdAt: 'Just now',
      };

      setPosts((prev) =>
        prev.map((p) => {
          if (p.id === post.id) {
            return {
              ...p,
              commentsCount: p.commentsCount + 1,
              comments: [...p.comments, newComment],
            };
          }
          return p;
        })
      );

      const commentNotif: Notification = {
        id: `notif_comment_${Date.now()}`,
        type: 'post_comment',
        senderId: friend.id,
        senderName: friend.name,
        senderAvatar: friend.avatar,
        content: `commented on your post: "${commentContent}"`,
        isRead: false,
        createdAt: 'Just now',
        linkId: post.id,
      };

      setNotifications((prev) => [commentNotif, ...prev]);
      showPushNotification(commentNotif);
    }
  };

  // Automated network simulation loop
  useEffect(() => {
    if (!isSimulating) return;

    // Trigger actions on staggered timing:
    // Friend request every 40-50s, Message every 30-40s, Likes/Comments every 25-35s
    const friendReqTimer = setInterval(() => {
      triggerMockFriendRequest();
    }, 45000);

    const messageTimer = setInterval(() => {
      triggerMockMessage();
    }, 35000);

    const reactionTimer = setInterval(() => {
      triggerMockLikeOrComment();
    }, 28000);

    // Run first simulated events with brief delays so user sees immediate interaction
    const startupTimeout = setTimeout(() => {
      triggerMockMessage();
    }, 12000);

    const startupRequestTimeout = setTimeout(() => {
      triggerMockFriendRequest();
    }, 20000);

    return () => {
      clearInterval(friendReqTimer);
      clearInterval(messageTimer);
      clearInterval(reactionTimer);
      clearTimeout(startupTimeout);
      clearTimeout(startupRequestTimeout);
    };
  }, [isSimulating, profiles, posts]);

  const setSimulationMode = (enabled: boolean) => {
    setIsSimulating(enabled);
  };

  return (
    <SocialContext.Provider
      value={{
        currentUser,
        profiles,
        posts,
        messages,
        notifications,
        currentView,
        activeProfileId,
        activeChatUserId,
        activeNotification,
        searchQuery,
        isSimulating,
        isTyping,
        setSearchQuery,
        setSimulationMode,
        navigate,
        createPost,
        likePost,
        addComment,
        sendFriendRequest,
        acceptFriendRequest,
        rejectFriendRequest,
        unfriend,
        sendMessage,
        markChatAsRead,
        clearNotification,
        markNotificationsAsRead,
        updateMyProfile,
        triggerMockFriendRequest,
        triggerMockMessage,
        triggerMockLikeOrComment,
      }}
    >
      {children}
    </SocialContext.Provider>
  );
};

export const useSocial = () => {
  const context = useContext(SocialContext);
  if (context === undefined) {
    throw new Error('useSocial must be used within a SocialProvider');
  }
  return context;
};
