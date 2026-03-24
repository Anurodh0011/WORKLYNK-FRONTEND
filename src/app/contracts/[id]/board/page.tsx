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
import { Plus, MoreVertical, Edit2, Trash2, GripVertical, FileText, Calendar, User } from "lucide-react";
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
  order: number;
  tasks: Task[];
}

export default function BoardPage() {
  const params = useParams();
  const contractId = params.id;

  const { data, error, isLoading } = useSWR(
    `${API_BASE_URL}/kanban/${contractId}`,
    baseFetcher
  );

  const [columns, setColumns] = useState<Column[]>([]);
  const [projectTitle, setProjectTitle] = useState("Project Workspace");
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [showColumnDialog, setShowColumnDialog] = useState(false);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [editingColumn, setEditingColumn] = useState<{ id: string, name: string } | null>(null);

  useEffect(() => {
    if (data?.data) {
      setColumns(data.data.columns);
      if (data.data.contract?.project?.title) {
        setProjectTitle(data.data.contract.project.title);
      }
    }
  }, [data]);

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    // Optimistic Update
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

  if (isLoading) return <BaseLayout><div className="p-20 text-center">Loading board...</div></BaseLayout>;

  return (
    <BaseLayout>
      <div className="h-[calc(100vh-64px)] bg-slate-50 overflow-hidden flex flex-col">
        {/* Board Header */}
        <div className="px-8 py-6 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-800 truncate max-w-2xl">{projectTitle}</h1>
            <p className="text-sm text-slate-500 font-medium">Manage tasks and track progress</p>
          </div>
          <div className="flex gap-4">
             {/* Add overall board metrics or users here if needed */}
          </div>
        </div>

        {/* Board Body */}
        <div className="flex-1 overflow-x-auto px-8 pb-8 custom-scrollbar">
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-6 h-full min-w-max">
              {columns.map((column) => (
                <div key={column.id} className="w-80 flex flex-col h-full rounded-3xl bg-slate-200/40 border border-slate-200/60 p-4">
                  <div className="flex items-center justify-between mb-4 px-2">
                    <h3 
                        className="font-black text-sm uppercase tracking-widest text-slate-600 truncate cursor-pointer hover:text-primary transition-colors"
                        onClick={() => {
                            setEditingColumn({ id: column.id, name: column.name });
                            setShowColumnDialog(true);
                        }}
                    >
                      {column.name} <span className="ml-2 text-slate-400 font-bold">{column.tasks.length}</span>
                    </h3>
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

                  <Droppable droppableId={column.id}>
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar"
                      >
                        {column.tasks.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`
                                  bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:border-primary/20 
                                  hover:shadow-md transition-all group
                                  ${snapshot.isDragging ? 'shadow-xl border-primary scale-[1.02] rotate-2' : ''}
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
              ))}
            </div>
          </DragDropContext>
        </div>
      </div>

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
    </BaseLayout>
  );
}
