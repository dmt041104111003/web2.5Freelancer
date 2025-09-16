// Interfaces
export interface Activity {
  id: number;
  type: string;
  message: string;
  timestamp: string;
  amount: number | null;
}

export interface Project {
  id: number;
  title: string;
  client: string;
  budget: number;
  progress: number;
  status: string;
  dueDate: string;
  escrow: boolean;
}

export interface ActivityItemProps {
  activity: Activity;
}

export interface ProjectCardProps {
  project: Project;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
}

export interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
}

export const MOCK_STATS = {
  totalEarnings: 15420,
  totalProjects: 12,
  activeProjects: 3,
  completionRate: 92,
  monthlyEarnings: 3200,
  pendingPayments: 1800
};

export const MOCK_PROJECTS = [
  {
    id: 1,
    title: "Thiết kế UI/UX cho ứng dụng mobile",
    client: "TechCorp Inc.",
    budget: 5000,
    progress: 75,
    status: "in-progress",
    dueDate: "2024-01-20",
    escrow: true
  },
  {
    id: 2,
    title: "Phát triển Smart Contract Aptos",
    client: "BlockchainCorp",
    budget: 8000,
    progress: 100,
    status: "completed",
    dueDate: "2024-01-15",
    escrow: true
  },
  {
    id: 3,
    title: "Content Marketing cho Web3",
    client: "CryptoStartup",
    budget: 3000,
    progress: 25,
    status: "in-progress",
    dueDate: "2024-02-01",
    escrow: false
  }
];

export const MOCK_RECENT_ACTIVITIES = [
  {
    id: 1,
    type: "payment",
    message: "Nhận thanh toán $2,500 cho dự án Smart Contract",
    timestamp: "2 giờ trước",
    amount: 2500
  },
  {
    id: 2,
    type: "project",
    message: "Dự án UI/UX đã được cập nhật tiến độ 75%",
    timestamp: "1 ngày trước",
    amount: null
  },
  {
    id: 3,
    type: "escrow",
    message: "Escrow được kích hoạt cho dự án Content Marketing",
    timestamp: "2 ngày trước",
    amount: 3000
  },
  {
    id: 4,
    type: "completion",
    message: "Dự án Smart Contract đã hoàn thành",
    timestamp: "3 ngày trước",
    amount: 8000
  }
];
