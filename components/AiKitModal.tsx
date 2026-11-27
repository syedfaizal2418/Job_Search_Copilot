"use client";

import React, { useState } from "react";
import {
  X,
  Sparkles,
  Copy,
  Check,
  FileText,
  HelpCircle,
  Building2,
  FileSearch,
  CheckCircle,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  Loader2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { JobCardData, AiKitData } from "@/lib/types";
import { AiKitSkeleton } from "./AiKitSkeleton";

interface AiKitModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: JobCardData | null;
  onAiKitGenerated: (updatedJob: JobCardData) => void;
  onOpenProfile?: () => void;
}

type TabType =
  | "ats"
  | "simplifier"
  | "cover-letter"
  | "bullets"
  | "interview"
  | "brief";

export const AiKitModal: React.FC<AiKitModalProps> = ({
  isOpen,
  onClose,
  job,
  onAiKitGenerated,
  onOpenProfile,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("ats");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);

  if (!isOpen || !job) return null;

  const kit: AiKitData | undefined = job.aiKit ?? undefined;
  const hasGeneratedKit = Boolean(kit && kit.atsScore !== undefined && kit.atsScore !== null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch(`/api/jobs/${job.id}/generate-ai-kit`, {
        method: "POST",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate AI kit.");
      }

      const updatedJob: JobCardData = {
        ...job,
        aiKit: data,
      };

      onAiKitGenerated(updatedJob);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error generating AI kit";
      setError(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-canvas/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-4xl h-[92vh] max-h-[920px] bg-surface-1 border border-hairline rounded-lg flex flex-col overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-hairline flex items-center justify-between bg-surface-1 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-surface-2 border border-hairline flex items-center justify-center text-primary">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-ink tracking-card-title">
                  {job.title}
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-surface-2 border border-hairline text-ink-muted">
                  {job.company}
                </span>
              </div>
              <p className="text-xs text-ink-subtle">
                AI Kit Studio & Application Materials
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-3.5 py-1.5 rounded-md bg-primary hover:bg-primary-hover text-white text-xs font-medium transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating Complete Kit...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{hasGeneratedKit ? "Regenerate AI Kit" : "Generate AI Kit"}</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-ink-subtle hover:text-ink hover:bg-surface-2 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mx-6 mt-4 p-3 rounded-md bg-red-950/40 border border-red-800/50 flex items-start gap-2.5 text-xs text-red-300">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold">Generation Notice: </span>
              {error}
            </div>
          </div>
        )}

        {/* Tab Navigation Pill Strip */}
        <div className="px-6 pt-3 pb-2 border-b border-hairline bg-surface-1 shrink-0 overflow-x-auto">
          <div className="flex items-center gap-1.5">
            {[
              { id: "ats", label: "ATS Compatibility", icon: CheckCircle },
              { id: "simplifier", label: "JD Simplifier", icon: BookOpen },
              { id: "cover-letter", label: "Tailored Cover Letter", icon: FileText },
              { id: "bullets", label: "Resume Bullets", icon: Sparkles },
              { id: "interview", label: "Interview Q&A", icon: HelpCircle },
              { id: "brief", label: "Company Brief", icon: Building2 },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 whitespace-nowrap transition-all border ${
                    isSelected
                      ? "bg-surface-3 border-hairline-strong text-ink shadow-sm"
                      : "bg-transparent border-transparent text-ink-subtle hover:text-ink hover:bg-surface-2"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-primary-hover" : ""}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-surface-1">
          {isGenerating ? (
            <AiKitSkeleton activeTab={activeTab} />
          ) : !hasGeneratedKit ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
              <div className="w-12 h-12 rounded-lg bg-surface-2 border border-hairline flex items-center justify-center text-primary">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-1.5 max-w-md">
                <h3 className="text-base font-semibold text-ink tracking-card-title">
                  Generate Your Tailored AI Kit
                </h3>
                <p className="text-xs text-ink-subtle leading-relaxed">
                  Click the button below to generate a tailored cover letter, STAR resume bullets, 5 likely interview questions, a 1-page company brief, plain-English JD simplifier, and an ATS compatibility scan.
                </p>
              </div>
              <button
                onClick={handleGenerate}
                className="px-4 py-2 rounded-md bg-primary hover:bg-primary-hover text-white text-xs font-medium transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate AI Kit Now</span>
              </button>
            </div>
          ) : (
            <div className="animate-in fade-in duration-300">
              {/* TAB 1: ATS Compatibility Checker */}
              {activeTab === "ats" && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  {/* Score Card */}
                  <div className="p-5 rounded-lg bg-surface-2 border border-hairline flex flex-col sm:flex-row items-center gap-6">
                    <div className="flex flex-col items-center justify-center shrink-0">
                      <div className="relative w-24 h-24 flex items-center justify-center rounded-full bg-surface-3 border-2 border-hairline">
                        <span className="text-3xl font-bold text-ink">
                          {kit?.atsScore ?? 75}%
                        </span>
                      </div>
                      <span className="mt-2 text-[11px] font-medium text-ink-subtle uppercase tracking-wider">
                        ATS Match Score
                      </span>
                    </div>

                    <div className="space-y-2 text-center sm:text-left flex-1">
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <h4 className="text-sm font-semibold text-ink">
                          Compatibility Analysis
                        </h4>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-surface-3 text-semantic-success border border-semantic-success/20">
                          {((kit?.atsScore ?? 75) >= 70) ? "Strong Match" : "Moderate Match"}
                        </span>
                        {onOpenProfile && (
                          <button
                            type="button"
                            onClick={onOpenProfile}
                            className="ml-auto text-[11px] text-primary-hover hover:underline hidden sm:inline-block"
                          >
                            Update Resume (PDF/DOCX)
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-ink-subtle leading-relaxed">
                        {kit?.atsRecommendations ||
                          "Review missing keywords and formatting improvements to elevate your resume pass rate through automated screening filters."}
                      </p>
                    </div>
                  </div>

                  {/* Keywords Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Matched Keywords */}
                    <div className="p-4 rounded-lg bg-surface-2 border border-hairline space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-semantic-success" />
                        <h5 className="text-xs font-semibold text-ink uppercase tracking-wider">
                          Matched Keywords ({kit?.matchedKeywords?.length || 0})
                        </h5>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {kit?.matchedKeywords && kit.matchedKeywords.length > 0 ? (
                          kit.matchedKeywords.map((kw, i) => (
                            <span
                              key={i}
                              className="text-xs px-2.5 py-1 rounded-md bg-surface-3 border border-hairline text-ink-muted"
                            >
                              {kw}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-ink-subtle">No matched keywords detected.</span>
                        )}
                      </div>
                    </div>

                    {/* Missing Keywords */}
                    <div className="p-4 rounded-lg bg-surface-2 border border-hairline space-y-3">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-primary-hover" />
                        <h5 className="text-xs font-semibold text-ink uppercase tracking-wider">
                          Missing Keywords to Add ({kit?.missingKeywords?.length || 0})
                        </h5>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {kit?.missingKeywords && kit.missingKeywords.length > 0 ? (
                          kit.missingKeywords.map((kw, i) => (
                            <span
                              key={i}
                              className="text-xs px-2.5 py-1 rounded-md bg-surface-3 border border-primary/30 text-ink"
                            >
                              + {kw}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-ink-subtle">No critical keywords missing!</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Formatting & Red Flags */}
                  {kit?.formattingIssues && kit.formattingIssues.length > 0 && (
                    <div className="p-4 rounded-lg bg-surface-2 border border-hairline space-y-2">
                      <h5 className="text-xs font-semibold text-ink uppercase tracking-wider">
                        ATS Formatting & Structural Checklist
                      </h5>
                      <ul className="space-y-1.5">
                        {kit.formattingIssues.map((issue, idx) => (
                          <li key={idx} className="text-xs text-ink-subtle flex items-start gap-2">
                            <span className="text-primary mt-0.5">•</span>
                            <span>{issue}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: Job Description Simplifier */}
              {activeTab === "simplifier" && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  {/* Plain English Summary */}
                  <div className="p-4 rounded-lg bg-surface-2 border border-hairline space-y-2">
                    <h4 className="text-xs font-semibold text-ink uppercase tracking-wider flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-primary" />
                      What This Job Actually Does (Plain English)
                    </h4>
                    <p className="text-xs text-ink leading-relaxed whitespace-pre-line">
                      {kit?.simplifiedSummary || "No simplified summary available."}
                    </p>
                  </div>

                  {/* Skills Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Essential Must-Haves */}
                    <div className="p-4 rounded-lg bg-surface-2 border border-hairline space-y-2.5">
                      <h5 className="text-xs font-semibold text-ink uppercase tracking-wider">
                        Essential Skills (Non-Negotiable)
                      </h5>
                      <ul className="space-y-1.5">
                        {kit?.essentialSkills && kit.essentialSkills.length > 0 ? (
                          kit.essentialSkills.map((skill, idx) => (
                            <li key={idx} className="text-xs text-ink flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-semantic-success mt-1.5 shrink-0" />
                              <span>{skill}</span>
                            </li>
                          ))
                        ) : (
                          <li className="text-xs text-ink-subtle">No essential skills identified.</li>
                        )}
                      </ul>
                    </div>

                    {/* Optional / Nice-to-Have */}
                    <div className="p-4 rounded-lg bg-surface-2 border border-hairline space-y-2.5">
                      <h5 className="text-xs font-semibold text-ink uppercase tracking-wider">
                        Optional / Bonus Skills (Nice-to-Have)
                      </h5>
                      <ul className="space-y-1.5">
                        {kit?.optionalSkills && kit.optionalSkills.length > 0 ? (
                          kit.optionalSkills.map((skill, idx) => (
                            <li key={idx} className="text-xs text-ink-subtle flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-hairline-strong mt-1.5 shrink-0" />
                              <span>{skill}</span>
                            </li>
                          ))
                        ) : (
                          <li className="text-xs text-ink-subtle">No bonus skills listed.</li>
                        )}
                      </ul>
                    </div>
                  </div>

                  {/* Demystified Technical Jargon */}
                  {kit?.termsExplained && kit.termsExplained.length > 0 && (
                    <div className="p-4 rounded-lg bg-surface-2 border border-hairline space-y-3">
                      <h5 className="text-xs font-semibold text-ink uppercase tracking-wider">
                        Technical Terms & Buzzwords Demystified
                      </h5>
                      <div className="grid grid-cols-1 gap-2.5">
                        {kit.termsExplained.map((item, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-md bg-surface-3 border border-hairline space-y-1"
                          >
                            <span className="text-xs font-semibold text-primary-hover">
                              {item.term}
                            </span>
                            <p className="text-xs text-ink-muted leading-relaxed">
                              {item.explanation}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: Tailored Cover Letter */}
              {activeTab === "cover-letter" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-ink-subtle">
                      Customized cover letter emphasizing relevant experience for {job.company}.
                    </span>
                    <button
                      onClick={() => handleCopy(kit?.coverLetter || "", "cover-letter")}
                      className="px-3 py-1.5 rounded-md bg-surface-2 hover:bg-surface-3 border border-hairline text-ink text-xs font-medium flex items-center gap-1.5 transition-all"
                    >
                      {copiedId === "cover-letter" ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-semantic-success" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-ink-subtle" />
                          <span>Copy Letter</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-5 rounded-lg bg-surface-2 border border-hairline text-xs text-ink leading-relaxed whitespace-pre-line font-sans select-text">
                    {kit?.coverLetter || "No cover letter generated yet."}
                  </div>
                </div>
              )}

              {/* TAB 4: Rewritten Resume Bullets */}
              {activeTab === "bullets" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-ink-subtle">
                      Action-oriented STAR/XYZ formula resume bullet points tailored to this role.
                    </span>
                    <button
                      onClick={() =>
                        handleCopy((kit?.rewrittenBullets || []).join("\n\n"), "all-bullets")
                      }
                      className="px-3 py-1.5 rounded-md bg-surface-2 hover:bg-surface-3 border border-hairline text-ink text-xs font-medium flex items-center gap-1.5 transition-all"
                    >
                      {copiedId === "all-bullets" ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-semantic-success" />
                          <span>Copied All!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-ink-subtle" />
                          <span>Copy All Bullets</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {kit?.rewrittenBullets && kit.rewrittenBullets.length > 0 ? (
                      kit.rewrittenBullets.map((bullet, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-lg bg-surface-2 border border-hairline flex items-start justify-between gap-3 group hover:border-hairline-strong transition-all"
                        >
                          <div className="flex items-start gap-2.5">
                            <span className="text-primary font-bold text-xs mt-0.5">•</span>
                            <p className="text-xs text-ink leading-relaxed">{bullet}</p>
                          </div>
                          <button
                            onClick={() => handleCopy(bullet, `bullet-${idx}`)}
                            className="shrink-0 p-1.5 rounded-md text-ink-subtle hover:text-ink hover:bg-surface-3 transition-colors"
                            title="Copy this bullet"
                          >
                            {copiedId === `bullet-${idx}` ? (
                              <Check className="w-3.5 h-3.5 text-semantic-success" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-ink-subtle">No rewritten bullets generated yet.</p>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 5: 5 Likely Interview Questions */}
              {activeTab === "interview" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <span className="text-xs text-ink-subtle block">
                    Role-specific and behavioral questions anticipated for {job.title} at {job.company}, along with interviewer rationale and STAR answer strategies.
                  </span>

                  <div className="space-y-3">
                    {kit?.interviewQuestions && kit.interviewQuestions.length > 0 ? (
                      kit.interviewQuestions.map((item, idx) => {
                        const isExpanded = expandedFaqIndex === idx;
                        return (
                          <div
                            key={idx}
                            className="rounded-lg bg-surface-2 border border-hairline overflow-hidden transition-all"
                          >
                            <button
                              onClick={() => setExpandedFaqIndex(isExpanded ? null : idx)}
                              className="w-full p-4 flex items-center justify-between text-left gap-3 hover:bg-surface-3/50 transition-colors"
                            >
                              <div className="flex items-center gap-2.5">
                                <span className="w-5 h-5 rounded-md bg-surface-3 border border-hairline flex items-center justify-center text-[11px] font-semibold text-primary">
                                  {idx + 1}
                                </span>
                                <span className="text-xs font-semibold text-ink">
                                  {item.question}
                                </span>
                              </div>
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4 text-ink-subtle shrink-0" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-ink-subtle shrink-0" />
                              )}
                            </button>

                            {isExpanded && (
                              <div className="px-4 pb-4 pt-1 space-y-3 border-t border-hairline/60 bg-surface-1/40">
                                <div className="space-y-1">
                                  <span className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider">
                                    Why Interviewers Ask This:
                                  </span>
                                  <p className="text-xs text-ink-subtle leading-relaxed">
                                    {item.rationale}
                                  </p>
                                </div>
                                <div className="space-y-1 p-3 rounded-md bg-surface-3/80 border border-hairline">
                                  <span className="text-[11px] font-semibold text-primary-hover uppercase tracking-wider">
                                    Recommended STAR Strategy:
                                  </span>
                                  <p className="text-xs text-ink leading-relaxed">
                                    {item.recommendedAnswerStrategy}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-xs text-ink-subtle">No interview questions generated yet.</p>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 6: One-Page Company Brief */}
              {activeTab === "brief" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-ink-subtle">
                      One-page executive briefing on {job.company} with culture insights and strategic questions.
                    </span>
                    <button
                      onClick={() => handleCopy(kit?.companyBrief || "", "company-brief")}
                      className="px-3 py-1.5 rounded-md bg-surface-2 hover:bg-surface-3 border border-hairline text-ink text-xs font-medium flex items-center gap-1.5 transition-all"
                    >
                      {copiedId === "company-brief" ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-semantic-success" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-ink-subtle" />
                          <span>Copy Brief</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-5 rounded-lg bg-surface-2 border border-hairline text-xs text-ink leading-relaxed whitespace-pre-line font-sans select-text">
                    {kit?.companyBrief || "No company brief generated yet."}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

