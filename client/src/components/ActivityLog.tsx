import { useActivities } from "@/hooks/use-projects";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Loader2,
  History,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Edit3,
} from "lucide-react";

// Type definitions
interface Activity {
  id: number;
  projectId: number;
  type: "create" | "update" | "delete" | "status_change";
  entity: "project" | "feature" | "bug" | "improvement";
  entityId?: number;
  description: string;
  createdAt?: string;
}

export function ActivityLog({ projectId }: { projectId: number }) {
  const { data: activities, isLoading } = useActivities(projectId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "create":
        return <PlusCircle className="w-4 h-4 text-emerald-400" />;
      case "update":
        return <Edit3 className="w-4 h-4 text-blue-400" />;
      case "delete":
        return <Trash2 className="w-4 h-4 text-red-400" />;
      case "status_change":
        return <CheckCircle2 className="w-4 h-4 text-purple-400" />;
      default:
        return <History className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <h3 className="text-lg font-display font-semibold flex items-center gap-2 shrink-0">
        <History className="w-5 h-5 text-primary" /> Activity Log
      </h3>

      <div
        className="relative space-y-4 overflow-y-auto pr-2 flex-1
    before:absolute before:inset-0 before:ml-2 before:-translate-x-px
    before:h-full before:w-0.5 before:bg-gradient-to-b
    before:from-border before:via-border/50 before:to-transparent"
      >
        {activities?.map((activity: any) => (
          <div key={activity.id} className="relative pl-8">
            <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-background border-2 border-border flex items-center justify-center -translate-x-0.5">
              {getIcon(activity.type)}
            </div>
            <div className="bg-card/30 border border-border/50 rounded-lg p-3 hover:bg-card/50 transition-colors">
              <div className="text-sm text-foreground mb-1">
                {activity.description}
              </div>
              <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                {format(
                  new Date(activity.createdAt || new Date()),
                  "MMM d, yyyy • h:mm a",
                )}
              </div>
            </div>
          </div>
        ))}

        {(!activities || activities.length === 0) && (
          <div className="text-sm text-muted-foreground italic pl-8">
            No activities recorded yet.
          </div>
        )}
      </div>
    </div>
  );
}
