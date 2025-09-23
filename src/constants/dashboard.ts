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
    client: "BlockchainDAO",
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

export const MOCK_POSTED_JOBS = [
  {
    job_id: 1,
    poster: "0x123...abc",
    cid: "QmJobDetails1",
    start_time: 1704067200,
    end_time: 0,
    milestones: [2000000000, 3000000000], 
    duration_per_milestone: [604800, 1209600],
    worker: null,
    approved: false,
    active: true,
    current_milestone: 0,
    escrowed_amount: 5000000000,
    escrow_address: "0x456...def",
    approve_time: null,
    poster_did: "did:aptos:123...abc",
    poster_profile_cid: "QmProfile1",
    completed: false,
    rejected_count: 0,
    job_expired: false,
    application_deadline: 1704153600, 
    application_duration: 86400,
    last_reject_time: null,
    locked: false,
    last_apply_time: null,
    worker_stake: 0,
    withdraw_request: null,
    cancel_request: null,
    unlock_confirm_poster: false,
    unlock_confirm_worker: false,
    title: "Thiết kế logo cho startup fintech",
    description: "Cần thiết kế logo hiện đại, đơn giản cho startup fintech",
    skills: ["Design", "Logo", "Branding"],
    category: "Design"
  },
  {
    job_id: 2,
    poster: "0x123...abc",
    cid: "QmJobDetails2",
    start_time: 1703980800,
    end_time: 0,
    milestones: [3000000000, 2000000000],
    duration_per_milestone: [1209600, 604800],
    worker: "0x789...ghi",
    approved: true,
    active: true,
    current_milestone: 1,
    escrowed_amount: 5000000000,
    escrow_address: "0x456...def",
    approve_time: 1704067200,
    poster_did: "did:aptos:123...abc",
    poster_profile_cid: "QmProfile1",
    completed: false,
    rejected_count: 0,
    job_expired: false,
    application_deadline: 1704067200,
    application_duration: 86400,
    last_reject_time: null,
    locked: false,
    last_apply_time: 1704060000,
    worker_stake: 100000000,
    withdraw_request: null,
    cancel_request: null,
    unlock_confirm_poster: false,
    unlock_confirm_worker: false,
    title: "Phát triển website e-commerce",
    description: "Xây dựng website bán hàng với React và Node.js",
    skills: ["React", "Node.js", "E-commerce"],
    category: "Development"
  }
];

export const MOCK_ACCEPTED_JOBS = [
  {
    job_id: 3,
    poster: "0x456...def",
    cid: "QmJobDetails3",
    start_time: 1704067200,
    end_time: 0,
    milestones: [2500000000, 2500000000],
    duration_per_milestone: [604800, 604800],
    worker: "0x123...abc", 
    approved: true,
    active: true,
    current_milestone: 1,
    escrowed_amount: 5000000000,
    escrow_address: "0x789...ghi",
    approve_time: 1704067200,
    poster_did: "did:aptos:456...def",
    poster_profile_cid: "QmProfile2",
    completed: false,
    rejected_count: 0,
    job_expired: false,
    application_deadline: 1704153600,
    application_duration: 86400,
    last_reject_time: null,
    locked: false,
    last_apply_time: 1704060000,
    worker_stake: 100000000,
    withdraw_request: null,
    cancel_request: null,
    unlock_confirm_poster: false,
    unlock_confirm_worker: false,
    title: "Thiết kế UI/UX cho ứng dụng mobile",
    description: "Thiết kế giao diện người dùng cho ứng dụng mobile fintech",
    skills: ["UI/UX", "Mobile", "Figma"],
    category: "Design",
    client: "TechCorp Inc.",
    progress: 50, 
    acceptedDate: "2024-01-01"
  },
  {
    job_id: 4,
    poster: "0x789...ghi",
    cid: "QmJobDetails4",
    start_time: 1703808000,
    end_time: 1704153600,
    milestones: [4000000000, 4000000000],
    duration_per_milestone: [1209600, 1209600],
    worker: "0x123...abc",
    approved: true,
    active: false,
    current_milestone: 2,
    escrowed_amount: 0,
    escrow_address: "0xabc...123",
    approve_time: 1703808000,
    poster_did: "did:aptos:789...ghi",
    poster_profile_cid: "QmProfile3",
    completed: true,
    rejected_count: 0,
    job_expired: false,
    application_deadline: 1703894400,
    application_duration: 86400,
    last_reject_time: null,
    locked: false,
    last_apply_time: 1703800000,
    worker_stake: 0,
    withdraw_request: null,
    cancel_request: null,
    unlock_confirm_poster: false,
    unlock_confirm_worker: false,
    title: "Phát triển Smart Contract Aptos",
    description: "Xây dựng smart contract cho DeFi protocol",
    skills: ["Move", "Aptos", "DeFi"],
    category: "Blockchain",
    client: "BlockchainDAO",
    progress: 100,
    acceptedDate: "2023-12-15"
  }
];

export interface PostedJob {
  job_id: number;
  poster: string;
  cid: string;
  start_time: number;
  end_time: number;
  milestones: number[];
  duration_per_milestone: number[];
  worker: string | null;
  approved: boolean;
  active: boolean;
  current_milestone: number;
  escrowed_amount: number;
  escrow_address: string;
  approve_time: number | null;
  poster_did: string;
  poster_profile_cid: string;
  completed: boolean;
  rejected_count: number;
  job_expired: boolean;
  application_deadline: number;
  application_duration: number;
  last_reject_time: number | null;
  locked: boolean;
  last_apply_time: number | null;
  worker_stake: number;
  withdraw_request: string | null;
  cancel_request: string | null;
  unlock_confirm_poster: boolean;
  unlock_confirm_worker: boolean;
  title: string;
  description: string;
  skills: string[];
  category: string;
}

export interface AcceptedJob extends PostedJob {
  client: string;
  progress: number;
  acceptedDate: string;
}