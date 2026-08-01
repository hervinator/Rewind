export type EraPreference = '90s Kid' | 'Y2K Teen' | 'Late 90s / Early 00s Hybrid' | 'Retro Enthusiast';

export type DecadeTag = '90s' | '2000s' | 'Both';

export type PostCategory = 'Nostalgia' | 'Tech & Toys' | 'Movies & TV' | 'Gaming' | 'Music' | 'Snacks & Food';

export interface Profile {
  id: string;
  username: string;
  handle: string;
  avatar_url: string;
  banner_url?: string;
  era_preference: EraPreference;
  bio: string;
  location: string;
  favorite_childhood_media: {
    favorite_show: string;
    favorite_game: string;
    favorite_snack: string;
    favorite_album: string;
  };
  badges: string[];
  aim_away_message?: string;
  aim_status?: 'online' | 'away' | 'busy' | 'offline';
  created_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  author: {
    username: string;
    handle: string;
    avatar_url: string;
    era_preference: EraPreference;
  };
  content: string;
  created_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  author: {
    username: string;
    handle: string;
    avatar_url: string;
    era_preference: EraPreference;
  };
  content: string;
  image_url?: string;
  category: PostCategory;
  decade_tag: DecadeTag;
  likes_count: number;
  user_liked: boolean;
  comments_count: number;
  comments: Comment[];
  community_id?: string;
  community_name?: string;
  created_at: string;
}

export interface Meetup {
  id: string;
  title: string;
  description: string;
  category: 'Arcade & Gaming' | 'Music & Concerts' | 'Food & Snacks' | 'Trivia & Watch Party' | 'Swap Meet';
  date: string; // ISO or YYYY-MM-DD
  time: string;
  location: string;
  city: string;
  organizer: {
    id: string;
    username: string;
    avatar_url: string;
    handle: string;
  };
  attendees_count: number;
  user_is_attending: boolean;
  attendees_avatars: string[];
  max_attendees?: number;
  cover_image: string;
  created_at: string;
}

export type ItemCondition = 'Mint in Box' | 'Like New' | 'Gently Used' | 'Well Loved' | 'Refurbished';

export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  condition: ItemCondition;
  category: 'Gaming' | 'Toys & Collectibles' | 'Music & Media' | 'Apparel & Accessories' | 'Retro Tech';
  decade: DecadeTag;
  status: 'Available' | 'Pending' | 'Sold';
  seller: {
    id: string;
    username: string;
    handle: string;
    avatar_url: string;
    rating: number;
  };
  location: string;
  image_url: string;
  created_at: string;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  category: string;
  member_count: number;
  icon: string; // Icon name reference
  cover_image: string;
  user_is_member: boolean;
  tags: string[];
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_name: string;
  sender_avatar: string;
  content: string;
  timestamp: string;
  is_me: boolean;
}

export interface Conversation {
  id: string;
  participant: {
    id: string;
    username: string;
    handle: string;
    avatar_url: string;
    status: 'online' | 'away' | 'offline';
    away_message?: string;
  };
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: {
    text: string;
    archetype: string;
  }[];
}

export interface TimeCapsuleItem {
  id: string;
  title: string;
  memory_text: string;
  media_url?: string;
  unlock_date: string;
  is_locked: boolean;
  created_at: string;
}
