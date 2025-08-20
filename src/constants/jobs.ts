// Interfaces
export interface Job {
  id: number;
  title: string;
  description: string;
  budget: string;
  duration: string;
  skills: string[];
  category: string;
  escrow: boolean;
  verified: boolean;
  postedBy: string;
  postedDate: string;
}

export interface JobCardProps {
  job: Job;
}

export interface JobFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  showEscrowOnly: boolean;
  setShowEscrowOnly: (value: boolean) => void;
  categories: Array<{ value: string; label: string }>;
}

export const MOCK_JOBS = [
  {
    id: 1,
    title: "Thiết kế UI/UX cho ứng dụng mobile",
    description: "Cần thiết kế giao diện người dùng cho ứng dụng fintech với focus vào trải nghiệm người dùng.",
    budget: "2,000 - 5,000 USD",
    duration: "2-4 tuần",
    skills: ["Figma", "Adobe XD", "UI/UX Design", "Mobile Design"],
    category: "Design",
    escrow: true,
    verified: true,
    postedBy: "TechCorp Inc.",
    postedDate: "2 ngày trước"
  },
  {
    id: 2,
    title: "Phát triển Smart Contract trên Aptos",
    description: "Xây dựng smart contract cho hệ thống escrow và quản lý thanh toán freelancer.",
    budget: "3,000 - 8,000 USD",
    duration: "4-6 tuần",
    skills: ["Move", "Aptos", "Smart Contracts", "Web3"],
    category: "Development",
    escrow: true,
    verified: true,
    postedBy: "BlockchainDAO",
    postedDate: "1 ngày trước"
  },
  {
    id: 3,
    title: "Viết content marketing cho dự án Web3",
    description: "Tạo nội dung marketing chất lượng cao cho dự án blockchain, bao gồm blog, social media và whitepaper.",
    budget: "1,500 - 3,000 USD",
    duration: "3-5 tuần",
    skills: ["Content Writing", "Marketing", "Web3", "SEO"],
    category: "Marketing",
    escrow: false,
    verified: false,
    postedBy: "CryptoStartup",
    postedDate: "3 ngày trước"
  },
  {
    id: 4,
    title: "Phát triển Frontend React/Next.js",
    description: "Xây dựng giao diện web responsive với React và Next.js cho nền tảng freelancer.",
    budget: "2,500 - 6,000 USD",
    duration: "3-4 tuần",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    category: "Development",
    escrow: true,
    verified: true,
    postedBy: "WebStudio",
    postedDate: "5 ngày trước"
  }
];

export const CATEGORIES = [
  { value: "all", label: "Tất cả" },
  { value: "development", label: "Phát triển" },
  { value: "design", label: "Thiết kế" },
  { value: "marketing", label: "Marketing" },
  { value: "writing", label: "Viết lách" },
  { value: "translation", label: "Dịch thuật" }
];
