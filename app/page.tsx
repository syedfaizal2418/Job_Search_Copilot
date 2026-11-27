"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { KanbanBoard } from "@/components/KanbanBoard";
import { WelcomeHero } from "@/components/WelcomeHero";
import { ProfileModal } from "@/components/ProfileModal";
import { AddJobModal } from "@/components/AddJobModal";
import { AiKitModal } from "@/components/AiKitModal";
import { JobCardData, PipelineColumn, UserProfileData } from "@/lib/types";
import { Loader2, Plus, Sparkles } from "lucide-react";

export default function HomePage() {
  const [jobs, setJobs] = useState<JobCardData[]>([]);
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAddJobModalOpen, setIsAddJobModalOpen] = useState(false);
  const [selectedJobForAiKit, setSelectedJobForAiKit] = useState<JobCardData | null>(null);

  // Initial Data Fetch
  useEffect(() => {
    async function initData() {
      try {
        const [jobsRes, profileRes] = await Promise.all([
          fetch("/api/jobs"),
          fetch("/api/profile"),
        ]);

        if (jobsRes.ok) {
          const jobsData = await jobsRes.json();
          setJobs(jobsData);
        }

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setProfile(profileData);
        }
      } catch (err) {
        console.error("Failed to fetch initial application data", err);
      } finally {
        setIsLoading(false);
      }
    }

    initData();
  }, []);

  // Handle Drag & Drop move
  const handleJobMoved = async (
    jobId: string,
    newColumn: PipelineColumn,
    newOrder: number
  ) => {
    // Optimistic UI update
    setJobs((prev) => {
      const movedIndex = prev.findIndex((j) => j.id === jobId);
      if (movedIndex === -1) return prev;

      const target = { ...prev[movedIndex], column: newColumn, order: newOrder };
      const updated = [...prev];
      updated.splice(movedIndex, 1);
      updated.splice(newOrder, 0, target);
      return updated;
    });

    // Send update to server
    try {
      await fetch(`/api/jobs/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ column: newColumn, order: newOrder }),
      });
    } catch (err) {
      console.error("Failed to persist job position", err);
    }
  };

  // Handle Job Deletion
  const handleJobDelete = async (id: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
    if (selectedJobForAiKit?.id === id) {
      setSelectedJobForAiKit(null);
    }

    try {
      await fetch(`/api/jobs/${id}`, { method: "DELETE" });
    } catch (err) {
      console.error("Failed to delete job", err);
    }
  };

  // Handle New Job Added
  const handleJobAdded = (newJob: JobCardData) => {
    setJobs((prev) => [newJob, ...prev]);
  };

  // Handle AI Kit Update
  const handleAiKitGenerated = (updatedJob: JobCardData) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === updatedJob.id ? updatedJob : j))
    );
    setSelectedJobForAiKit(updatedJob);
  };

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col">
      {/* Navigation */}
      <Navbar
        profile={profile}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenAddJob={() => setIsAddJobModalOpen(true)}
        totalJobs={jobs.length}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-6">
        {isLoading ? (
          <div className="h-96 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="text-xs text-ink-subtle">
              Loading your career pipeline...
            </span>
          </div>
        ) : (
          <>
            <WelcomeHero
              profile={profile}
              onOpenProfile={() => setIsProfileModalOpen(true)}
              onOpenAddJob={() => setIsAddJobModalOpen(true)}
              totalJobs={jobs.length}
            />
            <KanbanBoard
              jobs={jobs}
              onJobClick={(job) => setSelectedJobForAiKit(job)}
              onJobDelete={handleJobDelete}
              onJobMoved={handleJobMoved}
              onOpenAddJob={() => setIsAddJobModalOpen(true)}
            />
          </>
        )}
      </main>

      {/* Profile & Master Resume Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        onProfileUpdated={(updated) => setProfile(updated)}
      />

      {/* Add Job Modal */}
      <AddJobModal
        isOpen={isAddJobModalOpen}
        onClose={() => setIsAddJobModalOpen(false)}
        onJobAdded={handleJobAdded}
      />

      {/* AI Kit Studio Modal */}
      <AiKitModal
        isOpen={Boolean(selectedJobForAiKit)}
        onClose={() => setSelectedJobForAiKit(null)}
        job={selectedJobForAiKit}
        onAiKitGenerated={handleAiKitGenerated}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />
    </div>
  );
}

