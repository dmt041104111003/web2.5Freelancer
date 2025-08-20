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
  dancingScript: React.CSSProperties;
}

export const MOCK_CONVERSATIONS = [
  {
    id: 1,
    title: "Thiết kế UI/UX cho ứng dụng mobile",
    lastMessage: "Tôi đã gửi file design mới nhất, bạn xem qua nhé!",
    lastMessageTime: "2 phút trước",
    unreadCount: 2,
    participants: [
      { name: "Dao Manh Tung", avatar: "/api/avatar/1", online: true },
      { name: "Trang", avatar: "/api/avatar/2", online: false }
    ],
    projectId: "PRJ-001"
  },
  {
    id: 2,
    title: "Phát triển Smart Contract Aptos",
    lastMessage: "Smart contract đã được deploy thành công trên testnet",
    lastMessageTime: "1 giờ trước",
    unreadCount: 0,
    participants: [
      { name: "Dao Minh Quan", avatar: "/api/avatar/3", online: true },
      { name: "Dao Minh Hai", avatar: "/api/avatar/4", online: true }
    ],
    projectId: "PRJ-002"
  },
  {
    id: 3,
    title: "Content Marketing cho Web3",
    lastMessage: "Bài viết đã được review và approved",
    lastMessageTime: "3 giờ trước",
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
    message: "Chào bạn! Tôi đã xem qua yêu cầu thiết kế UI/UX cho ứng dụng mobile. Bạn có thể cho tôi biết thêm về target audience không?",
    timestamp: "10:30 AM",
    isOwn: false
  },
  {
    id: 2,
    sender: "You",
    message: "Chào Alice! Target audience chính là người dùng 25-40 tuổi, có thu nhập trung bình trở lên, quan tâm đến fintech.",
    timestamp: "10:32 AM",
    isOwn: true
  },
  {
    id: 3,
    sender: "Dao Manh Tung",
    message: "Cảm ơn thông tin! Tôi sẽ bắt đầu với wireframe và gửi cho bạn xem qua. Bạn có preference về màu sắc không?",
    timestamp: "10:35 AM",
    isOwn: false
  },
  {
    id: 4,
    sender: "You",
    message: "Tôi thích palette màu xanh dương và trắng, tạo cảm giác tin cậy và chuyên nghiệp.",
    timestamp: "10:37 AM",
    isOwn: true
  },
  {
    id: 5,
    sender: "Dao Manh Tung",
    message: "Tuyệt vời! Tôi đã gửi file design mới nhất, bạn xem qua nhé!",
    timestamp: "10:40 AM",
    isOwn: false
  }
];
