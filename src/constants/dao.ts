// Interfaces
export interface Proposal {
  id: number;
  title: string;
  description: string;
  category: string;
  status: string;
  endDate: string;
  totalVotes: number;
  yesVotes: number;
  noVotes: number;
  quorum: number;
  creator: string;
  createdAt: string;
}

export interface DaoFiltersProps {
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
  categories: Array<{ value: string; label: string }>;
}

export interface ProposalCardProps {
  proposal: Proposal;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
  calculateProgress: (proposal: Proposal) => number;
  calculateYesPercentage: (proposal: Proposal) => number;
}

export interface VotingProgressProps {
  totalVotes: number;
  quorum: number;
  yesVotes: number;
  noVotes: number;
}

export const MOCK_PROPOSALS = [
  {
    id: 1,
    title: "Tăng phí dịch vụ từ 2% lên 2.5%",
    description: "Đề xuất tăng phí dịch vụ để cải thiện hệ thống và phát triển tính năng mới.",
    category: "Governance",
    status: "active",
    endDate: "2024-01-15",
    totalVotes: 1250,
    yesVotes: 850,
    noVotes: 400,
    quorum: 1000,
    creator: "DAO Council",
    createdAt: "2024-01-01"
  },
  {
    id: 2,
    title: "Thêm hỗ trợ cho Solana blockchain",
    description: "Mở rộng nền tảng để hỗ trợ Solana blockchain, tăng tính linh hoạt cho người dùng.",
    category: "Development",
    status: "pending",
    endDate: "2024-01-20",
    totalVotes: 0,
    yesVotes: 0,
    noVotes: 0,
    quorum: 1500,
    creator: "Tech Team",
    createdAt: "2024-01-05"
  },
  {
    id: 3,
    title: "Cập nhật quy trình giải quyết tranh chấp",
    description: "Cải thiện quy trình DAO voting cho việc giải quyết tranh chấp, giảm thời gian xử lý.",
    category: "Policy",
    status: "completed",
    endDate: "2023-12-30",
    totalVotes: 2000,
    yesVotes: 1800,
    noVotes: 200,
    quorum: 1500,
    creator: "Community",
    createdAt: "2023-12-15"
  }
];

export const CATEGORIES = [
  { value: "all", label: "Tất cả" },
  { value: "governance", label: "Quản trị" },
  { value: "development", label: "Phát triển" },
  { value: "policy", label: "Chính sách" },
  { value: "treasury", label: "Tài chính" }
];
