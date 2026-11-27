"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Check,
  FileText,
  Sparkles,
  AlertCircle,
  UploadCloud,
  Loader2,
  FileCheck,
} from "lucide-react";
import { UserProfileData } from "@/lib/types";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfileData | null;
  onProfileUpdated: (updated: UserProfileData) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onProfileUpdated,
}) => {
  const [fullName, setFullName] = useState(profile?.fullName || "");
  const [targetRole, setTargetRole] = useState(profile?.targetRole || "");
  const [masterResumeText, setMasterResumeText] = useState(profile?.masterResumeText || "");
  const [preferredTone, setPreferredTone] = useState(profile?.preferredTone || "professional");
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // File upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedWordCount, setUploadedWordCount] = useState<number | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || "");
      setTargetRole(profile.targetRole || "");
      setMasterResumeText(profile.masterResumeText || "");
      setPreferredTone(profile.preferredTone || "professional");
    }
  }, [profile]);

  if (!isOpen) return null;

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    const validExtensions = [".pdf", ".docx", ".txt"];
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!validExtensions.includes(ext)) {
      setError("Please upload a PDF (.pdf), Word document (.docx), or Text file (.txt).");
      return;
    }

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/profile/upload-resume", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to process resume file.");
      }

      setMasterResumeText(data.text);
      setUploadedFileName(data.filename);
      setUploadedWordCount(data.wordCount);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error uploading file";
      setError(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          targetRole,
          masterResumeText,
          preferredTone,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save profile");
      }

      const updated = await res.json();
      onProfileUpdated(updated);
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 1000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update profile";
      setError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-canvas/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-surface-1 border border-hairline rounded-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-hairline flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-surface-2 border border-hairline flex items-center justify-center text-primary">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-ink tracking-card-title">
                Master Candidate Profile
              </h2>
              <p className="text-xs text-ink-subtle">
                Upload your resume (PDF/DOCX) or paste text to power ATS matching and AI Kit tools.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-ink-subtle hover:text-ink hover:bg-surface-2 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-md bg-red-950/40 border border-red-800/50 flex items-center gap-2 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-ink-muted mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Alex Johnson"
                className="w-full px-3 py-2 bg-surface-2 border border-hairline focus:border-hairline-strong rounded-md text-xs text-ink placeholder:text-ink-tertiary focus:outline-none focus:ring-1 focus:ring-primary/60 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-muted mb-1.5">
                Target Role / Discipline
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Project Manager, Operations Lead"
                className="w-full px-3 py-2 bg-surface-2 border border-hairline focus:border-hairline-strong rounded-md text-xs text-ink placeholder:text-ink-tertiary focus:outline-none focus:ring-1 focus:ring-primary/60 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-muted mb-1.5">
              Preferred Writing Tone
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "professional", label: "Professional & Polished" },
                { id: "confident", label: "Confident & Bold" },
                { id: "conversational", label: "Approachable & Modern" },
              ].map((tone) => (
                <button
                  type="button"
                  key={tone.id}
                  onClick={() => setPreferredTone(tone.id)}
                  className={`px-3 py-2 text-xs rounded-md border text-center transition-all ${
                    preferredTone === tone.id
                      ? "bg-surface-3 border-primary/60 text-ink font-medium"
                      : "bg-surface-2 border-hairline text-ink-subtle hover:text-ink hover:border-hairline-strong"
                  }`}
                >
                  {tone.label}
                </button>
              ))}
            </div>
          </div>

          {/* Resume Upload Dropzone */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-ink-muted">
                Upload Resume (PDF or DOCX)
              </label>
              <span className="text-[11px] text-ink-tertiary">
                Supports .pdf and .docx
              </span>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf,.docx,.txt"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
            />

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-4 rounded-lg border border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center ${
                isDragOver
                  ? "bg-surface-3 border-primary"
                  : "bg-surface-2/60 hover:bg-surface-2 border-hairline hover:border-hairline-strong"
              }`}
            >
              {isUploading ? (
                <div className="flex items-center gap-2 text-xs text-primary-hover py-1">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Extracting resume text from document...</span>
                </div>
              ) : uploadedFileName ? (
                <div className="flex items-center gap-2 text-xs text-semantic-success py-0.5">
                  <FileCheck className="w-4 h-4" />
                  <span className="font-medium">{uploadedFileName}</span>
                  <span className="text-ink-subtle">
                    ({uploadedWordCount?.toLocaleString()} words extracted)
                  </span>
                  <span className="text-[11px] text-primary-hover underline ml-1">
                    Replace
                  </span>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-ink">
                    <UploadCloud className="w-4 h-4 text-primary" />
                    <span>Drop your resume here, or <span className="text-primary-hover underline">browse files</span></span>
                  </div>
                  <p className="text-[11px] text-ink-subtle">
                    PDF and Word documents are parsed automatically into your master profile.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Master Resume Textarea */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-ink-muted">
                Master Resume Text (Ground Truth)
              </label>
              <span className="text-[11px] text-ink-tertiary">
                Editable text used for ATS matching
              </span>
            </div>
            <textarea
              rows={8}
              value={masterResumeText}
              onChange={(e) => setMasterResumeText(e.target.value)}
              placeholder="Your extracted or pasted resume text will appear here..."
              className="w-full px-3 py-2.5 bg-surface-2 border border-hairline focus:border-hairline-strong rounded-md text-xs font-mono text-ink placeholder:text-ink-tertiary focus:outline-none focus:ring-1 focus:ring-primary/60 transition-all resize-y"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-2 border-t border-hairline flex items-center justify-between">
            <span className="text-[11px] text-ink-tertiary">
              Stored securely in your local database.
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-md text-xs font-medium text-ink-muted hover:text-ink bg-surface-2 hover:bg-surface-3 border border-hairline transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-1.5 rounded-md text-xs font-medium bg-primary hover:bg-primary-hover text-white transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isSaving ? "Saving..." : "Save Profile"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
