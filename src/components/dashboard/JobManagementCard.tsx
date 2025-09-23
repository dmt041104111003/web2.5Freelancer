import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AnimatedProgress } from '@/components/ui/animated-progress';
import { PostedJob, AcceptedJob } from '@/constants/dashboard';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  Eye, 
  Edit, 
  Trash2, 
  CheckCircle,
  Clock,
  AlertCircle,
  FileText
} from 'lucide-react';

interface JobManagementCardProps {
  job: PostedJob | AcceptedJob;
  type: 'posted' | 'accepted';
  onView?: (jobId: number) => void;
  onEdit?: (jobId: number) => void;
  onDelete?: (jobId: number) => void;
  getStatusColor?: (status: string) => string;
  getStatusText?: (status: string) => string;
}

export default function JobManagementCard({ 
  job, 
  type, 
  onView, 
  onEdit, 
  onDelete,
  getStatusColor,
  getStatusText
}: JobManagementCardProps) {
  const isPostedJob = type === 'posted';
  const postedJob = job as PostedJob;
  const acceptedJob = job as AcceptedJob;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'in-progress':
        return <Clock className="h-4 w-4" />;
      case 'open':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };


  const getStatusTextLocal = (job: PostedJob | AcceptedJob) => {
    if (job.completed) return 'Completed';
    if (job.job_expired) return 'Expired';
    if (job.locked) return 'Locked';
    if (job.approved && job.active) return 'In progress';
    if (job.approved && !job.active) return 'Approved';
    if (job.worker && !job.approved) return 'Has applicant';
    if (!job.worker && job.active) return 'Open';
    return 'Unknown';
  };

  const getStatusColorClass = (job: PostedJob | AcceptedJob) => {
    if (job.completed) return 'success';
    if (job.job_expired) return 'danger';
    if (job.locked) return 'danger';
    if (job.approved && job.active) return 'primary';
    if (job.approved && !job.active) return 'secondary';
    if (job.worker && !job.approved) return 'warning';
    if (!job.worker && job.active) return 'warning';
    return 'default';
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US');
  };

  const formatAmount = (amount: number) => {
    return (amount / 100000000).toFixed(2) + ' APT';
  };

  return (
    <Card variant="outlined" className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-medium text-text-primary mb-1 line-clamp-2">
            {job.title}
          </h3>
          
          {isPostedJob ? (
            <div className="space-y-1">
              <p className="text-sm text-text-secondary line-clamp-2">
                {postedJob.description}
              </p>
              <div className="flex items-center gap-4 text-xs text-text-muted">
                <span className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  {formatAmount(postedJob.escrowed_amount)}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Posted: {formatTimestamp(postedJob.start_time)}
                </span>
                {postedJob.worker && (
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    Has applicant
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-sm text-text-secondary">
                {acceptedJob.client} • {formatAmount(acceptedJob.escrowed_amount)}
              </p>
              <div className="flex items-center gap-4 text-xs text-text-muted">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Accepted: {formatTimestamp(acceptedJob.approve_time || acceptedJob.start_time)}
                </span>
                <span className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  Milestone {acceptedJob.current_milestone + 1}/{acceptedJob.milestones.length}
                </span>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <Badge 
            variant={getStatusColorClass(job) as any} 
            size="sm"
            className="flex items-center gap-1"
          >
            {getStatusIcon(job.completed ? 'completed' : job.active ? 'in-progress' : 'open')}
            {getStatusTextLocal(job)}
          </Badge>
          
          {job.escrowed_amount > 0 && (
            <Badge variant="success" size="sm">
              Escrow
            </Badge>
          )}
        </div>
      </div>
      
      {/* Progress bar for accepted jobs */}
      {!isPostedJob && (
        <div className="space-y-3">
          <AnimatedProgress 
            value={acceptedJob.progress} 
            showLabel={true}
            size="sm"
            variant={acceptedJob.progress === 100 ? 'success' : 'default'}
            animated={true}
            duration={800}
          />
          <div className="text-xs text-text-muted">
            Current milestone: {acceptedJob.current_milestone + 1}/{acceptedJob.milestones.length}
          </div>
        </div>
      )}
      
      {/* Milestones info for posted jobs */}
      {isPostedJob && (
        <div className="space-y-2 mb-3">
          <div className="text-sm text-text-muted">
            <span className="font-medium">Milestones:</span> {postedJob.milestones.length} phases
          </div>
          <div className="flex justify-between items-center text-sm text-text-muted">
            <span className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              Total: {formatAmount(postedJob.escrowed_amount)}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Application deadline: {formatTimestamp(postedJob.application_deadline)}
            </span>
          </div>
        </div>
      )}
      
      {/* Action buttons */}
      <div className="flex justify-end gap-2">
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => onView?.(job.job_id)}
        >
          <Eye className="h-3 w-3 mr-1" />
          View
        </Button>
        
        {isPostedJob && !job.worker && job.active && (
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onEdit?.(job.job_id)}
          >
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
        )}
        
        {isPostedJob && !job.worker && job.active && (
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onDelete?.(job.job_id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Cancel
          </Button>
        )}
        
        {isPostedJob && job.worker && !job.approved && (
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onEdit?.(job.job_id)}
            className="text-green-600 hover:text-green-700"
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Approve
          </Button>
        )}
      </div>
    </Card>
  );
}
