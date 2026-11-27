"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, FileText, X } from "lucide-react";
import { UserProfileData } from "@/lib/types";

interface WelcomeHeroProps {
  profile: UserProfileData | null;
  onOpenProfile: () => void;
  onOpenAddJob?: () => void;
  totalJobs?: number;
}

export const WelcomeHero: React.FC<WelcomeHeroProps> = ({
  profile,
  onOpenProfile,
}) => {
  const [isDismissed, setIsDismissed] = useState(true);

  useEffect(() => {
    const dismissed = localStorage.getItem("copilot_welcome_dismissed");
    if (!dismissed) {
      setIsDismissed(false);
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem("copilot_welcome_dismissed", "true");
  };

  const hasResume = Boolean(profile?.masterResumeText && profile.masterResumeText.trim().length > 0);
  const firstName = profile?.fullName?.trim() ? profile.fullName.trim().split(" ")[0] : null;

  if (isDismissed) return null;

  return (
    <div className="relative mb-6 px-6 py-5 rounded-xl bg-surface-1 border border-hairline overflow-hidden animate-in fade-in duration-200">
      {/* Subtle top edge specular highlight matching Linear style */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-hairline-strong to-transparent" />

      {/* Dismiss Button */}
      <button
        onClick={handleDismiss}
        className="absolute top-4 right-4 p-1 rounded-md text-ink-subtle hover:text-ink hover:bg-surface-2 transition-colors"
        title="Dismiss welcome message"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pr-6">
        {/* Left: Enhanced Typography Greeting */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-surface-2 border border-hairline flex items-center justify-center text-primary">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-ink tracking-card-title">
              {firstName ? `Welcome back, ${firstName}!` : "Welcome to Job Search Copilot"}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-ink-muted leading-relaxed pl-8">
            Manage your application pipeline, optimize your resume for ATS screening, and generate tailored application kits in one click.
          </p>
        </div>

        {/* Right: Resume Status Action (Only if resume not yet loaded) */}
        {!hasResume && (
          <div className="shrink-0 pl-8 sm:pl-0">
            <button
              onClick={onOpenProfile}
              className="px-3 py-1.5 rounded-md bg-surface-2 hover:bg-surface-3 border border-hairline hover:border-hairline-strong text-ink text-xs font-medium transition-all flex items-center gap-2"
            >
              <FileText className="w-3.5 h-3.5 text-primary" />
              <span>Upload Resume (PDF/DOCX)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
