import React from 'react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { JobFiltersProps } from '@/constants/jobs';

export default function JobFilters({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  showEscrowOnly,
  setShowEscrowOnly,
  categories
}: JobFiltersProps) {
  return (
    <div className="mb-8 space-y-4">
      <div className="grid md:grid-cols-3 gap-4">
        <Input
          placeholder="Search jobs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select
          options={categories}
          value={selectedCategory}
          onChange={setSelectedCategory}
          placeholder="Select category"
        />
        <div className="flex items-center">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showEscrowOnly}
              onChange={(e) => setShowEscrowOnly(e.target.checked)}
              className="rounded border-border"
            />
            <span className="text-text-primary">Show escrow only</span>
          </label>
        </div>
      </div>
    </div>
  );
}
