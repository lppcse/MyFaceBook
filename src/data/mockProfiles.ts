import { Profile, Post, Comment, Message, Notification } from '../types';

// Let's create a list of Unsplash photo IDs for avatars (faces)
const avatarPhotoIds = [
  '1534528741775-53994a69daeb', // female
  '1507003211169-0a1dd7228f2d', // male
  '1494790108377-be9c29b29330', // female
  '1500648767791-00dcc994a43e', // male
  '1438761681033-6461ffad8d80', // female
  '1517841905240-472988babdf9', // female
  '1539571696357-5a69c17a67c6', // male
  '1544005313-94ddf0286df2', // female
  '1506794778202-cad84cf45f1d', // male
  '1524504388940-b1c1722653e1', // female
  '1519085360753-af0119f7cbe7', // male
  '1488426862026-3ee34a7d66df', // female
  '1531427186611-ecfd6d936c79', // male
  '1580489944761-15a19d654956', // female
  '1501196354995-cbb51c65aaea', // male
  '1487412720507-e7ab37603c6f', // female
  '1508214751196-bcfd4ca60f91', // female
  '1531746020798-e6953c6e8e04', // female
  '1573496359142-b8d87734a5a2', // female
  '1560250097-0b93528c311a', // male
];

// Unsplash photo IDs for cover photos
const coverPhotoIds = [
  '1507525428034-b723cf961d3e', // beach
  '1472214222541-d510753a4907', // nature
  '1451187580459-43490279c0fa', // tech
  '1513836279014-a89f7a76ae86', // forest
  '1470071459604-3b5ec3a7fe05', // landscape
  '1501854140801-50d01698950b', // hills
  '1447752875215-b2761acb3c5d', // stream
  '1461749280684-dccba630e2f6', // code
  '1518770660439-4636190af475', // chips
  '1511556532299-8f662fc26c06', // neon abstract
  '1486406146926-c627a92ad1ab', // city
  '1477959858617-67f85cf4f1df', // cityscape
  '1502082553048-f009c37129b9', // autumn
];

// Content pools for posts
const postTexts = [
  "Just launched my new personal project! So excited to share it with everyone here. Let me know what you think! 🚀💻 #coding #webdev",
  "Beautiful morning for a run! 🏃‍♂️ Feeling refreshed and ready to take on the week. #healthy #lifestyle #morningvibe",
  "Had an amazing dinner tonight with great friends. Food was fantastic, company was even better! 🍕🍷 #blessed #dinner #friends",
  "Spent the afternoon lost in this wonderful book. Highly recommend it to anyone looking for a thought-provoking read! 📚✨",
  "Throwback to this incredible sunset from my last trip. Nature never ceases to amaze me. 🌅✈️ #travel #sunset #beautiful",
  "Exploring the city streets today. Every corner has its own unique story to tell. 🏙️📸 #photography #citylife #explorer",
  "There's nothing quite like a warm cup of coffee and some smooth jazz on a rainy Sunday morning. ☕🌧️ #cozy #sunday",
  "Working on some fresh designs today. Focus is key! 🎯🎨 #ux #design #productivity",
  "A nice reminder for today: 'In the middle of difficulty lies opportunity.' Keep pushing forward, everyone! 💪❤️",
  "Tried baking sourdough bread for the first time. It actually came out super crispy and delicious! 🥖👨‍🍳 #baking #hobby"
];

const postPhotoIds = [
  '1498050108023-c5249f4df085', // code
  '1502082553048-f009c37129b9', // autumn park
  '1544025162-d76694265947', // gourmet food
  '1506880018603-83d5b814b5a6', // reading book
  '1507525428034-b723cf961d3e', // sunset beach
  '1477959858617-67f85cf4f1df', // skyscrapers
  '1517248135467-4c7edcad34c4', // restaurant
  '1451187580459-43490279c0fa', // abstract digital
  '1501339847302-ac426a4a7cbb', // coffee shop
  '1509440159596-0249088772ff'  // baking bread
];

