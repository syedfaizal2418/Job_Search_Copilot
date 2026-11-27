"use client";

import React from "react";
import { Sparkles, MapPin, DollarSign, Calendar, Trash2, ExternalLink } from "lucide-react";
import { JobCardData } from "@/lib/types";

interface JobCardProps {
  job: JobCardData;
  onClick: () => void;
  onDelete: (id: string) => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  onClick,
  onDelete,
}) => {
  const hasAiKit = Boolean(job.aiKit && job.aiKit.atsScore !== null && job.aiKit.atsScore !== undefined);
  const formattedDate = new Date(job.createdAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

  return (
    <div
      onClick={onClick}
      className="group relative p-4 rounded-lg bg-surface-1 hover:bg-surface-2 border border-hairline hover:border-hairline-strong cursor-pointer transition-all duration-150 space-y-3 shadow-none"
    >
      {/* Top Row: Company & Delete */}
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-medium text-ink-muted group-hover:text-ink transition-colors line-clamp-1">
          {job.company}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (confirm(`Remove "${job.title}" at ${job.company} from your pipeline?`)) {
              onDelete(job.id);
            }
          }}
          className="opacity-0 group-hover:opacity-100 p-1 rounded-sm text-ink-subtle hover:text-red-400 hover:bg-surface-3 transition-all"
          title="Delete application"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Role Title */}
      <div>
        <h4 className="text-sm font-semibold text-ink leading-snug tracking-card-title line-clamp-2">
          {job.title}
        </h4>
      </div>

      {/* Metadata Badges */}
      <div className="flex flex-wrap items-center gap-2 text-[11px] text-ink-subtle">
        {job.location && (
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-ink-tertiary" />
            <span className="line-clamp-1">{job.location}</span>
          </span>
        )}
        {job.salaryRange && (
          <span className="flex items-center gap-1">
            <DollarSign className="w-3 h-3 text-ink-tertiary" />
            <span>{job.salaryRange}</span>
          </span>
        )}
      </div>

      {/* Divider */}
      <div className="pt-2 border-t border-hairline/60 flex items-center justify-between">
        <span className="text-[11px] text-ink-tertiary flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {formattedDate}
        </span>

        {/* AI Kit Status Pill */}
        {hasAiKit ? (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-3 border border-semantic-success/30 text-[11px] text-semantic-success font-medium">
            <Sparkles className="w-3 h-3" />
            <span>{job.aiKit?.atsScore ?? 75}% ATS</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-2 border border-hairline text-[11px] text-primary-hover group-hover:border-primary/40 font-medium transition-colors">
            <Sparkles className="w-3 h-3" />
            <span>Generate Kit</span>
          </div>
        )}
      </div>
    </div>
  );
};

