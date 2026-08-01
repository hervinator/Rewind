import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { FeedView } from './components/FeedView';
import { DiscoverView } from './components/DiscoverView';
import { CommunitiesView } from './components/CommunitiesView';
import { MeetupsView } from './components/MeetupsView';
import { MarketplaceView } from './components/MarketplaceView';
import { MessagesView } from './components/MessagesView';
import { ProfileView } from './components/ProfileView';
import { MemoryMapView } from './components/MemoryMapView';
import { MusicView } from './components/MusicView';
import { TimeCapsuleView } from './components/TimeCapsuleView';
import { CreatePostModal } from './components/CreatePostModal';
import { SupabaseModal } from './components/SupabaseModal';
import {
  CURRENT_USER,
  INITIAL_POSTS,
  INITIAL_MEETUPS,
  INITIAL_MARKETPLACE,
  INITIAL_COMMUNITIES,
  INITIAL_CONVERSATIONS,
  INITIAL_MESSAGES,
  INITIAL_TIME_CAPSULE_ITEMS
} from './data/mockData';
import { Post, Meetup, MarketplaceItem, Community, Conversation, Message, Profile, TimeCapsuleItem } from './types';

export default function App() {
  // Navigation & Search State
  const [activeTab, setActiveTab] = useState<string>('feed');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState<boolean>(false);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState<boolean>(false);

  // App Data State with LocalStorage Persistence
  const [currentUser, setCurrentUser] = useState<Profile>(() => {
    const saved = localStorage.getItem('mml_user');
    return saved ? JSON.parse(saved) : CURRENT_USER;
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('mml_posts');
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });

  const [meetups, setMeetups] = useState<Meetup[]>(() => {
    const saved = localStorage.getItem('mml_meetups');
    return saved ? JSON.parse(saved) : INITIAL_MEETUPS;
  });

  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>(() => {
    const saved = localStorage.getItem('mml_marketplace');
    return saved ? JSON.parse(saved) : INITIAL_MARKETPLACE;
  });

  const [communities, setCommunities] = useState<Community[]>(() => {
    const saved = localStorage.getItem('mml_communities');
    return saved ? JSON.parse(saved) : INITIAL_COMMUNITIES;
  });

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('mml_conversations');
    return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
  });

  const [messages, setMessages] = useState<Record<string, Message[]>>(() => {
    const saved = localStorage.getItem('mml_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [timeCapsuleItems, setTimeCapsuleItems] = useState<TimeCapsuleItem[]>(() => {
    const saved = localStorage.getItem('mml_time_capsule');
    return saved ? JSON.parse(saved) : INITIAL_TIME_CAPSULE_ITEMS;
  });

  const [activeConversationId, setActiveConversationId] = useState<string>('conv_1');

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('mml_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('mml_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('mml_meetups', JSON.stringify(meetups));
  }, [meetups]);

  useEffect(() => {
    localStorage.setItem('mml_marketplace', JSON.stringify(marketplaceItems));
  }, [marketplaceItems]);

  useEffect(() => {
    localStorage.setItem('mml_communities', JSON.stringify(communities));
  }, [communities]);

  useEffect(() => {
    localStorage.setItem('mml_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('mml_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('mml_time_capsule', JSON.stringify(timeCapsuleItems));
  }, [timeCapsuleItems]);

  // Handlers
  const handleLikePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const newLiked = !post.user_liked;
          return {
            ...post,
            user_liked: newLiked,
            likes_count: newLiked ? post.likes_count + 1 : post.likes_count - 1
          };
        }
        return post;
      })
    );
  };

  const handleAddComment = (postId: string, commentText: string) => {
    const newComment = {
      id: `c_${Date.now()}`,
      post_id: postId,
      user_id: currentUser.id,
      author: {
        username: currentUser.username,
        handle: currentUser.handle,
        avatar_url: currentUser.avatar_url,
        era_preference: currentUser.era_preference
      },
      content: commentText,
      created_at: new Date().toISOString()
    };

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments_count: post.comments_count + 1,
            comments: [newComment, ...post.comments]
          };
        }
        return post;
      })
    );
  };

  const handleCreatePost = (postData: {
    content: string;
    image_url?: string;
    category: Post['category'];
    decade_tag: Post['decade_tag'];
  }) => {
    const newPost: Post = {
      id: `post_${Date.now()}`,
      user_id: currentUser.id,
      author: {
        username: currentUser.username,
        handle: currentUser.handle,
        avatar_url: currentUser.avatar_url,
        era_preference: currentUser.era_preference
      },
      content: postData.content,
      image_url: postData.image_url,
      category: postData.category,
      decade_tag: postData.decade_tag,
      likes_count: 0,
      user_liked: false,
      comments_count: 0,
      comments: [],
      created_at: new Date().toISOString()
    };

    setPosts([newPost, ...posts]);
  };

  const handleToggleAttendMeetup = (meetupId: string) => {
    setMeetups((prev) =>
      prev.map((m) => {
        if (m.id === meetupId) {
          const isAttending = !m.user_is_attending;
          let newAvatars = [...m.attendees_avatars];

          if (isAttending) {
            if (!newAvatars.includes(currentUser.avatar_url)) {
              newAvatars.unshift(currentUser.avatar_url);
            }
          } else {
            newAvatars = newAvatars.filter((a) => a !== currentUser.avatar_url);
          }

          return {
            ...m,
            user_is_attending: isAttending,
            attendees_count: isAttending ? m.attendees_count + 1 : m.attendees_count - 1,
            attendees_avatars: newAvatars
          };
        }
        return m;
      })
    );
  };

  const handleCreateMeetup = (
    meetupData: Omit<Meetup, 'id' | 'attendees_count' | 'user_is_attending' | 'attendees_avatars' | 'created_at'>
  ) => {
    const newMeetup: Meetup = {
      ...meetupData,
      id: `meetup_${Date.now()}`,
      attendees_count: 1,
      user_is_attending: true,
      attendees_avatars: [currentUser.avatar_url],
      created_at: new Date().toISOString()
    };

    setMeetups([newMeetup, ...meetups]);
  };

  const handleAddMarketplaceItem = (
    itemData: Omit<MarketplaceItem, 'id' | 'status' | 'created_at'>
  ) => {
    const newItem: MarketplaceItem = {
      ...itemData,
      id: `item_${Date.now()}`,
      status: 'Available',
      created_at: new Date().toISOString()
    };

    setMarketplaceItems([newItem, ...marketplaceItems]);
  };

  const handleToggleJoinCommunity = (communityId: string) => {
    setCommunities((prev) =>
      prev.map((comm) => {
        if (comm.id === communityId) {
          const isMember = !comm.user_is_member;
          return {
            ...comm,
            user_is_member: isMember,
            member_count: isMember ? comm.member_count + 1 : comm.member_count - 1
          };
        }
        return comm;
      })
    );
  };

  const handleCreateCommunity = (
    communityData: Omit<Community, 'id' | 'member_count' | 'user_is_member' | 'created_at'>
  ) => {
    const newComm: Community = {
      ...communityData,
      id: `comm_${Date.now()}`,
      member_count: 1,
      user_is_member: true,
      created_at: new Date().toISOString()
    };

    setCommunities([newComm, ...communities]);
  };

  const handleMessageSeller = (sellerId: string, sellerName: string, itemTitle: string) => {
    // Find existing conversation or create new
    let existingConv = conversations.find((c) => c.participant.id === sellerId);

    if (!existingConv) {
      const newConvId = `conv_${Date.now()}`;
      existingConv = {
        id: newConvId,
        participant: {
          id: sellerId,
          username: sellerName,
          handle: `@${sellerName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
          avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
          status: 'online',
          away_message: '~* Online and trading items *~'
        },
        last_message: `Hi! Is "${itemTitle}" still available?`,
        last_message_time: 'Just now',
        unread_count: 0
      };

      setConversations([existingConv, ...conversations]);
      setMessages({
        ...messages,
        [newConvId]: [
          {
            id: `m_${Date.now()}`,
            conversation_id: newConvId,
            sender_id: currentUser.id,
            sender_name: currentUser.username,
            sender_avatar: currentUser.avatar_url,
            content: `Hi ${sellerName}! I saw your listing for "${itemTitle}" on the Millennial Memory Lane Marketplace and I'm interested!`,
            timestamp: 'Just now',
            is_me: true
          }
        ]
      });

      setActiveConversationId(newConvId);
    } else {
      setActiveConversationId(existingConv.id);
    }

    setActiveTab('messages');
  };

  const handleSendMessage = (conversationId: string, content: string) => {
    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      conversation_id: conversationId,
      sender_id: currentUser.id,
      sender_name: currentUser.username,
      sender_avatar: currentUser.avatar_url,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      is_me: true
    };

    setMessages((prev) => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMsg]
    }));

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          return {
            ...c,
            last_message: content,
            last_message_time: 'Just now'
          };
        }
        return c;
      })
    );
  };

  const handleUpdateProfile = (updated: Partial<Profile>) => {
    setCurrentUser((prev) => ({ ...prev, ...updated }));
  };

  const handleAddTimeCapsuleItem = (
    itemData: Omit<TimeCapsuleItem, 'id' | 'is_locked' | 'created_at'>
  ) => {
    const newItem: TimeCapsuleItem = {
      ...itemData,
      id: `tc_${Date.now()}`,
      is_locked: true,
      created_at: new Date().toISOString()
    };
    setTimeCapsuleItems([newItem, ...timeCapsuleItems]);
  };

  const userPosts = posts.filter((p) => p.user_id === currentUser.id);

  return (
    <div className="min-h-screen bg-[#E6FFFA] text-slate-800 font-sans selection:bg-[#D53F8C] selection:text-white flex flex-col">
      
      {/* Header */}
      <Header
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6 pb-20 lg:pb-8">
        
        {/* Navigation Sidebar */}
        <Navigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        {/* Dynamic View Content */}
        <main className="flex-1 min-w-0">
          {activeTab === 'feed' && (
            <FeedView
              posts={posts}
              currentUser={currentUser}
              onLikePost={handleLikePost}
              onAddComment={handleAddComment}
              onOpenCreatePost={() => setIsCreatePostModalOpen(true)}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === 'discover' && <DiscoverView />}

          {activeTab === 'communities' && (
            <CommunitiesView
              communities={communities}
              currentUser={currentUser}
              onToggleJoin={handleToggleJoinCommunity}
              onCreateCommunity={handleCreateCommunity}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === 'meetups' && (
            <MeetupsView
              meetups={meetups}
              currentUser={currentUser}
              onToggleAttend={handleToggleAttendMeetup}
              onCreateMeetup={handleCreateMeetup}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === 'memory_map' && <MemoryMapView />}

          {activeTab === 'music' && <MusicView />}

          {activeTab === 'time_capsule' && (
            <TimeCapsuleView
              timeCapsuleItems={timeCapsuleItems}
              onAddTimeCapsuleItem={handleAddTimeCapsuleItem}
            />
          )}

          {activeTab === 'marketplace' && (
            <MarketplaceView
              items={marketplaceItems}
              currentUser={currentUser}
              onMessageSeller={handleMessageSeller}
              onAddItem={handleAddMarketplaceItem}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === 'messages' && (
            <MessagesView
              conversations={conversations}
              messages={messages}
              currentUser={currentUser}
              activeConversationId={activeConversationId}
              setActiveConversationId={setActiveConversationId}
              onSendMessage={handleSendMessage}
              onUpdateAwayMessage={(msg) => setCurrentUser((u) => ({ ...u, aim_away_message: msg }))}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileView
              currentUser={currentUser}
              userPosts={userPosts}
              timeCapsuleItems={timeCapsuleItems}
              onUpdateProfile={handleUpdateProfile}
              onAddTimeCapsuleItem={handleAddTimeCapsuleItem}
              onLikePost={handleLikePost}
            />
          )}
        </main>

      </div>

      {/* Modals */}
      <CreatePostModal
        isOpen={isCreatePostModalOpen}
        onClose={() => setIsCreatePostModalOpen(false)}
        currentUser={currentUser}
        onSubmit={handleCreatePost}
      />

      <SupabaseModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
      />

    </div>
  );
}
