"use client";

import React, { useState, useEffect } from "react";
import BaseLayout from "@/src/app/components/base-layout";
import { useParams } from "next/navigation";
import useSWR, { mutate } from "swr";
import { API_BASE_URL } from "@/src/helpers/config";
import { baseFetcher, mutationFetcher } from "@/src/helpers/fetcher";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/app/components/ui/card";
import { Button } from "@/src/app/components/ui/button";
import { Input } from "@/src/app/components/ui/input";
import { Label } from "@/src/app/components/ui/label";
import { Textarea } from "@/src/app/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/src/app/components/ui/dialog";
import { useAuthContext } from "@/src/hooks/context/AuthContext";
import { Plus, MoreVertical, Edit2, Trash2, GripVertical, FileText, Calendar, User, CheckCircle2, AlertCircle, IndianRupee, Star, Send, Trophy } from "lucide-react";
import { toast } from "sonner";

interface Task {
  id: string;
  title: string;
  description?: string;
  order: number;
}

interface Column {
  id: string;
  name: string;
  color?: string;
  order: number;
  tasks: Task[];
}

const COLOR_MAP: Record<string, string> = {
  slate: "bg-slate-50 border-slate-200 border-t-4 border-t-slate-400",
  blue: "bg-slate-50 border-slate-200 border-t-4 border-t-blue-500",
  green: "bg-slate-50 border-slate-200 border-t-4 border-t-green-500",
  amber: "bg-slate-50 border-slate-200 border-t-4 border-t-amber-500",
  red: "bg-slate-50 border-slate-200 border-t-4 border-t-red-500",
  purple: "bg-slate-50 border-slate-200 border-t-4 border-t-purple-500"
};

const LABEL_MAP: any = {
  slate: "text-slate-600",
  blue: "text-blue-700",
  green: "text-green-700",
  amber: "text-amber-700",
  red: "text-red-700",
  purple: "text-purple-700"
};

