"use client";

import React, { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Search, Plus, Sparkles, Filter } from "lucide-react";
import { JobCardData, PipelineColumn } from "@/lib/types";
import { JobCard } from "./JobCard";

interface KanbanBoardProps {
  jobs: JobCardData[];
  onJobClick: (job: JobCardData) => void;
  onJobDelete: (id: string) => void;
  onJobMoved: (jobId: string, newColumn: PipelineColumn, newOrder: number) => void;
  onOpenAddJob: () => void;
}

const COLUMNS: { id: PipelineColumn; title: string; countColor: string }[] = [
  { id: "WISHLIST", title: "Wishlist", countColor: "text-ink-muted" },
  { id: "APPLIED", title: "Applied", countColor: "text-primary-hover" },
  { id: "INTERVIEWING", title: "Interviewing", countColor: "text-amber-400" },
  { id: "OFFER", title: "Offer", countColor: "text-semantic-success" },
  { id: "REJECTED", title: "Rejected", countColor: "text-ink-tertiary" },
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  jobs,
  onJobClick,
  onJobDelete,
  onJobMoved,
  onOpenAddJob,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.location && job.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newColumn = destination.droppableId as PipelineColumn;
    onJobMoved(draggableId, newColumn, destination.index);
  };

  return (
    <div className="space-y-6">
      {/* Board Controls: Search & Summary */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 px-1">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-ink-subtle absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by role, company, or location..."
            className="w-full pl-9 pr-3 py-2 bg-surface-1 border border-hairline focus:border-hairline-strong rounded-md text-xs text-ink placeholder:text-ink-tertiary focus:outline-none focus:ring-1 focus:ring-primary/60 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-ink-subtle self-end sm:self-auto">
          <span>
            Tracking <strong className="text-ink">{jobs.length}</strong> active applications
          </span>
        </div>
      </div>

      {/* Drag & Drop Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start pb-12 overflow-x-auto">
          {COLUMNS.map((col) => {
            const columnJobs = filteredJobs.filter((j) => j.column === col.id);

            return (
              <div
                key={col.id}
                className="flex flex-col rounded-lg bg-surface-1/50 border border-hairline min-h-[500px] overflow-hidden"
              >
                {/* Column Header */}
                <div className="px-3.5 py-3 border-b border-hairline flex items-center justify-between bg-surface-1/90">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-ink tracking-card-title">
                      {col.title}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full bg-surface-2 border border-hairline text-[11px] font-medium ${col.countColor}`}
                    >
                      {columnJobs.length}
                    </span>
                  </div>
                  {col.id === "WISHLIST" && (
                    <button
                      onClick={onOpenAddJob}
                      className="p-1 rounded-sm text-ink-subtle hover:text-ink hover:bg-surface-2 transition-colors"
                      title="Quick add job"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Droppable Area */}
                <Droppable droppableId={col.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 p-2.5 space-y-2.5 transition-colors duration-150 ${
                        snapshot.isDraggingOver
                          ? "bg-surface-2/40"
                          : "bg-transparent"
                      }`}
                    >
                      {columnJobs.map((job, index) => (
                        <Draggable
                          key={job.id}
                          draggableId={job.id}
                          index={index}
                        >
                          {(dragProvided, dragSnapshot) => (
                            <div
                              ref={dragProvided.innerRef}
                              {...dragProvided.draggableProps}
                              {...dragProvided.dragHandleProps}
                              style={{
                                ...dragProvided.draggableProps.style,
                                opacity: dragSnapshot.isDragging ? 0.9 : 1,
                              }}
                            >
                              <JobCard
                                job={job}
                                onClick={() => onJobClick(job)}
                                onDelete={onJobDelete}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}

                      {columnJobs.length === 0 && (
                        <div className="h-32 border border-dashed border-hairline rounded-md flex flex-col items-center justify-center text-center p-3">
                          <span className="text-xs text-ink-tertiary">
                            Drop cards here
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
};

