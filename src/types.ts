export interface Profile {
  id: string;
  name: string;
  username: string;
  avatar: string;
  coverPhoto: string;
  bio: string;
  occupation: string;
  city: string;
  country: string;
  relationship: string;
  followersCount: number;
  followingCount: number;
  isFriend: boolean;
  isPendingReceived: boolean; // True if they sent us a request
  isPendingSent: boolean;     // True if we sent them a request
  isOnline: boolean;
  lastActive?: string;
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  hasLiked: boolean;
  comments: Comment[];
  isPinned?: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  isRead: boolean;
}

export interface Notification {
  id: string;
  type: 'friend_request' | 'friend_accept' | 'post_like' | 'post_comment' | 'message';
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  linkId?: string; // e.g., post ID or message room
}
