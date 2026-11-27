"use client";

import React, { useState } from "react";
import { X, Link as LinkIcon, FileText, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { JobCardData, PipelineColumn } from "@/lib/types";

interface AddJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJobAdded: (job: JobCardData) => void;
}

export const AddJobModal: React.FC<AddJobModalProps> = ({
  isOpen,
  onClose,
  onJobAdded,
}) => {
  const [activeTab, setActiveTab] = useState<"url" | "text">("url");
  const [urlInput, setUrlInput] = useState("");
  const [isFetchingUrl, setIsFetchingUrl] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [company, setCompany] = useState("");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [column, setColumn] = useState<PipelineColumn>("WISHLIST");

  if (!isOpen) return null;

  const handleFetchUrl = async () => {
    if (!urlInput.trim()) {
      setError("Please enter a valid job URL.");
      return;
    }

    setIsFetchingUrl(true);
    setError(null);

    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlInput.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to extract job posting from URL");
      }

      if (data.title) setTitle(data.title);
      if (data.company) setCompany(data.company);
      if (data.jobDescription) setJobDescription(data.jobDescription);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error fetching posting";
      setError(msg);
    } finally {
      setIsFetchingUrl(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !title.trim() || !jobDescription.trim()) {
      setError("Company, Job Title, and Job Description are required.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company,
          title,
          location,
          salaryRange,
          jobUrl: activeTab === "url" ? urlInput.trim() : null,
          jobDescription,
          column,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create job");
      }

      const created = await res.json();
      onJobAdded(created);
      onClose();
      // Reset state
      setUrlInput("");
      setCompany("");
      setTitle("");
      setLocation("");
      setSalaryRange("");
      setJobDescription("");
      setColumn("WISHLIST");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to add job";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-canvas/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-surface-1 border border-hairline rounded-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-hairline flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-ink tracking-card-title">
              Add New Job Application
            </h2>
            <p className="text-xs text-ink-subtle">
              Track a new position in your pipeline and prepare your AI application kit.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-ink-subtle hover:text-ink hover:bg-surface-2 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="px-6 pt-4">
          <div className="flex p-1 bg-surface-2 border border-hairline rounded-md">
            <button
              type="button"
              onClick={() => setActiveTab("url")}
              className={`flex-1 py-1.5 text-xs font-medium rounded-sm flex items-center justify-center gap-2 transition-all ${
                activeTab === "url"
                  ? "bg-surface-3 text-ink shadow-sm"
                  : "text-ink-subtle hover:text-ink"
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Import via Job URL</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("text")}
              className={`flex-1 py-1.5 text-xs font-medium rounded-sm flex items-center justify-center gap-2 transition-all ${
                activeTab === "text"
                  ? "bg-surface-3 text-ink shadow-sm"
                  : "text-ink-subtle hover:text-ink"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Paste Job Details Directly</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-md bg-red-950/40 border border-red-800/50 flex items-center gap-2 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {activeTab === "url" && (
            <div className="p-3.5 rounded-md bg-surface-2 border border-hairline space-y-2">
              <label className="block text-xs font-medium text-ink-muted">
                Job Posting URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://company.careers/jobs/12345 or LinkedIn/Indeed link..."
                  className="flex-1 px-3 py-2 bg-surface-1 border border-hairline focus:border-hairline-strong rounded-md text-xs text-ink placeholder:text-ink-tertiary focus:outline-none focus:ring-1 focus:ring-primary/60 transition-all"
                />
                <button
                  type="button"
                  onClick={handleFetchUrl}
                  disabled={isFetchingUrl || !urlInput.trim()}
                  className="px-3.5 py-2 rounded-md bg-surface-3 hover:bg-surface-4 border border-hairline text-ink text-xs font-medium flex items-center gap-1.5 transition-all disabled:opacity-50"
                >
                  {isFetchingUrl ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Fetching...</span>
                    </>
                  ) : (
                    <>
                      <span>Autofill</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-ink-muted mb-1.5">
                Company Name *
              </label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Acme Health, Stripe"
                className="w-full px-3 py-2 bg-surface-2 border border-hairline focus:border-hairline-strong rounded-md text-xs text-ink placeholder:text-ink-tertiary focus:outline-none focus:ring-1 focus:ring-primary/60 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-muted mb-1.5">
                Job Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Customer Success Manager"
                className="w-full px-3 py-2 bg-surface-2 border border-hairline focus:border-hairline-strong rounded-md text-xs text-ink placeholder:text-ink-tertiary focus:outline-none focus:ring-1 focus:ring-primary/60 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-ink-muted mb-1.5">
                Location / Remote
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Remote, Chicago, IL"
                className="w-full px-3 py-2 bg-surface-2 border border-hairline focus:border-hairline-strong rounded-md text-xs text-ink placeholder:text-ink-tertiary focus:outline-none focus:ring-1 focus:ring-primary/60 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-muted mb-1.5">
                Salary / Compensation
              </label>
              <input
                type="text"
                value={salaryRange}
                onChange={(e) => setSalaryRange(e.target.value)}
                placeholder="e.g. $85k - $100k"
                className="w-full px-3 py-2 bg-surface-2 border border-hairline focus:border-hairline-strong rounded-md text-xs text-ink placeholder:text-ink-tertiary focus:outline-none focus:ring-1 focus:ring-primary/60 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-muted mb-1.5">
                Initial Pipeline Stage
              </label>
              <select
                value={column}
                onChange={(e) => setColumn(e.target.value as PipelineColumn)}
                className="w-full px-3 py-2 bg-surface-2 border border-hairline focus:border-hairline-strong rounded-md text-xs text-ink focus:outline-none focus:ring-1 focus:ring-primary/60 transition-all"
              >
                <option value="WISHLIST">Wishlist</option>
                <option value="APPLIED">Applied</option>
                <option value="INTERVIEWING">Interviewing</option>
                <option value="OFFER">Offer</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-ink-muted">
                Job Description *
              </label>
              <span className="text-[11px] text-ink-tertiary">
                Essential for AI Kit & ATS scoring
              </span>
            </div>
            <textarea
              required
              rows={8}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job requirements, qualifications, and responsibilities..."
              className="w-full px-3 py-2.5 bg-surface-2 border border-hairline focus:border-hairline-strong rounded-md text-xs text-ink placeholder:text-ink-tertiary focus:outline-none focus:ring-1 focus:ring-primary/60 transition-all resize-y"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-2 border-t border-hairline flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-md text-xs font-medium text-ink-muted hover:text-ink bg-surface-2 hover:bg-surface-3 border border-hairline transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 rounded-md text-xs font-medium bg-primary hover:bg-primary-hover text-white transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Adding Job...</span>
                </>
              ) : (
                <span>Add to Pipeline</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

