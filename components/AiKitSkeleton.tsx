"use client";

import React from "react";
import { Sparkles, Loader2 } from "lucide-react";

interface AiKitSkeletonProps {
  activeTab: "ats" | "simplifier" | "cover-letter" | "bullets" | "interview" | "brief";
}

export const AiKitSkeleton: React.FC<AiKitSkeletonProps> = ({ activeTab }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Live AI Synthesizing Status Bar */}
      <div className="p-3.5 rounded-lg bg-surface-2/80 border border-hairline flex items-center justify-between gap-3 overflow-hidden relative">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-md bg-surface-3 border border-hairline flex items-center justify-center text-primary shrink-0">
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-ink">
                Generating Tailored AI Kit...
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-primary/10 text-primary-hover border border-primary/20 animate-pulse">
                OpenRouter AI
              </span>
            </div>
            <p className="text-[11px] text-ink-subtle">
              Analyzing target job description and your master resume in real time.
            </p>
          </div>
        </div>

        {/* Shimmer progress bar */}
        <div className="hidden sm:block w-36 h-2 rounded-full bg-surface-3 overflow-hidden relative">
          <div className="absolute inset-0 bg-primary/40 rounded-full shimmer-box" />
        </div>
      </div>

      {/* Tab Specific Realistic Skeleton Placeholders */}
      {activeTab === "ats" && (
        <div className="space-y-6">
          {/* Score Card Skeleton */}
          <div className="p-5 rounded-lg bg-surface-2 border border-hairline flex flex-col sm:flex-row items-center gap-6">
            <div className="flex flex-col items-center justify-center shrink-0">
              <div className="w-24 h-24 rounded-full bg-surface-3 border border-hairline flex items-center justify-center shimmer-box">
                <div className="w-12 h-6 rounded-md bg-surface-4 shimmer-box-subtle" />
              </div>
              <div className="mt-2.5 w-24 h-3 rounded bg-surface-3 shimmer-box" />
            </div>

            <div className="space-y-3 flex-1 w-full text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2.5">
                <div className="w-36 h-4 rounded bg-surface-3 shimmer-box" />
                <div className="w-20 h-4 rounded-full bg-surface-3 shimmer-box" />
              </div>
              <div className="space-y-2">
                <div className="w-full h-3 rounded bg-surface-3 shimmer-box" />
                <div className="w-11/12 h-3 rounded bg-surface-3 shimmer-box" />
                <div className="w-4/5 h-3 rounded bg-surface-3 shimmer-box" />
              </div>
            </div>
          </div>

          {/* Keywords Breakdown Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Matched Keywords */}
            <div className="p-4 rounded-lg bg-surface-2 border border-hairline space-y-3.5">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-surface-3 shimmer-box" />
                <div className="w-32 h-3.5 rounded bg-surface-3 shimmer-box" />
              </div>
              <div className="flex flex-wrap gap-2">
                {[64, 88, 72, 96, 56, 80, 68].map((w, i) => (
                  <div
                    key={i}
                    style={{ width: `${w}px` }}
                    className="h-6 rounded-md bg-surface-3 shimmer-box"
                  />
                ))}
              </div>
            </div>

            {/* Missing Keywords */}
            <div className="p-4 rounded-lg bg-surface-2 border border-hairline space-y-3.5">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-surface-3 shimmer-box" />
                <div className="w-40 h-3.5 rounded bg-surface-3 shimmer-box" />
              </div>
              <div className="flex flex-wrap gap-2">
                {[80, 92, 60, 84, 76].map((w, i) => (
                  <div
                    key={i}
                    style={{ width: `${w}px` }}
                    className="h-6 rounded-md bg-surface-3 border border-primary/20 shimmer-box"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Formatting & Red Flags Skeleton */}
          <div className="p-4 rounded-lg bg-surface-2 border border-hairline space-y-3">
            <div className="w-48 h-3.5 rounded bg-surface-3 shimmer-box" />
            <div className="space-y-2 pt-1">
              {[95, 88, 70].map((w, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary/40 shrink-0" />
                  <div
                    style={{ width: `${w}%` }}
                    className="h-3 rounded bg-surface-3 shimmer-box"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: JD Simplifier Skeleton */}
      {activeTab === "simplifier" && (
        <div className="space-y-5">
          {/* Summary Card */}
          <div className="p-4 rounded-lg bg-surface-2 border border-hairline space-y-3">
            <div className="w-56 h-3.5 rounded bg-surface-3 shimmer-box" />
            <div className="space-y-2 pt-1">
              <div className="w-full h-3 rounded bg-surface-3 shimmer-box" />
              <div className="w-11/12 h-3 rounded bg-surface-3 shimmer-box" />
              <div className="w-4/5 h-3 rounded bg-surface-3 shimmer-box" />
            </div>
          </div>

          {/* Skills Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-surface-2 border border-hairline space-y-3">
              <div className="w-44 h-3.5 rounded bg-surface-3 shimmer-box" />
              <div className="space-y-2 pt-1">
                {[80, 90, 75, 85].map((w, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-semantic-success/50 shrink-0" />
                    <div
                      style={{ width: `${w}%` }}
                      className="h-3 rounded bg-surface-3 shimmer-box"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-surface-2 border border-hairline space-y-3">
              <div className="w-48 h-3.5 rounded bg-surface-3 shimmer-box" />
              <div className="space-y-2 pt-1">
                {[70, 85, 60].map((w, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-hairline-strong shrink-0" />
                    <div
                      style={{ width: `${w}%` }}
                      className="h-3 rounded bg-surface-3 shimmer-box"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Demystified Technical Jargon */}
          <div className="p-4 rounded-lg bg-surface-2 border border-hairline space-y-3">
            <div className="w-52 h-3.5 rounded bg-surface-3 shimmer-box" />
            <div className="space-y-2.5">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className="p-3 rounded-md bg-surface-3 border border-hairline space-y-2"
                >
                  <div className="w-28 h-3.5 rounded bg-surface-4 shimmer-box-subtle" />
                  <div className="w-full h-3 rounded bg-surface-4 shimmer-box-subtle" />
                  <div className="w-3/4 h-3 rounded bg-surface-4 shimmer-box-subtle" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Cover Letter Skeleton */}
      {activeTab === "cover-letter" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-64 h-3.5 rounded bg-surface-3 shimmer-box" />
            <div className="w-24 h-7 rounded-md bg-surface-3 shimmer-box" />
          </div>

          <div className="p-6 rounded-lg bg-surface-2 border border-hairline space-y-5">
            {/* Salutation */}
            <div className="w-36 h-3 rounded bg-surface-3 shimmer-box" />

            {/* Paragraph 1 */}
            <div className="space-y-2">
              <div className="w-full h-3 rounded bg-surface-3 shimmer-box" />
              <div className="w-11/12 h-3 rounded bg-surface-3 shimmer-box" />
              <div className="w-4/5 h-3 rounded bg-surface-3 shimmer-box" />
            </div>

            {/* Paragraph 2 */}
            <div className="space-y-2">
              <div className="w-full h-3 rounded bg-surface-3 shimmer-box" />
              <div className="w-full h-3 rounded bg-surface-3 shimmer-box" />
              <div className="w-10/12 h-3 rounded bg-surface-3 shimmer-box" />
              <div className="w-3/4 h-3 rounded bg-surface-3 shimmer-box" />
            </div>

            {/* Paragraph 3 */}
            <div className="space-y-2">
              <div className="w-full h-3 rounded bg-surface-3 shimmer-box" />
              <div className="w-11/12 h-3 rounded bg-surface-3 shimmer-box" />
              <div className="w-2/3 h-3 rounded bg-surface-3 shimmer-box" />
            </div>

            {/* Signoff */}
            <div className="space-y-1.5 pt-2">
              <div className="w-20 h-3 rounded bg-surface-3 shimmer-box" />
              <div className="w-28 h-3.5 rounded bg-surface-3 shimmer-box" />
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Resume Bullets Skeleton */}
      {activeTab === "bullets" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-72 h-3.5 rounded bg-surface-3 shimmer-box" />
            <div className="w-28 h-7 rounded-md bg-surface-3 shimmer-box" />
          </div>

          <div className="space-y-2.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="p-3.5 rounded-lg bg-surface-2 border border-hairline flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-2.5 flex-1">
                  <div className="w-2 h-2 rounded-full bg-primary/60 mt-1 shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <div className="w-full h-3 rounded bg-surface-3 shimmer-box" />
                    <div
                      style={{ width: `${85 - (i % 3) * 10}%` }}
                      className="h-3 rounded bg-surface-3 shimmer-box"
                    />
                  </div>
                </div>
                <div className="w-7 h-7 rounded-md bg-surface-3 shimmer-box shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Interview Q&A Skeleton */}
      {activeTab === "interview" && (
        <div className="space-y-4">
          <div className="w-80 h-3.5 rounded bg-surface-3 shimmer-box" />

          <div className="space-y-3">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-lg bg-surface-2 border border-hairline overflow-hidden"
              >
                <div className="p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 flex-1">
                    <div className="w-5 h-5 rounded-md bg-surface-3 border border-hairline flex items-center justify-center text-[11px] font-semibold text-primary/60 shrink-0">
                      {i + 1}
                    </div>
                    <div
                      style={{ width: `${70 + (i % 3) * 10}%` }}
                      className="h-3.5 rounded bg-surface-3 shimmer-box"
                    />
                  </div>
                  <div className="w-4 h-4 rounded bg-surface-3 shimmer-box shrink-0" />
                </div>
                {i === 0 && (
                  <div className="px-4 pb-4 pt-1 space-y-3 border-t border-hairline/60 bg-surface-1/40">
                    <div className="space-y-1.5">
                      <div className="w-36 h-3 rounded bg-surface-3 shimmer-box" />
                      <div className="w-full h-3 rounded bg-surface-3 shimmer-box" />
                    </div>
                    <div className="p-3 rounded-md bg-surface-3/80 border border-hairline space-y-1.5">
                      <div className="w-44 h-3 rounded bg-surface-4 shimmer-box-subtle" />
                      <div className="w-full h-3 rounded bg-surface-4 shimmer-box-subtle" />
                      <div className="w-4/5 h-3 rounded bg-surface-4 shimmer-box-subtle" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Company Brief Skeleton */}
      {activeTab === "brief" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-64 h-3.5 rounded bg-surface-3 shimmer-box" />
            <div className="w-24 h-7 rounded-md bg-surface-3 shimmer-box" />
          </div>

          <div className="p-6 rounded-lg bg-surface-2 border border-hairline space-y-4">
            <div className="space-y-2">
              <div className="w-48 h-4 rounded bg-surface-3 shimmer-box" />
              <div className="w-full h-3 rounded bg-surface-3 shimmer-box" />
              <div className="w-11/12 h-3 rounded bg-surface-3 shimmer-box" />
              <div className="w-4/5 h-3 rounded bg-surface-3 shimmer-box" />
            </div>

            <div className="pt-3 border-t border-hairline/60 space-y-2">
              <div className="w-40 h-3.5 rounded bg-surface-3 shimmer-box" />
              <div className="w-full h-3 rounded bg-surface-3 shimmer-box" />
              <div className="w-5/6 h-3 rounded bg-surface-3 shimmer-box" />
            </div>

            <div className="pt-3 border-t border-hairline/60 space-y-2">
              <div className="w-44 h-3.5 rounded bg-surface-3 shimmer-box" />
              <div className="space-y-1.5">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0" />
                    <div
                      style={{ width: `${80 - i * 10}%` }}
                      className="h-3 rounded bg-surface-3 shimmer-box"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

