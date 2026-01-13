import { useState, useMemo } from "react";
import { Plus, Check, X, Pencil, Trash2, CheckCircle2, Circle, ChevronDown, ChevronRight, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  useCreateFeature, useUpdateFeature, useDeleteFeature,
  useCreateBug, useUpdateBug, useDeleteBug,
  useCreateImprovement, useUpdateImprovement, useDeleteImprovement 
} from "@/hooks/use-projects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import type { Feature, Bug, Improvement } from "@shared/schema";

interface TagSelectorProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
  allTags: string[];
}

function TagSelector({ selectedTags, onChange, allTags }: TagSelectorProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onChange(selectedTags.filter((t) => t !== tag));
    } else {
      onChange([...selectedTags, tag]);
    }
  };

  const filteredTags = allTags.filter(tag => !selectedTags.includes(tag));

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-0.5">Tags</span>
      <div className="flex flex-wrap gap-1.5 min-h-[32px] p-1.5 bg-background/50 rounded-md border border-input/50">
        {selectedTags.map((tag) => (
          <Badge 
            key={tag} 
            variant="secondary" 
            className="text-[10px] h-5 pl-1.5 pr-1 gap-1 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors"
          >
            {tag}
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleTag(tag);
              }}
              className="hover:text-destructive transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-5 px-1.5 text-[10px] text-muted-foreground hover:text-foreground border border-dashed border-border/50 hover:border-border"
            >
              <Plus className="w-3 h-3 mr-1" /> Add
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <Command>
              <CommandInput 
                placeholder="Search or create tag..." 
                value={inputValue}
                onValueChange={setInputValue}
              />
              <CommandList>
                <CommandEmpty className="p-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start text-xs h-8"
                    onClick={() => {
                      if (inputValue && !selectedTags.includes(inputValue)) {
                        toggleTag(inputValue);
                        setInputValue("");
                        setOpen(false);
                      }
                    }}
                  >
                    <Plus className="w-3 h-3 mr-2" />
                    Create "{inputValue}"
                  </Button>
                </CommandEmpty>
                <CommandGroup heading="Existing Tags">
                  {filteredTags.map((tag) => (
                    <CommandItem
                      key={tag}
                      onSelect={() => {
                        toggleTag(tag);
                        setOpen(false);
                      }}
                      className="text-xs"
                    >
                      {tag}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

interface TaskBoardProps {
  projectId: number;
  features: Feature[];
  bugs: Bug[];
  improvements: Improvement[];
}

export function TaskBoard({ projectId, features, bugs, improvements }: TaskBoardProps) {
  const [activeTab, setActiveTab] = useState<"features" | "improvements" | "bugs">("features");

  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    [...features, ...bugs, ...improvements].forEach(item => {
      item.tags?.forEach(tag => tagsSet.add(tag));
    });
    return Array.from(tagsSet).sort();
  }, [features, bugs, improvements]);

  const pendingFeatures = features.filter(i => i.status === "pending" || i.status === "open").length;
  const pendingImprovements = improvements.filter(i => i.status === "pending" || i.status === "open").length;
  const pendingBugs = bugs.filter(i => i.status === "pending" || i.status === "open").length;

  return (
    <div className="space-y-6">
      <div className="flex gap-2 border-b border-border/50 pb-1">
        <TabButton 
          active={activeTab === "features"} 
          onClick={() => setActiveTab("features")}
          count={pendingFeatures}
        >
          Features
        </TabButton>
        <TabButton 
          active={activeTab === "improvements"} 
          onClick={() => setActiveTab("improvements")}
          count={pendingImprovements}
          variant="info"
        >
          Improvements
        </TabButton>
        <TabButton 
          active={activeTab === "bugs"} 
          onClick={() => setActiveTab("bugs")}
          count={pendingBugs}
          variant="danger"
        >
          Bugs
        </TabButton>
      </div>

      <div className="min-h-[400px]">
        {activeTab === "features" && (
          <ItemList 
            projectId={projectId} 
            items={features} 
            type="feature"
            allTags={allTags}
          />
        )}
        {activeTab === "improvements" && (
          <ItemList 
            projectId={projectId} 
            items={improvements} 
            type="improvement"
            allTags={allTags}
          />
        )}
        {activeTab === "bugs" && (
          <ItemList 
            projectId={projectId} 
            items={bugs} 
            type="bug"
            allTags={allTags}
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
  type,
  allTags
}: { 
  projectId: number; 
  items: (Feature | Bug | Improvement)[]; 
  type: "feature" | "bug" | "improvement";
  allTags: string[];
}) {
  const [newItem, setNewItem] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isCompletedOpen, setIsCompletedOpen] = useState(false);
  
  const createFeature = useCreateFeature();
  const createBug = useCreateBug();
  const createImprovement = useCreateImprovement();

  const handleCreate = async () => {
    if (!newItem.trim()) return;
    
    try {
      if (type === "feature") {
        await createFeature.mutateAsync({ projectId, description: newItem, status: "pending", tags: selectedTags });
      } else if (type === "bug") {
        await createBug.mutateAsync({ projectId, description: newItem, status: "open", tags: selectedTags });
      } else {
        await createImprovement.mutateAsync({ projectId, description: newItem, status: "pending", tags: selectedTags });
      }
      setNewItem("");
      setSelectedTags([]);
      setIsAdding(false);
    } catch (e) {
      // Error handled by hook
    }
  };

  const pendingItems = items
    .filter(item => item.status === "pending" || item.status === "open")
    .sort((a, b) => (b.rank || 0) - (a.rank || 0));
  const completedItems = items
    .filter(item => item.status === "completed" || item.status === "fixed")
    .sort((a, b) => (b.rank || 0) - (a.rank || 0));

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
          className="flex flex-col gap-3 mb-4 p-4 bg-card/50 rounded-lg border border-border"
        >
          <Textarea 
            autoFocus
            placeholder={`Describe the ${type} (Markdown/bullets supported)...`}
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            className="min-h-[100px]"
          />
          <TagSelector 
            selectedTags={selectedTags} 
            onChange={setSelectedTags} 
            allTags={allTags}
          />
          <div className="flex justify-end gap-2 pt-1 border-t border-border/50">
            <Button size="sm" variant="ghost" onClick={() => {
              setIsAdding(false);
              setNewItem("");
              setSelectedTags([]);
            }}>Cancel</Button>
            <Button size="sm" onClick={handleCreate}>Save {type}</Button>
          </div>
        </motion.div>
      )}

      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {pendingItems.length === 0 && !isAdding ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="text-center py-12 text-muted-foreground bg-muted/5 rounded-xl border border-dashed border-border"
            >
              No active {type}s. Add one to get started!
            </motion.div>
          ) : (
            pendingItems.map((item) => (
              <TaskItem 
                key={item.id} 
                item={item} 
                type={type} 
                projectId={projectId}
                allTags={allTags}
              />
            ))
          )}
        </AnimatePresence>

        {completedItems.length > 0 && (
          <Collapsible
            open={isCompletedOpen}
            onOpenChange={setIsCompletedOpen}
            className="pt-4"
          >
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full justify-between px-2 text-muted-foreground hover:text-foreground">
                <span className="flex items-center gap-2">
                  {isCompletedOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  Completed {type}s ({completedItems.length})
                </span>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 mt-2">
              <AnimatePresence mode="popLayout">
                {completedItems.map((item) => (
                  <TaskItem 
                    key={item.id} 
                    item={item} 
                    type={type} 
                    projectId={projectId} 
                    allTags={allTags}
                  />
                ))}
              </AnimatePresence>
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>
    </div>
  );
}

function TaskItem({ 
  item, 
  type, 
  projectId,
  allTags
}: { 
  item: Feature | Bug | Improvement; 
  type: "feature" | "bug" | "improvement"; 
  projectId: number;
  allTags: string[];
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(item.description);
  const [editRank, setEditRank] = useState(String(item.rank || 0));
  const [editTags, setEditTags] = useState<string[]>(item.tags || []);

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
    const rankNum = parseInt(editRank) || 0;
    
    if (editValue.trim() !== item.description || rankNum !== item.rank || JSON.stringify(editTags) !== JSON.stringify(item.tags || [])) {
      if (type === "feature") {
        updateFeature.mutate({ id: item.id, projectId, description: editValue, rank: rankNum, tags: editTags });
      } else if (type === "bug") {
        updateBug.mutate({ id: item.id, projectId, description: editValue, rank: rankNum, tags: editTags });
      } else {
        updateImprovement.mutate({ id: item.id, projectId, description: editValue, rank: rankNum, tags: editTags });
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
        ${isCompleted ? "bg-muted/5 border-transparent opacity-80" : "bg-card border-border/50 hover:border-border hover:shadow-md"}
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
          <div className="flex flex-col gap-3">
            <div className="flex gap-2 items-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Rank</span>
              <Input 
                type="number"
                value={editRank}
                onChange={(e) => setEditRank(e.target.value)}
                className="w-20 h-7 text-xs bg-background/50"
              />
            </div>
            <Textarea 
              value={editValue} 
              onChange={(e) => setEditValue(e.target.value)}
              autoFocus
              className="min-h-[80px] text-sm"
            />
            <TagSelector 
              selectedTags={editTags} 
              onChange={setEditTags} 
              allTags={allTags}
            />
            <div className="flex justify-end gap-2 pt-1 border-t border-border/50">
              <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)} className="h-8">Cancel</Button>
              <Button size="sm" onClick={handleUpdateText} className="h-8">Save Changes</Button>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <Badge variant="outline" className="text-[10px] h-4 px-1.5 font-mono border-border/50 bg-muted/30">
                  Rank: {item.rank || 0}
                </Badge>
                {item.tags?.map((tag, idx) => (
                  <Badge key={idx} variant="secondary" className="text-[10px] h-4 px-1.5 bg-primary/5 text-primary/70 border-primary/20">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className={`text-sm whitespace-pre-wrap ${isCompleted ? "line-through text-muted-foreground" : "text-foreground"}`}>
                {item.description}
              </div>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
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
