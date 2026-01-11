import { useState } from "react";
import { Plus, Check, X, Pencil, Trash2, CheckCircle2, Circle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  useCreateFeature, useUpdateFeature, useDeleteFeature,
  useCreateBug, useUpdateBug, useDeleteBug,
  useCreateImprovement, useUpdateImprovement, useDeleteImprovement 
} from "@/hooks/use-projects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Feature, Bug, Improvement } from "@shared/schema";

interface TaskBoardProps {
  projectId: number;
  features: Feature[];
  bugs: Bug[];
  improvements: Improvement[];
}

export function TaskBoard({ projectId, features, bugs, improvements }: TaskBoardProps) {
  const [activeTab, setActiveTab] = useState<"features" | "bugs" | "improvements">("features");

  return (
    <div className="space-y-6">
      <div className="flex gap-2 border-b border-border/50 pb-1">
        <TabButton 
          active={activeTab === "features"} 
          onClick={() => setActiveTab("features")}
          count={features.length}
        >
          Features
        </TabButton>
        <TabButton 
          active={activeTab === "bugs"} 
          onClick={() => setActiveTab("bugs")}
          count={bugs.length}
          variant="danger"
        >
          Bugs
        </TabButton>
        <TabButton 
          active={activeTab === "improvements"} 
          onClick={() => setActiveTab("improvements")}
          count={improvements.length}
          variant="info"
        >
          Improvements
        </TabButton>
      </div>

      <div className="min-h-[400px]">
        {activeTab === "features" && (
          <ItemList 
            projectId={projectId} 
            items={features} 
            type="feature"
          />
        )}
        {activeTab === "bugs" && (
          <ItemList 
            projectId={projectId} 
            items={bugs} 
            type="bug"
          />
        )}
        {activeTab === "improvements" && (
          <ItemList 
            projectId={projectId} 
            items={improvements} 
            type="improvement"
          />
        )}
      </div>
    </div>
  );
}