export default function BoardPage() {
  const params = useParams();
  const contractId = params.id;
  const { user, token }: any = useAuthContext();
  const isClient = user?.role === "CLIENT";
  const isFreelancer = user?.role === "FREELANCER";

  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(null);

  const { data, error, isLoading } = useSWR(
    selectedMilestoneId 
      ? `${API_BASE_URL}/kanban/${contractId}?milestoneId=${selectedMilestoneId}` 
      : `${API_BASE_URL}/kanban/${contractId}`,
    baseFetcher
  );

  const [columns, setColumns] = useState<Column[]>([]);
  const [projectTitle, setProjectTitle] = useState("Project Workspace");
  const [milestones, setMilestones] = useState<any[]>([]);
  const [activeMilestone, setActiveMilestone] = useState<any>(null);

  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [showColumnDialog, setShowColumnDialog] = useState(false);
  const [showCreateColumnDialog, setShowCreateColumnDialog] = useState(false);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [editingColumn, setEditingColumn] = useState<{ id: string, name: string } | null>(null);
  const [newColumn, setNewColumn] = useState({ name: "", color: "slate" });
  
  const [showMilestoneDialog, setShowMilestoneDialog] = useState(false);
  const [milestoneNotes, setMilestoneNotes] = useState("");
  const [milestoneFeedback, setMilestoneFeedback] = useState("");

  // Review states
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [isCompleting, setIsCompleting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const isReadOnly = isClient || activeMilestone?.status === "PAID" || activeMilestone?.status === "IN_REVIEW";

  useEffect(() => {
    if (data?.data) {
      setColumns(data.data.columns);
      if (data.data.contract?.project?.title) {
        setProjectTitle(data.data.contract.project.title);
      }
      if (data.data.contract?.milestones) {
        setMilestones(data.data.contract.milestones);
        let active = null;
        if (selectedMilestoneId) {
          active = data.data.contract.milestones.find((m: any) => m.id === selectedMilestoneId);
        } else {
          active = data.data.contract.milestones.find((m: any) => m.status !== "PAID") || data.data.contract.milestones[0];
          if (active) setSelectedMilestoneId(active.id);
        }
        setActiveMilestone(active);
      }
    }
  }, [data, selectedMilestoneId]);
 
   // Detect if project is completed and needs review (for both roles)
  useEffect(() => {
    if (data?.data?.contract?.status === "COMPLETED" && !isLoading) {
        // We should check if user has already reviewed, 
         // but for now we'll just show the dialog if it's COMPLETED
        setShowReviewDialog(true);
     }
   }, [data, isLoading]);

  // Determine if this is the final milestone to be paid
  const pendingMilestonesCount = milestones.filter(m => m.status !== "PAID").length;
  const isFinalPayment = activeMilestone?.status === "IN_REVIEW" && pendingMilestonesCount === 1;

  const onDragEnd = async (result: DropResult) => {
    if (isReadOnly) return;

    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    if (result.type === "COLUMN") {
      const newCols = Array.from(columns);
      const [movedCol] = newCols.splice(source.index, 1);
      newCols.splice(destination.index, 0, movedCol);
      setColumns(newCols);

      try {
        await mutationFetcher(`${API_BASE_URL}/kanban/columns/${draggableId}/move`, {
          arg: { newOrder: destination.index },
          method: "PATCH"
        } as any);
      } catch (err) {
        toast.error("Failed to move container");
        mutate(`${API_BASE_URL}/kanban/${contractId}`); // Rollback
      }
      return;
    }

    // Optimistic Update for Tasks
    const sourceCol = columns.find(col => col.id === source.droppableId);
    const destCol = columns.find(col => col.id === destination.droppableId);
    
    if (!sourceCol || !destCol) return;

    const newColumns = [...columns];
    const sourceColIdx = newColumns.findIndex(c => c.id === sourceCol.id);
    const destColIdx = newColumns.findIndex(c => c.id === destCol.id);

    const task = sourceCol.tasks[source.index];
    const newSourceTasks = Array.from(sourceCol.tasks);
    newSourceTasks.splice(source.index, 1);
    
    if (source.droppableId === destination.droppableId) {
      newSourceTasks.splice(destination.index, 0, task);
      newColumns[sourceColIdx] = { ...sourceCol, tasks: newSourceTasks };
    } else {
      const newDestTasks = Array.from(destCol.tasks);
      newDestTasks.splice(destination.index, 0, task);
      newColumns[sourceColIdx] = { ...sourceCol, tasks: newSourceTasks };
      newColumns[destColIdx] = { ...destCol, tasks: newDestTasks };
    }

    setColumns(newColumns);

    try {
      await mutationFetcher(`${API_BASE_URL}/kanban/tasks/${draggableId}/move`, {
        arg: { targetColumnId: destination.droppableId, newOrder: destination.index },
        method: "PATCH"
      } as any);
    } catch (err) {
      toast.error("Failed to move task");
      mutate(`${API_BASE_URL}/kanban/${contractId}`); // Rollback
    }
  };

  const handleAddTask = async () => {
    if (!activeColumnId || !newTask.title.trim()) return;

    try {
      const response = await mutationFetcher(`${API_BASE_URL}/kanban/tasks`, {
        arg: { contractId, columnId: activeColumnId, title: newTask.title, description: newTask.description },
      } as any);

      if (response.success) {
        toast.success("Task created");
        mutate(`${API_BASE_URL}/kanban/${contractId}`);
        setShowTaskDialog(false);
        setNewTask({ title: "", description: "" });
      }
    } catch (err) {
      toast.error("Failed to create task");
    }
  };

  const handleRenameColumn = async () => {
    if (!editingColumn || !editingColumn.name.trim()) return;

    try {
      const response = await mutationFetcher(`${API_BASE_URL}/kanban/columns/${editingColumn.id}`, {
        arg: { name: editingColumn.name },
        method: "PATCH"
      } as any);

      if (response.success) {
        toast.success("Column renamed");
        mutate(`${API_BASE_URL}/kanban/${contractId}`);
        setShowColumnDialog(false);
      }
    } catch (err) {
      toast.error("Failed to rename column");
    }
  };

  const handleCreateColumn = async () => {
    if (!newColumn.name.trim() || !activeMilestone) return;

    try {
      const response = await mutationFetcher(`${API_BASE_URL}/kanban/columns`, {
        arg: { 
          contractId, 
          milestoneId: activeMilestone.id,
          name: newColumn.name,
          color: newColumn.color
        },
      } as any);

      if (response.success) {
        toast.success("Column created");
        mutate(selectedMilestoneId ? `${API_BASE_URL}/kanban/${contractId}?milestoneId=${selectedMilestoneId}` : `${API_BASE_URL}/kanban/${contractId}`);
        setShowCreateColumnDialog(false);
        setNewColumn({ name: "", color: "slate" });
      }
    } catch (err) {
      toast.error("Failed to create column");
    }
  };

  const handleDeleteColumn = async (columnId: string) => {
    if (!confirm("Are you sure you want to delete this container and all its tasks?")) return;
    try {
      const response = await mutationFetcher(`${API_BASE_URL}/kanban/columns/${columnId}`, {
        method: "DELETE"
      } as any);

      if (response && response.success !== false) {
        toast.success("Container deleted");
        mutate(selectedMilestoneId ? `${API_BASE_URL}/kanban/${contractId}?milestoneId=${selectedMilestoneId}` : `${API_BASE_URL}/kanban/${contractId}`);
      }
    } catch (err) {
      toast.error("Failed to delete container");
    }
  };

  const handleSubmitMilestone = async () => {
    if (!activeMilestone) return;
    try {
      const response = await mutationFetcher(`${API_BASE_URL}/kanban/contracts/${contractId}/milestones/${activeMilestone.id}/submit`, {
        arg: { notes: milestoneNotes },
      } as any);
      if (response.success) {
        toast.success("Milestone submitted for review");
        mutate(`${API_BASE_URL}/kanban/${contractId}`);
        setShowMilestoneDialog(false);
      }
    } catch (err) {
      toast.error("Failed to submit milestone");
    }
  };

  const handleReviewMilestone = async (status: "PAID" | "PENDING") => {
    if (!activeMilestone) return;
    if (status === "PENDING" && !milestoneFeedback.trim()) {
       toast.error("Please provide feedback for revisions.");
       return;
    }
    
    try {
      const response = await mutationFetcher(`${API_BASE_URL}/kanban/contracts/${contractId}/milestones/${activeMilestone.id}/review`, {
        arg: { status, feedback: milestoneFeedback },
      } as any);
      if (response.success) {
        toast.success(`Milestone ${status === "PAID" ? "Approved" : "Feedback Sent"}`);
        mutate(`${API_BASE_URL}/kanban/${contractId}`);
        setShowMilestoneDialog(false);
        setMilestoneFeedback("");
      }
    } catch (err) {
      toast.error("Failed to review milestone");
    }
  };

  const handleCompleteProject = async () => {
    // Determine if we can complete: All milestones must be PAID
    const allPaid = milestones.every(m => m.status === "PAID");
    if (!allPaid) {
      toast.error("All milestones must be paid before completing the project.");
      return;
    }

    // Show the review dialog first
    setShowReviewDialog(true);
  };

  const submitReviewAndComplete = async () => {
    if (rating === 0) {
      toast.error("Please provide a star rating.");
      return;
    }

    setIsCompleting(true);
    try {
      if (isFreelancer && data?.data?.contract?.status !== "COMPLETED") {
        const completeData = await mutationFetcher(
          `${API_BASE_URL}/contracts/${contractId}/complete`,
          { arg: {} } as any,
        );

        if (!completeData.success) {
          throw new Error(completeData.message || "Failed to complete project");
        }
      }

      // 2. Submit the review
      await mutationFetcher(`${API_BASE_URL}/reviews`, {
        arg: {
          contractId,
          rating,
          comment: reviewComment,
        },
      } as any);

      toast.success("Project marked as completed! Review submitted.");

      // Redirect with success message
      setTimeout(() => {
        window.location.href = isFreelancer ? "/dashboard/contracts?success=completed" : "/dashboard/projects?success=completed";
      }, 1500);

    } catch (err: any) {
      toast.error(err.message || "System error during completion");
    } finally {
      setIsCompleting(false);
    }
  };

  if (isLoading) return <BaseLayout><div className="p-20 text-center">Loading board...</div></BaseLayout>;

  return (
    <BaseLayout>
      <div className="h-[calc(100vh-64px)] bg-slate-50 overflow-hidden flex flex-row">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 shadow-sm z-10">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="font-black text-lg text-slate-800 tracking-tight">Milestones</h2>
            <p className="text-xs text-muted-foreground font-medium mt-1">Project Roadmap</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-slate-50/30">
            {milestones.map((m: any, index: number) => (
              <div 
                key={m.id}
                onClick={() => setSelectedMilestoneId(m.id)}
                className={`p-4 rounded-2xl cursor-pointer transition-all border ${selectedMilestoneId === m.id ? 'bg-primary/5 border-primary shadow-sm shadow-primary/10' : 'bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50'}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${selectedMilestoneId === m.id ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'}`}>
                    {index + 1}
                  </div>
                  <h4 className={`text-sm font-bold truncate ${selectedMilestoneId === m.id ? 'text-primary' : 'text-slate-700'}`}>{m.title}</h4>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className={`text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest ${m.status === 'PAID' ? 'bg-green-100 text-green-700' : m.status === 'IN_REVIEW' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>{m.status}</span>
                  <span className="text-xs font-bold text-slate-500">रू {m.amount}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Completion Action Footer */}
          {isFreelancer && milestones.length > 0 && milestones.every(m => m.status === "PAID") && (
            <div className="p-4 border-t border-slate-100 bg-white">
               <Button 
                onClick={handleCompleteProject}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-black py-6 rounded-2xl shadow-lg shadow-green-500/20 group animate-pulse hover:animate-none"
               >
                 <CheckCircle2 className="mr-2 group-hover:scale-110 transition-transform" />
                 MARK COMPLETED
               </Button>
            </div>
          )}
        </div>

        {/* Main Board Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/50">
          {/* Board Header */}
          <div className="px-8 py-6 flex items-center justify-between shrink-0 bg-white border-b border-slate-200 shadow-sm z-10">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-800 truncate max-w-2xl">{projectTitle}</h1>
              <p className="text-sm text-slate-500 font-medium">Manage tasks and track progress for Milestone {milestones.findIndex(m => m.id === selectedMilestoneId) + 1}</p>
            </div>
            <div className="flex gap-4">
               {activeMilestone ? (
                 <div className="bg-white border text-left border-primary/20 p-3 px-5 rounded-2xl shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                       <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm tracking-tight text-slate-800">Target: {activeMilestone.title}</h4>
                      <p className="text-[10px] text-muted-foreground uppercase font-black">
                        Status: <span className={activeMilestone.status === "IN_REVIEW" ? "text-amber-500" : activeMilestone.status === "PAID" ? "text-green-500" : "text-primary"}>{activeMilestone.status}</span>
                      </p>
                    </div>
                    <Button 
                      size="sm" 
                      variant={activeMilestone.status === "IN_REVIEW" && isClient ? "default" : "outline"} 
                      className="ml-4 rounded-xl shadow-sm text-xs font-bold"
                      onClick={() => setShowMilestoneDialog(true)}
                    >
                      {isClient 
                        ? (activeMilestone.status === "IN_REVIEW" ? "Review Milestone" : "View Details") 
                        : (activeMilestone.status === "PENDING" ? (activeMilestone.clientFeedback ? "Re-Submit Work" : "Submit Work") : "View Feedback")}
                    </Button>
                    {!isClient && pendingMilestonesCount === 0 && data?.data?.contract?.status === "ACTIVE" && (
                       <Button
                          size="sm"
                          onClick={handleCompleteProject}
                          className="ml-2 bg-green-500 hover:bg-green-600 shadow-sm shadow-green-500/20 text-white font-bold rounded-xl text-xs"
                       >
                         Complete Project
                       </Button>
                    )}
                 </div>
               ) : (
                  <div className="bg-green-50 text-green-700 border border-green-200 p-3 px-5 rounded-2xl shadow-sm flex items-center gap-3">
                    <CheckCircle2 size={20} />
                    <h4 className="font-bold text-sm">Milestone Finished!</h4>
                  </div>
               )}
            </div>
          </div>

          {/* Board Body */}
          <div className="flex-1 overflow-x-auto px-8 py-6 custom-scrollbar">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="all-columns" direction="horizontal" type="COLUMN" isDropDisabled={isReadOnly}>
              {(provided) => (
                <div 
                  className="flex gap-6 h-full min-w-max"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {columns.map((column, index) => (
                    <Draggable key={column.id} draggableId={column.id} index={index} isDragDisabled={isReadOnly}>
                      {(provided, snapshot) => (
                        <div 
                          ref={provided.innerRef} 
                          {...provided.draggableProps}
                          className={`w-80 flex flex-col h-full rounded-2xl border p-4 ${COLOR_MAP[column.color || "slate"]} ${snapshot.isDragging ? 'shadow-2xl scale-[1.02] rotate-1 z-50' : ''}`}
                        >
                          <div 
                            {...provided.dragHandleProps}
                            className={`flex items-center justify-between mb-4 px-2 ${!isReadOnly ? 'cursor-grab active:cursor-grabbing' : ''}`}
                          >
                            <h3 
                                className={`font-black text-sm uppercase tracking-widest truncate transition-colors ${LABEL_MAP[column.color || "slate"]} ${!isReadOnly ? 'hover:opacity-75' : ''}`}
                                onClick={() => {
                                    if (isReadOnly) return;
                                    setEditingColumn({ id: column.id, name: column.name });
                                    setShowColumnDialog(true);
                                }}
                            >
                              {column.name} <span className="ml-2 text-slate-400 font-bold">{column.tasks.length}</span>
                            </h3>
                            {!isClient && (
                              <div className="flex items-center">
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 rounded-lg text-slate-400 hover:text-red-500 hover:bg-white/50"
                                    onClick={() => handleDeleteColumn(column.id)}
                                >
                                  <Trash2 size={16} />
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 rounded-lg text-slate-400 hover:text-primary hover:bg-white/50"
                                    onClick={() => {
                                        setActiveColumnId(column.id);
                                        setShowTaskDialog(true);
                                    }}
                                >
                                  <Plus size={18} />
                                </Button>
                              </div>
                            )}
                          </div>

                          <Droppable droppableId={column.id} isDropDisabled={isReadOnly}>
                            {(provided) => (
                              <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar"
                              >
                                {column.tasks.map((task, index) => (
                                  <Draggable key={task.id} draggableId={task.id} index={index} isDragDisabled={isReadOnly}>
                                    {(provided, snapshot) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className={`
                                          bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:border-slate-300 
                                          hover:shadow transition-all group cursor-grab active:cursor-grabbing
                                          ${snapshot.isDragging ? 'shadow-lg border-primary ring-2 ring-primary/10 scale-[1.02] rotate-1' : ''}
                                        `}
                                      >
                                        <h4 className="font-bold text-slate-800 mb-2 leading-snug">{task.title}</h4>
                                        {task.description && (
                                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                                            {task.description}
                                          </p>
                                        )}
                                        <div className="flex items-center justify-between">
                                          <div className="flex -space-x-1">
                                              <div className="w-6 h-6 rounded-full border-2 border-white bg-primary/10 flex items-center justify-center">
                                                  <User size={12} className="text-primary" />
                                              </div>
                                          </div>
                                          <span className="text-[10px] font-black uppercase text-slate-400">#TK-{task.id.slice(0,4)}</span>
                                        </div>
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}

                  {/* Add Column Button */}
                  {!isReadOnly && activeMilestone && (
                    <div className="w-80 shrink-0">
                      <Button 
                        variant="outline" 
                        className="w-full h-16 rounded-2xl border-dashed border-2 bg-transparent hover:bg-slate-100 text-slate-500 hover:text-primary font-bold transition-all shadow-sm"
                        onClick={() => setShowCreateColumnDialog(true)}
                      >
                        <Plus size={18} className="mr-2" /> Add Container
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          </div>
        </div>
      </div>

      {/* Create Column Dialog */}
      <Dialog open={showCreateColumnDialog} onOpenChange={setShowCreateColumnDialog}>
        <DialogContent className="rounded-3xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">New Container</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="font-bold">Container Name</Label>
              <Input 
                placeholder="e.g. In Progress, Review..." 
                value={newColumn.name}
                onChange={(e) => setNewColumn({ ...newColumn, name: e.target.value })}
                className="rounded-xl border-slate-200 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-bold">Label Color</Label>
              <select 
                value={newColumn.color}
                onChange={(e) => setNewColumn({ ...newColumn, color: e.target.value })}
                className="flex h-10 w-full items-center justify-between rounded-xl border border-slate-200 bg-transparent px-3 py-2 text-sm focus:ring-primary/20 outline-none"
              >
                <option value="slate">Slate (Default)</option>
                <option value="blue">Blue</option>
                <option value="green">Green</option>
                <option value="amber">Amber</option>
                <option value="red">Red</option>
                <option value="purple">Purple</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" className="rounded-xl" onClick={() => setShowCreateColumnDialog(false)}>Cancel</Button>
            <Button 
                onClick={handleCreateColumn} 
                disabled={!newColumn.name.trim()}
                className="rounded-xl font-bold px-6 shadow-lg shadow-primary/20"
            >
              Create Container
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Task Creation Dialog */}
      <Dialog open={showTaskDialog} onOpenChange={setShowTaskDialog}>
        <DialogContent className="rounded-3xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">New Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="font-bold">Task Title</Label>
              <Input 
                placeholder="What needs to be done?" 
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="rounded-xl border-slate-200 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-bold">Description (Optional)</Label>
              <Textarea 
                placeholder="Add more details..." 
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="min-h-[100px] rounded-xl border-slate-200 focus:ring-primary/20"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowTaskDialog(false)}>Cancel</Button>
            <Button 
                onClick={handleAddTask} 
                disabled={!newTask.title.trim()}
                className="rounded-xl font-bold shadow-lg shadow-primary/20"
            >
              Create Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Column Rename Dialog */}
      <Dialog open={showColumnDialog} onOpenChange={setShowColumnDialog}>
        <DialogContent className="rounded-2xl max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-bold">Rename Column</DialogTitle>
          </DialogHeader>
          <div className="py-4 font-black">
            <Input 
              value={editingColumn?.name || ""}
              onChange={(e) => setEditingColumn(prev => prev ? { ...prev, name: e.target.value } : null)}
              className="rounded-xl border-slate-200 font-bold"
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" className="text-xs" onClick={() => setShowColumnDialog(false)}>Cancel</Button>
            <Button onClick={handleRenameColumn} className="rounded-xl text-xs font-bold">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Milestone Dialog - Dynamic Container */}
      <Dialog open={showMilestoneDialog} onOpenChange={setShowMilestoneDialog}>
        <DialogContent className="rounded-3xl max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
               {isClient ? (activeMilestone?.status === "IN_REVIEW" ? "Provide Milestone Feedback" : "Milestone Details") : (activeMilestone?.status === "PENDING" && activeMilestone?.clientFeedback ? "Resubmit Milestone" : "Milestone Completion")}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 px-2">
            <div className="bg-muted/30 p-4 rounded-2xl border border-border/50">
              <h4 className="font-black text-lg mb-1">{activeMilestone?.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{activeMilestone?.description}</p>
              <div className="mt-4 flex items-center justify-between text-sm font-bold">
                 <span className="flex items-center gap-1 text-primary"><IndianRupee size={16} /> {activeMilestone?.amount}</span>
                 <span className="flex items-center gap-1 text-muted-foreground"><Calendar size={16} /> Due {activeMilestone?.dueDate ? new Date(activeMilestone.dueDate).toLocaleDateString() : 'N/A'}</span>
              </div>
            </div>

            {/* If Client Feedback exists, show it */}
            {activeMilestone?.clientFeedback && (
              <div className="bg-amber-500/10 p-4 rounded-2xl border border-amber-500/20 text-sm">
                <span className="font-bold flex items-center gap-1 text-amber-700 mb-1"><AlertCircle size={14} /> Client Feedback</span>
                <p className="text-amber-900">{activeMilestone.clientFeedback}</p>
              </div>
            )}

            {/* If Freelancer Notes exists, show it */}
            {activeMilestone?.freelancerNotes && (
              <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10 text-sm">
                <span className="font-bold text-primary mb-1 block">Freelancer Notes</span>
                <p className="text-slate-700">{activeMilestone.freelancerNotes}</p>
              </div>
            )}

            {/* Inputs based on Role and Status */}
            {!isClient && activeMilestone?.status === "PENDING" && (
              <div className="space-y-2 mt-4">
                <Label className="font-bold">
                  {activeMilestone.clientFeedback ? "Explanation of Corrections (Optional)" : "Add Notes for Client (Optional)"}
                </Label>
                <Textarea 
                  placeholder={activeMilestone.clientFeedback ? "Detail the changes you made based on the feedback..." : "Describe what was completed..."} 
                  value={milestoneNotes}
                  onChange={(e) => setMilestoneNotes(e.target.value)}
                  className="rounded-xl border-slate-200 focus:ring-primary/20"
                />
              </div>
            )}

            {isClient && activeMilestone?.status === "IN_REVIEW" && (
              <div className="space-y-2 mt-4">
                <Label className="font-bold">Feedback / Revision Request</Label>
                <Textarea 
                  placeholder="If revisions are needed, type them here. If approving, this is optional." 
                  value={milestoneFeedback}
                  onChange={(e) => setMilestoneFeedback(e.target.value)}
                  className="rounded-xl border-slate-200 focus:ring-primary/20 min-h-[100px]"
                />
              </div>
            )}
          </div>
          
          <DialogFooter className="gap-2 sm:gap-0 border-t border-slate-100 pt-4">
            <Button variant="ghost" className="rounded-xl" onClick={() => setShowMilestoneDialog(false)}>Close</Button>
            
            {!isClient && activeMilestone?.status === "PENDING" && (
                <Button 
                    onClick={handleSubmitMilestone} 
                    className="rounded-xl font-bold px-6 shadow-lg shadow-primary/20 flex items-center gap-2"
                >
                  <CheckCircle2 size={16} />
                  {activeMilestone.clientFeedback ? "Resubmit for Review" : "Submit for Review"}
                </Button>
            )}

            {isClient && activeMilestone?.status === "IN_REVIEW" && (
                <>
                  <Button 
                      variant="outline"
                      onClick={() => handleReviewMilestone("PENDING")} 
                      className="rounded-xl font-bold border-amber-500/50 text-amber-600 hover:bg-amber-50"
                  >
                    Send Feedback
                  </Button>
                  <Button 
                      onClick={() => handleReviewMilestone("PAID")} 
                      className="rounded-xl font-bold bg-green-500 hover:bg-green-600 px-6 shadow-lg shadow-green-500/20 text-white"
                  >
                    Approve & Pay
                  </Button>
                </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>

      {/* Project Review & Rating Modal */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent className="rounded-[2.5rem] max-w-xl p-0 overflow-hidden border-none shadow-2xl">
          <div className="bg-gradient-to-br from-primary to-primary-foreground p-12 text-center text-white relative">
            <div className="absolute top-4 right-4 text-white/40 font-black text-6xl select-none opacity-20">FINISH</div>
            <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-3xl mx-auto mb-6 flex items-center justify-center border border-white/30 shadow-2xl rotate-3">
              <Trophy size={48} className="text-white drop-shadow-lg" />
            </div>
            <h2 className="text-4xl font-black tracking-tighter mb-2">Project Completed!</h2>
            <p className="text-white/80 font-medium">How was your experience working with the {isFreelancer ? 'Client' : 'Freelancer'}?</p>
          </div>
          
          <div className="p-10 bg-white">
            <div className="space-y-8">
              {/* Star Rating */}
              <div className="text-center">
                <Label className="font-black text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6 block">Overall Satisfaction</Label>
                <div className="flex justify-center gap-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="transition-all duration-200 hover:scale-125 active:scale-95 group focus:outline-none"
                    >
                      <Star
                        size={48}
                        className={`transition-all duration-300 ${
                          (hoverRating || rating) >= star
                            ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                            : "text-slate-200 group-hover:text-amber-200"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <div className="h-6 mt-3">
                    {rating > 0 && (
                        <p className="text-amber-600 font-black text-sm uppercase tracking-widest animate-in fade-in slide-in-from-bottom-1">
                            {rating === 5 ? "Incredible!" : rating === 4 ? "Great Work!" : rating === 3 ? "Satisfactory" : rating === 2 ? "Needs Improvement" : "Poor Experience"}
                        </p>
                    )}
                </div>
              </div>

              {/* Review Text */}
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                    <Label className="font-black text-xs uppercase tracking-widest text-slate-500">Share your feedback</Label>
                    <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full font-bold text-slate-400 italic">Optional but helpful</span>
                </div>
                <Textarea
                  placeholder={`Tell us what was best about working with this ${isFreelancer ? 'client' : 'freelancer'}...`}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="min-h-[120px] rounded-3xl border-slate-100 bg-slate-50/50 p-6 focus:ring-primary/20 transition-all font-medium text-slate-700 placeholder:text-slate-400"
                />
              </div>

              <Button
                onClick={submitReviewAndComplete}
                disabled={isCompleting || rating === 0}
                className="w-full h-16 rounded-3xl font-black text-lg tracking-tight bg-primary shadow-xl shadow-primary/30 hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3 group"
              >
                {isCompleting ? (
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Finishing...
                    </div>
                ) : (
                    <>
                        Complete & Share Feedback
                        <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                )}
              </Button>

              <button 
                onClick={() => setShowReviewDialog(false)}
                className="w-full text-center text-slate-400 text-xs font-black uppercase tracking-widest hover:text-slate-600 transition-colors py-2"
              >
                Go back to board
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </BaseLayout>
  );
}