// Seed lists to generate 150 unique profile templates
const firstNames = [
  'John', 'Emily', 'Michael', 'Emma', 'Daniel', 'Olivia', 'David', 'Sophia', 'James', 'Isabella',
  'Robert', 'Ava', 'William', 'Mia', 'Joseph', 'Charlotte', 'Thomas', 'Amelia', 'Charles', 'Harper',
  'Richard', 'Evelyn', 'Matthew', 'Abigail', 'Christopher', 'Emily', 'Andrew', 'Elizabeth', 'Patricia', 'Sofia',
  'Linda', 'Jackson', 'Barbara', 'Avery', 'Susan', 'Lucas', 'Jessica', 'Lily', 'Sarah', 'Benjamin',
  'Karen', 'Leo', 'Nancy', 'Evelyn', 'Lisa', 'Oliver', 'Betty', 'Grace', 'Margaret', 'Chloe'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Wilson',
  'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Hernandez', 'Moore', 'Martin', 'Jackson', 'Thompson', 'White',
  'Lopez', 'Lee', 'Gonzalez', 'Harris', 'Clark', 'Lewis', 'Robinson', 'Walker', 'Perez', 'Hall',
  'Young', 'Allen', 'Sanchez', 'Wright', 'King', 'Scott', 'Green', 'Baker', 'Adams', 'Nelson',
  'Hill', 'Ramirez', 'Campbell', 'Mitchell', 'Roberts', 'Carter', 'Phillips', 'Evans', 'Turner', 'Torres'
];

const occupations = [
  'Software Engineer', 'UX Designer', 'Product Manager', 'Digital Marketer', 'Content Creator',
  'Photographer', 'Graphic Designer', 'Data Scientist', 'Chef', 'Architect',
  'Financial Analyst', 'Writer', 'Teacher', 'Fitness Coach', 'Musician',
  'Software Architect', 'Illustrator', 'Videographer', 'Consultant', 'Travel Blogger'
];

const cities = [
  'San Francisco, CA', 'New York, NY', 'Seattle, WA', 'Austin, TX', 'Los Angeles, CA',
  'Chicago, IL', 'Boston, MA', 'Denver, CO', 'Miami, FL', 'Portland, OR',
  'London, UK', 'Toronto, ON', 'Sydney, AU', 'Berlin, DE', 'Paris, FR',
  'Tokyo, JP', 'Singapore, SG', 'Amsterdam, NL', 'Vancouver, BC', 'Dublin, IE'
];

const bios = [
  "Tech enthusiast & coffee lover. Always exploring new horizons! 🚀☕️",
  "Capturing life's beautiful moments through my lens. Freelance Photographer. 📸✨",
  "UX designer focused on creating meaningful digital experiences. Let's build things! 🎨",
  "Foodie, baker, and part-time traveler. Looking for the best tacos in town! 🌮✈️",
  "Educator, reader, and eternal learner. Small steps everyday. 📚🌱",
  "Full Stack Dev who enjoys hiking, climbing, and deep discussions. 🧗‍♂️💻",
  "Music is my life. Guitarist, composer, and record collector. 🎸🎶",
  "Fitness enthusiast & personal trainer. Helping you reach your maximum potential! 💪🔥",
  "Content creator and strategist. Living one day at a time with gratitude. ✨🙏",
  "Architect by day, watercolor painter by night. Obsessed with clean lines. 📐🖌️"
];

const relationshipStatuses = [
  'Single', 'In a relationship', 'Married', 'Engaged', 'It\'s complicated'
];

