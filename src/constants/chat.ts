// Interfaces
export interface Participant {
  name: string;
  avatar: string;
  online: boolean;
}

export interface Message {
  id: number;
  message: string;
  timestamp: string;
  isOwn: boolean;
}

export interface Conversation {
  id: number;
  title: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  participants: Array<{
    name: string;
    avatar: string;
    online: boolean;
  }>;
  projectId?: string;
}

export interface ChatHeaderProps {
  title: string;
  participant: Participant;
}

export interface MessageListProps {
  messages: Message[];
}

export interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

export interface ConversationListProps {
  conversations: Conversation[];
  selectedConversation: number;
  onSelectConversation: (id: number) => void;
  robotoCondensed: React.CSSProperties;
}

export const MOCK_CONVERSATIONS = [
  {
    id: 1,
    title: "Design UI/UX for mobile application",
    lastMessage: "I have sent the latest design file, please review it!",
    lastMessageTime: "2 minutes ago",
    unreadCount: 2,
    participants: [
      { name: "Dao Manh Tung", avatar: "/api/avatar/1", online: true },
      { name: "Trang", avatar: "/api/avatar/2", online: false }
    ],
    projectId: "PRJ-001"
  },
  {
    id: 2,
    title: "Develop Smart Contract Aptos",
    lastMessage: "Smart contract deployed successfully on testnet",
    lastMessageTime: "1 hour ago",
    unreadCount: 0,
    participants: [
      { name: "Dao Minh Quan", avatar: "/api/avatar/3", online: true },
      { name: "Dao Minh Hai", avatar: "/api/avatar/4", online: true }
    ],
    projectId: "PRJ-002"
  },
  {
    id: 3,
    title: "Content Marketing for Web3",
    lastMessage: "Article reviewed and approved",
    lastMessageTime: "3 hours ago",
    unreadCount: 0,
    participants: [
      { name: "Dao Minh Tuan", avatar: "/api/avatar/5", online: false },
      { name: "Dao Minh Hai", avatar: "/api/avatar/6", online: false }
    ],
    projectId: "PRJ-003"
  }
];

export const MOCK_MESSAGES = [
  {
    id: 1,
    sender: "Dao Manh Tung",
    message: "Hello! I have reviewed the UI/UX design request for the mobile application. Can you tell me more about the target audience?",
    timestamp: "10:30 AM",
    isOwn: false
  },
  {
    id: 2,
    sender: "You",
    message: "Hello Alice! The target audience is 25-40 years old, with an average income, and interested in fintech.",
    timestamp: "10:32 AM",
    isOwn: true
  },
  {
    id: 3,
    sender: "Dao Manh Tung",
    message: "Thank you for the information! I will start with the wireframe and send it to you. Do you have any preferences for the color scheme?",
    timestamp: "10:35 AM",
    isOwn: false
  },
  {
    id: 4,
    sender: "You",
    message: "I like the blue and white palette, it creates a professional and trustworthy feel.",
    timestamp: "10:37 AM",
    isOwn: true
  },
  {
    id: 5,
    sender: "Dao Manh Tung",
    message: "Great! I have sent the latest design file, please review it!",
    timestamp: "10:40 AM",
    isOwn: false
  }
];
