import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { 
  CreateProjectRequest, 
  UpdateProjectRequest, 
  InsertFeature, 
  InsertBug, 
  InsertImprovement 
} from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

// ==========================================
// PROJECTS
// ==========================================

export function useProjects() {
  return useQuery({
    queryKey: [api.projects.list.path],
    queryFn: async () => {
      const res = await fetch(api.projects.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch projects");
      return api.projects.list.responses[200].parse(await res.json());
    },
  });
}

export function useProject(id: number) {
  return useQuery({
    queryKey: [api.projects.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.projects.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch project");
      return api.projects.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateProjectRequest) => {
      const res = await fetch(api.projects.create.path, {
        method: api.projects.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create project");
      }
      return api.projects.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.projects.list.path] });
      toast({ title: "Success", description: "Project created successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...data }: { id: number } & UpdateProjectRequest) => {
      const url = buildUrl(api.projects.update.path, { id });
      const res = await fetch(url, {
        method: api.projects.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to update project");
      return api.projects.update.responses[200].parse(await res.json());
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [api.projects.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.projects.get.path, id] });
      toast({ title: "Success", description: "Project updated" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.projects.delete.path, { id });
      const res = await fetch(url, { 
        method: api.projects.delete.method,
        credentials: "include" 
      });
      if (!res.ok) throw new Error("Failed to delete project");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.projects.list.path] });
      toast({ title: "Deleted", description: "Project removed successfully" });
    },
  });
}

// ==========================================
// FEATURES
// ==========================================

export function useCreateFeature() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ projectId, ...data }: InsertFeature) => {
      const url = buildUrl(api.features.create.path, { projectId });
      const res = await fetch(url, {
        method: api.features.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to add feature");
      return api.features.create.responses[201].parse(await res.json());
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: [api.projects.get.path, projectId] });
      toast({ title: "Added", description: "Feature added to backlog" });
    },
  });
}

export function useUpdateFeature() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, projectId, ...data }: { id: number; projectId: number } & Partial<InsertFeature>) => {
      const url = buildUrl(api.features.update.path, { id });
      const res = await fetch(url, {
        method: api.features.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update feature");
      return api.features.update.responses[200].parse(await res.json());
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: [api.projects.get.path, projectId] });
      toast({ title: "Updated", description: "Feature updated" });
    },
  });
}

export function useDeleteFeature() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, projectId }: { id: number; projectId: number }) => {
      const url = buildUrl(api.features.delete.path, { id });
      const res = await fetch(url, { 
        method: api.features.delete.method,
        credentials: "include" 
      });
      if (!res.ok) throw new Error("Failed to delete feature");
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: [api.projects.get.path, projectId] });
      toast({ title: "Deleted", description: "Feature removed" });
    },
  });
}

// ==========================================
// BUGS
// ==========================================

export function useCreateBug() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ projectId, ...data }: InsertBug) => {
      const url = buildUrl(api.bugs.create.path, { projectId });
      const res = await fetch(url, {
        method: api.bugs.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to report bug");
      return api.bugs.create.responses[201].parse(await res.json());
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: [api.projects.get.path, projectId] });
      toast({ title: "Reported", description: "Bug report added" });
    },
  });
}

export function useUpdateBug() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, projectId, ...data }: { id: number; projectId: number } & Partial<InsertBug>) => {
      const url = buildUrl(api.bugs.update.path, { id });
      const res = await fetch(url, {
        method: api.bugs.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update bug");
      return api.bugs.update.responses[200].parse(await res.json());
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: [api.projects.get.path, projectId] });
      toast({ title: "Updated", description: "Bug status updated" });
    },
  });
}

export function useDeleteBug() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, projectId }: { id: number; projectId: number }) => {
      const url = buildUrl(api.bugs.delete.path, { id });
      const res = await fetch(url, { 
        method: api.bugs.delete.method,
        credentials: "include" 
      });
      if (!res.ok) throw new Error("Failed to delete bug");
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: [api.projects.get.path, projectId] });
      toast({ title: "Deleted", description: "Bug report removed" });
    },
  });
}

// ==========================================
// IMPROVEMENTS
// ==========================================

export function useCreateImprovement() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ projectId, ...data }: InsertImprovement) => {
      const url = buildUrl(api.improvements.create.path, { projectId });
      const res = await fetch(url, {
        method: api.improvements.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to add improvement");
      return api.improvements.create.responses[201].parse(await res.json());
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: [api.projects.get.path, projectId] });
      toast({ title: "Added", description: "Improvement suggestion added" });
    },
  });
}

export function useUpdateImprovement() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, projectId, ...data }: { id: number; projectId: number } & Partial<InsertImprovement>) => {
      const url = buildUrl(api.improvements.update.path, { id });
      const res = await fetch(url, {
        method: api.improvements.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update improvement");
      return api.improvements.update.responses[200].parse(await res.json());
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: [api.projects.get.path, projectId] });
      toast({ title: "Updated", description: "Improvement updated" });
    },
  });
}

export function useDeleteImprovement() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, projectId }: { id: number; projectId: number }) => {
      const url = buildUrl(api.improvements.delete.path, { id });
      const res = await fetch(url, { 
        method: api.improvements.delete.method,
        credentials: "include" 
      });
      if (!res.ok) throw new Error("Failed to delete improvement");
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: [api.projects.get.path, projectId] });
      toast({ title: "Deleted", description: "Improvement removed" });
    },
  });
}