export function generateProfiles(): Profile[] {
  const list: Profile[] = [];
  
  // Hand-craft the first 5 profiles to be very detailed, recognizable and highly interactive.
  const coreProfiles: Profile[] = [
    {
      id: 'prof_1',
      name: 'Sarah Connor',
      username: 'sarah_connor',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces&auto=format',
      coverPhoto: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=300&fit=crop&auto=format',
      bio: 'Cybersecurity specialist, survivalist, and loving mother. Always prepared. 🛡️💻',
      occupation: 'Security Analyst',
      city: 'Los Angeles, CA',
      country: 'USA',
      relationship: 'Single',
      followersCount: 1420,
      followingCount: 380,
      isFriend: true,
      isPendingReceived: false,
      isPendingSent: false,
      isOnline: true,
    },
    {
      id: 'prof_2',
      name: 'Marcus Aurelius',
      username: 'stoic_marcus',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces&auto=format',
      coverPhoto: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&h=300&fit=crop&auto=format',
      bio: 'Stoic philosopher & author. Practicing mindfulness, temperance, and wisdom. 🏛️📖',
      occupation: 'Philosopher & Writer',
      city: 'Rome',
      country: 'Italy',
      relationship: 'Married',
      followersCount: 12500,
      followingCount: 450,
      isFriend: true,
      isPendingReceived: false,
      isPendingSent: false,
      isOnline: true,
    },
    {
      id: 'prof_3',
      name: 'Elena Rostova',
      username: 'elena_travels',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces&auto=format',
      coverPhoto: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=300&fit=crop&auto=format',
      bio: 'Wanderlust explorer ✈️ | Full-time Travel Blogger & Photographer. 50+ countries and counting!',
      occupation: 'Travel Journalist',
      city: 'Paris',
      country: 'France',
      relationship: 'In a relationship',
      followersCount: 8430,
      followingCount: 1200,
      isFriend: false,
      isPendingReceived: true, // Pending request from Elena to current user
      isPendingSent: false,
      isOnline: false,
      lastActive: '2 hours ago'
    },
    {
      id: 'prof_4',
      name: 'James Cooper',
      username: 'cooper_code',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces&auto=format',
      coverPhoto: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=300&fit=crop&auto=format',
      bio: 'Banging keyboards and shipping apps since 2015. Tech podcast host & open-source contributor. 🎧💻',
      occupation: 'DevOps Architect',
      city: 'Austin, TX',
      country: 'USA',
      relationship: 'Married',
      followersCount: 3100,
      followingCount: 890,
      isFriend: false,
      isPendingReceived: false,
      isPendingSent: false,
      isOnline: true,
    },
    {
      id: 'prof_5',
      name: 'Aria Chen',
      username: 'aria_designs',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=faces&auto=format',
      coverPhoto: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800&h=300&fit=crop&auto=format',
      bio: 'Crafting minimalist brand identities & mobile interfaces. Art director & matcha addict. 🍵🎨',
      occupation: 'Lead Brand Designer',
      city: 'San Francisco, CA',
      country: 'USA',
      relationship: 'Single',
      followersCount: 6520,
      followingCount: 610,
      isFriend: false,
      isPendingReceived: false,
      isPendingSent: true, // We sent a request to Aria
      isOnline: false,
      lastActive: '10 mins ago'
    }
  ];

  list.push(...coreProfiles);

  // Generate another 145 profiles to reach 150+ in total!
  for (let i = 6; i <= 150; i++) {
    // Deterministic selection using i
    const fn = firstNames[i % firstNames.length];
    const ln = lastNames[(i * 3) % lastNames.length];
    const name = `${fn} ${ln}`;
    const username = `${fn.toLowerCase()}_${ln.toLowerCase()}_${i}`;
    
    const avatarId = avatarPhotoIds[i % avatarPhotoIds.length];
    const avatar = `https://images.unsplash.com/photo-${avatarId}?w=150&h=150&fit=crop&crop=faces&auto=format`;
    
    const coverId = coverPhotoIds[(i * 7) % coverPhotoIds.length];
    const coverPhoto = `https://images.unsplash.com/photo-${coverId}?w=800&h=300&fit=crop&auto=format`;
    
    const occ = occupations[i % occupations.length];
    const city = cities[(i * 2) % cities.length];
    const bioText = bios[(i * 4) % bios.length];
    const relationship = relationshipStatuses[i % relationshipStatuses.length];
    
    // Some are friends, some are suggestions, some have pending requests
    let isFriend = false;
    let isPendingReceived = false;
    let isPendingSent = false;
    
    const rand = i % 15;
    if (rand === 0) {
      isFriend = true;
    } else if (rand === 1) {
      isPendingReceived = true; // Sent request to current user
    } else if (rand === 2) {
      isPendingSent = true; // Sent request from current user
    }

    const isOnline = (i % 4 === 0);
    const lastActive = isOnline ? undefined : `${(i % 12) + 1} hours ago`;

    list.push({
      id: `prof_${i}`,
      name,
      username,
      avatar,
      coverPhoto,
      bio: bioText,
      occupation: occ,
      city,
      country: city.includes(',') ? 'USA' : 'International',
      relationship,
      followersCount: (i * 23) + 150,
      followingCount: (i * 7) + 80,
      isFriend,
      isPendingReceived,
      isPendingSent,
      isOnline,
      lastActive,
    });
  }

  return list;
}

