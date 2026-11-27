"use client";

import React from "react";
import { Briefcase, User, Plus, FileText, CheckCircle2 } from "lucide-react";
import { UserProfileData } from "@/lib/types";

interface NavbarProps {
  profile: UserProfileData | null;
  onOpenProfile: () => void;
  onOpenAddJob: () => void;
  totalJobs: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  onOpenProfile,
  onOpenAddJob,
  totalJobs,
}) => {
  const hasResume = Boolean(profile?.masterResumeText && profile.masterResumeText.trim().length > 0);

  return (
    <header className="sticky top-0 z-30 h-14 w-full bg-canvas/90 backdrop-blur-md border-b border-hairline px-4 md:px-8">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-surface-2 border border-hairline flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-primary ring-2 ring-primary/30" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-base font-semibold tracking-card-title text-ink">
              Job Search Copilot
            </span>
            <span className="hidden sm:inline-block text-xs font-normal text-ink-subtle">
              AI Application Studio
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          {/* Master Resume Status Pill */}
          <button
            onClick={onOpenProfile}
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs transition-colors border ${
              hasResume
                ? "bg-surface-2 border-hairline text-ink-muted hover:border-hairline-strong"
                : "bg-surface-2/80 border-primary/40 text-primary-hover hover:border-primary"
            }`}
            title="Configure your Master Resume for AI customization"
          >
            {hasResume ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-semantic-success" />
                <span>Resume Loaded</span>
              </>
            ) : (
              <>
                <FileText className="w-3.5 h-3.5 text-primary" />
                <span>Add Base Resume</span>
              </>
            )}
          </button>

          {/* Profile Button */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-surface-1 hover:bg-surface-2 border border-hairline hover:border-hairline-strong text-ink text-sm font-medium transition-all"
          >
            <User className="w-4 h-4 text-ink-muted" />
            <span className="hidden sm:inline">Profile</span>
          </button>

          {/* Add Job CTA */}
          <button
            onClick={onOpenAddJob}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-primary hover:bg-primary-hover text-white text-sm font-medium transition-colors shadow-none"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Job</span>
          </button>
        </div>
      </div>
    </header>
  );
};

