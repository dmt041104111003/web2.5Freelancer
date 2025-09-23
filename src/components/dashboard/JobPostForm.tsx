"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, DollarSign, Calendar, Tag, FileText } from 'lucide-react';

interface JobPostFormProps {
  onSubmit?: (jobData: JobPostData) => void;
}

interface JobPostData {
  job_title: string;
  job_details_cid: string;
  milestones: number[];
  escrow_amount: number;
  application_deadline: number;
  skills: string[];
  duration_per_milestone: number[];
}

export default function JobPostForm({ onSubmit }: JobPostFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    milestones: [] as number[],
    milestoneDurations: [] as number[],
    category: '',
    applicationDeadline: '',
    skills: [] as string[],
    newSkill: '',
    newMilestoneAmount: '',
    newMilestoneDuration: ''
  });

  const categories = [
    'Development',
    'Design',
    'Content',
    'Marketing',
    'Blockchain',
    'AI/ML',
    'Other'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddSkill = () => {
    if (formData.newSkill.trim() && !formData.skills.includes(formData.newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, prev.newSkill.trim()],
        newSkill: ''
      }));
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleAddMilestone = () => {
    const amount = parseFloat(formData.newMilestoneAmount);
    const duration = parseInt(formData.newMilestoneDuration);
    
    if (amount > 0 && duration > 0) {
      const amountInOctas = Math.floor(amount * 100000000); // Convert APT to octas
      setFormData(prev => ({
        ...prev,
        milestones: [...prev.milestones, amountInOctas],
        milestoneDurations: [...prev.milestoneDurations, duration * 86400], // Convert days to seconds
        newMilestoneAmount: '',
        newMilestoneDuration: ''
      }));
    }
  };

  const handleRemoveMilestone = (index: number) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index),
      milestoneDurations: prev.milestoneDurations.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.milestones.length === 0) {
      alert('Please add at least one milestone');
      return;
    }
    
    if (onSubmit) {
      const totalEscrowAmount = formData.milestones.reduce((sum, amount) => sum + amount, 0);
      const applicationDeadlineTimestamp = Math.floor(new Date(formData.applicationDeadline).getTime() / 1000);
      
      const jobData: JobPostData = {
        job_title: formData.title,
        job_details_cid: `Qm${Date.now()}`, // Mock CID - in real app, upload to IPFS
        milestones: formData.milestones,
        escrow_amount: totalEscrowAmount,
        application_deadline: applicationDeadlineTimestamp,
        skills: formData.skills,
        duration_per_milestone: formData.milestoneDurations
      };
      
      onSubmit(jobData);
    }
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      milestones: [],
      milestoneDurations: [],
      category: '',
      applicationDeadline: '',
      skills: [],
      newSkill: '',
      newMilestoneAmount: '',
      newMilestoneDuration: ''
    });
  };

  return (
    <Card variant="outlined" className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Plus className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold text-text-primary">Post a new Job</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Job Title */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Job title *
          </label>
          <Input
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="e.g. Design a logo for a fintech startup"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Detailed description *
          </label>
          <Textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Describe the job, technical requirements, timeline..."
            rows={4}
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            <Tag className="inline h-4 w-4 mr-1" />
            Category *
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            required
            title="Select a category"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select category</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Application Deadline */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            <Calendar className="inline h-4 w-4 mr-1" />
            Application deadline *
          </label>
          <Input
            type="datetime-local"
            value={formData.applicationDeadline}
            onChange={(e) => handleInputChange('applicationDeadline', e.target.value)}
            required
          />
        </div>

        {/* Milestones */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            <DollarSign className="inline h-4 w-4 mr-1" />
            Milestones *
          </label>
          <div className="space-y-3">
            {formData.milestones.map((amount, index) => (
              <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
                <div className="flex-1">
                  <span className="text-sm font-medium">
                    Milestone {index + 1}: {(amount / 100000000).toFixed(2)} APT
                  </span>
                  <span className="text-xs text-text-muted ml-2">
                    ({Math.floor(formData.milestoneDurations[index] / 86400)} days)
                  </span>
                </div>
                <Button
                  type="button"
                  onClick={() => handleRemoveMilestone(index)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  Remove
                </Button>
              </div>
            ))}
            
            <div className="flex gap-2">
              <Input
                type="number"
                value={formData.newMilestoneAmount}
                onChange={(e) => handleInputChange('newMilestoneAmount', e.target.value)}
                placeholder="APT amount"
                min="0"
                step="0.01"
                className="flex-1"
              />
              <Input
                type="number"
                value={formData.newMilestoneDuration}
                onChange={(e) => handleInputChange('newMilestoneDuration', e.target.value)}
                placeholder="Days"
                min="1"
                className="flex-1"
              />
              <Button type="button" onClick={handleAddMilestone} variant="outline">
                Add
              </Button>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            <FileText className="inline h-4 w-4 mr-1" />
            Required skills
          </label>
          <div className="flex gap-2 mb-3">
            <Input
              value={formData.newSkill}
              onChange={(e) => handleInputChange('newSkill', e.target.value)}
              placeholder="Add skill..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
            />
            <Button type="button" onClick={handleAddSkill} variant="outline">
              Add
            </Button>
          </div>
          {formData.skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="ml-1 hover:text-red-500"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit" className="min-w-[120px]">
            Post Job
          </Button>
        </div>
      </form>
    </Card>
  );
}