export function generateInitialPosts(profiles: Profile[]): Post[] {
  const posts: Post[] = [];

  // Hand-craft some beautiful initial posts for the first few profiles
  const handCraftedPosts: Post[] = [
    {
      id: 'post_1',
      authorId: 'prof_1',
      authorName: 'Sarah Connor',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces&auto=format',
      content: 'Just secure-hardened my entire local home server network and completed my physical defense conditioning. The future is unwritten. Make sure yours is secure too. 💻🔒🦾',
      imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=450&fit=crop&auto=format',
      createdAt: '3 hours ago',
      likesCount: 42,
      commentsCount: 2,
      hasLiked: false,
      comments: [
        {
          id: 'c_1',
          authorId: 'prof_2',
          authorName: 'Marcus Aurelius',
          authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces&auto=format',
          content: 'Indeed, Sarah. Over our minds we have power, not over external events. Realize this, and you will find strength.',
          createdAt: '2 hours ago'
        },
        {
          id: 'c_2',
          authorId: 'prof_1',
          authorName: 'Sarah Connor',
          authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces&auto=format',
          content: 'Thanks, Marcus. Your Meditations have actually kept me sane through many long nights in the bunker.',
          createdAt: '1 hour ago'
        }
      ]
    },
    {
      id: 'post_2',
      authorId: 'prof_2',
      authorName: 'Marcus Aurelius',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces&auto=format',
      content: 'Waste no more time arguing about what a good man should be. Be one. Look within; within is the fountain of all good.',
      createdAt: '5 hours ago',
      likesCount: 1105,
      commentsCount: 1,
      hasLiked: true,
      comments: [
        {
          id: 'c_3',
          authorId: 'prof_4',
          authorName: 'James Cooper',
          authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces&auto=format',
          content: 'Timeless wisdom. Needed this reminder today, Marcus!',
          createdAt: '4 hours ago'
        }
      ]
    },
    {
      id: 'post_3',
      authorId: 'prof_3',
      authorName: 'Elena Rostova',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces&auto=format',
      content: 'Woke up at 5:00 AM to catch the sunrise over the cliffs of Santorini. It was freezing cold but absolutely worth every second! 🌅🇬🇷 Where should I travel to next?',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=450&fit=crop&auto=format',
      createdAt: '1 day ago',
      likesCount: 230,
      commentsCount: 1,
      hasLiked: false,
      comments: [
        {
          id: 'c_4',
          authorId: 'prof_5',
          authorName: 'Aria Chen',
          authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=faces&auto=format',
          content: 'Unbelievable colors, Elena! Go to Kyoto next for the autumn foliage! 🍁🇯🇵',
          createdAt: '18 hours ago'
        }
      ]
    }
  ];

  posts.push(...handCraftedPosts);

  // Let's generate a batch of posts for other profiles to make the main feed feel loaded with hundreds of profiles' interactions
  for (let i = 6; i <= 60; i++) {
    const profile = profiles[i];
    if (!profile) continue;

    const hasPhoto = i % 3 === 0;
    const text = postTexts[i % postTexts.length];
    const photoId = postPhotoIds[(i * 3) % postPhotoIds.length];
    const imageUrl = hasPhoto ? `https://images.unsplash.com/photo-${photoId}?w=800&h=450&fit=crop&auto=format` : undefined;

    // Create comments
    const comments: Comment[] = [];
    const commentCount = i % 4;
    for (let c = 0; c < commentCount; c++) {
      const commenterIdx = (i + c + 15) % profiles.length;
      const commenter = profiles[commenterIdx];
      if (commenter) {
        comments.push({
          id: `comment_${i}_${c}`,
          authorId: commenter.id,
          authorName: commenter.name,
          authorAvatar: commenter.avatar,
          content: `This is awesome, ${profile.name}! ${c % 2 === 0 ? "Love this post. 👍" : "Great perspective, thanks for sharing."}`,
          createdAt: `${c + 1}h ago`
        });
      }
    }

    posts.push({
      id: `post_${i}`,
      authorId: profile.id,
      authorName: profile.name,
      authorAvatar: profile.avatar,
      content: text,
      imageUrl,
      createdAt: `${(i % 12) + 2} hours ago`,
      likesCount: (i * 4) + 3,
      commentsCount: comments.length,
      hasLiked: i % 5 === 0,
      comments
    });
  }

  return posts;
}