function TabButton({ 
  children, 
  active, 
  onClick, 
  count,
  variant = "default" 
}: { 
  children: React.ReactNode; 
  active: boolean; 
  onClick: () => void;
  count: number;
  variant?: "default" | "danger" | "info";
}) {
  const activeStyles = {
    default: "text-primary border-primary",
    danger: "text-red-400 border-red-400",
    info: "text-blue-400 border-blue-400"
  };

  const badgeStyles = {
    default: "bg-primary/10 text-primary",
    danger: "bg-red-500/10 text-red-400",
    info: "bg-blue-500/10 text-blue-400"
  };

  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-3 text-sm font-medium transition-colors relative flex items-center gap-2
        ${active ? activeStyles[variant] : "text-muted-foreground hover:text-foreground"}
      `}
    >
      {children}
      <span className={`text-xs px-2 py-0.5 rounded-full ${active ? badgeStyles[variant] : "bg-muted text-muted-foreground"}`}>
        {count}
      </span>
      {active && (
        <motion.div 
          layoutId="activeTab"
          className={`absolute bottom-0 left-0 right-0 h-0.5 ${active ? activeStyles[variant].split(" ")[1].replace("text", "bg") : ""}`}
        />
      )}
    </button>
  );
}

function ItemList({ 
  projectId, 
  items, 
  type 
}: { 
  projectId: number; 
  items: (Feature | Bug | Improvement)[]; 
  type: "feature" | "bug" | "improvement"; 
}) {
  const [newItem, setNewItem] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  
  const createFeature = useCreateFeature();
  const createBug = useCreateBug();
  const createImprovement = useCreateImprovement();

  const handleCreate = async () => {
    if (!newItem.trim()) return;
    
    try {
      if (type === "feature") {
        await createFeature.mutateAsync({ projectId, description: newItem, status: "pending" });
      } else if (type === "bug") {
        await createBug.mutateAsync({ projectId, description: newItem, status: "open" });
      } else {
        await createImprovement.mutateAsync({ projectId, description: newItem, status: "pending" });
      }
      setNewItem("");
      setIsAdding(false);
    } catch (e) {
      // Error handled by hook
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-display font-semibold capitalize">{type}s Backlog</h3>
        <Button 
          size="sm" 
          onClick={() => setIsAdding(true)}
          className="bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary border-none shadow-none"
        >
          <Plus className="w-4 h-4 mr-1" /> Add {type}
        </Button>
      </div>

      {isAdding && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-2 mb-4 p-4 bg-card/50 rounded-lg border border-border"
        >
          <Input 
            autoFocus
            placeholder={`Describe the ${type}...`}
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          />
          <Button onClick={handleCreate}>Save</Button>
          <Button variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
        </motion.div>
      )}

      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {items.length === 0 && !isAdding ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="text-center py-12 text-muted-foreground bg-muted/5 rounded-xl border border-dashed border-border"
            >
              No {type}s found. Add one to get started!
            </motion.div>
          ) : (
            items.map((item) => (
              <TaskItem 
                key={item.id} 
                item={item} 
                type={type} 
                projectId={projectId} 
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function TaskItem({ 
  item, 
  type, 
  projectId 
}: { 
  item: Feature | Bug | Improvement; 
  type: "feature" | "bug" | "improvement"; 
  projectId: number; 
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(item.description);

  const updateFeature = useUpdateFeature();
  const deleteFeature = useDeleteFeature();
  
  const updateBug = useUpdateBug();
  const deleteBug = useDeleteBug();
  
  const updateImprovement = useUpdateImprovement();
  const deleteImprovement = useDeleteImprovement();

  const isCompleted = item.status === "completed" || item.status === "fixed";

  const handleToggleStatus = () => {
    const newStatus = isCompleted 
      ? (type === "bug" ? "open" : "pending") 
      : (type === "bug" ? "fixed" : "completed");

    if (type === "feature") {
      updateFeature.mutate({ id: item.id, projectId, status: newStatus });
    } else if (type === "bug") {
      updateBug.mutate({ id: item.id, projectId, status: newStatus });
    } else {
      updateImprovement.mutate({ id: item.id, projectId, status: newStatus });
    }
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this item?")) {
      if (type === "feature") {
        deleteFeature.mutate({ id: item.id, projectId });
      } else if (type === "bug") {
        deleteBug.mutate({ id: item.id, projectId });
      } else {
        deleteImprovement.mutate({ id: item.id, projectId });
      }
    }
  };

  const handleUpdateText = () => {
    if (editValue.trim() !== item.description) {
      if (type === "feature") {
        updateFeature.mutate({ id: item.id, projectId, description: editValue });
      } else if (type === "bug") {
        updateBug.mutate({ id: item.id, projectId, description: editValue });
      } else {
        updateImprovement.mutate({ id: item.id, projectId, description: editValue });
      }
    }
    setIsEditing(false);
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`
        group flex items-start gap-3 p-4 rounded-lg border transition-all duration-200
        ${isCompleted ? "bg-muted/10 border-transparent opacity-60" : "bg-card border-border/50 hover:border-border hover:shadow-md"}
      `}
    >
      <button 
        onClick={handleToggleStatus}
        className={`mt-1 flex-shrink-0 transition-colors ${isCompleted ? "text-green-500" : "text-muted-foreground hover:text-primary"}`}
      >
        {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
      </button>

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="flex gap-2">
            <Input 
              value={editValue} 
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleUpdateText()}
              autoFocus
              className="h-8 text-sm"
            />
            <Button size="sm" onClick={handleUpdateText} className="h-8">Save</Button>
            <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)} className="h-8">Cancel</Button>
          </div>
        ) : (
          <div className="flex justify-between items-start gap-4">
            <p className={`text-sm ${isCompleted ? "line-through text-muted-foreground" : "text-foreground"}`}>
              {item.description}
            </p>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => setIsEditing(true)} className="p-1 text-muted-foreground hover:text-primary">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={handleDelete} className="p-1 text-muted-foreground hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
