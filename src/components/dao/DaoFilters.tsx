import React from 'react';
import { DaoFiltersProps } from '@/constants/dao';

export default function DaoFilters({
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  categories
}: DaoFiltersProps) {
  return (
    <div className="mb-8 flex flex-wrap gap-4">
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="px-4 py-2 border border-border rounded-lg bg-background text-text-primary"
        aria-label="Chọn danh mục"
      >
        {categories.map(cat => (
          <option key={cat.value} value={cat.value}>{cat.label}</option>
        ))}
      </select>
      <select
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
        className="px-4 py-2 border border-border rounded-lg bg-background text-text-primary"
        aria-label="Chọn trạng thái"
      >
        <option value="all">Tất cả trạng thái</option>
        <option value="active">Đang bỏ phiếu</option>
        <option value="pending">Chờ bắt đầu</option>
        <option value="completed">Đã kết thúc</option>
      </select>
    </div>
  );
}