export function generateInitialMessages(): Message[] {
  // Let's seed initial chat history with Sarah Connor & Marcus Aurelius
  const now = new Date();
  
  return [
    {
      id: 'msg_1',
      senderId: 'prof_1', // Sarah Connor
      receiverId: 'user_me',
      content: 'Hey Alex, did you verify the firewall settings for the web dashboard app yet? Let me know, need to ensure no automated crawler breaches the port.',
      createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      isRead: true
    },
    {
      id: 'msg_2',
      senderId: 'user_me',
      receiverId: 'prof_1',
      content: 'Hey Sarah! Yes, completely locked down. I verified that port 3000 is open for the app container, but only via our reverse proxy, and all user routes are authenticated.',
      createdAt: new Date(now.getTime() - 23 * 60 * 60 * 1000).toISOString(),
      isRead: true
    },
    {
      id: 'msg_3',
      senderId: 'prof_1',
      receiverId: 'user_me',
      content: 'Excellent work. Keep your guard up. Talk to you soon.',
      createdAt: new Date(now.getTime() - 22 * 60 * 60 * 1000).toISOString(),
      isRead: true
    },
    {
      id: 'msg_4',
      senderId: 'prof_2', // Marcus Aurelius
      receiverId: 'user_me',
      content: 'Greetings Alex. I was contemplating the nature of design. A clean interface reflects a orderly mind. How goes the development of our social square?',
      createdAt: new Date(now.getTime() - 10 * 60 * 60 * 1000).toISOString(), // 10h ago
      isRead: false
    }
  ];
}

export function generateInitialNotifications(): Notification[] {
  return [
    {
      id: 'notif_1',
      type: 'friend_request',
      senderId: 'prof_3', // Elena Rostova
      senderName: 'Elena Rostova',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces&auto=format',
      content: 'sent you a friend request.',
      isRead: false,
      createdAt: '2 hours ago',
      linkId: 'prof_3'
    },
    {
      id: 'notif_2',
      type: 'post_like',
      senderId: 'prof_1', // Sarah Connor
      senderName: 'Sarah Connor',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces&auto=format',
      content: 'liked your post "Just finished setting up the new layout!".',
      isRead: true,
      createdAt: '4 hours ago',
      linkId: 'user_post_1'
    }
  ];
}
