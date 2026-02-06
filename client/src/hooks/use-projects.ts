import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";
import axios from "@/AxiosClient";

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await axios.get("/api/projects/");
      return res.data.results;
    },
  });
}

export function useProject(id: number) {
  return useQuery({
    queryKey: ["projects", id],
    queryFn: async () => {
      const res = await axios.get(`/api/projects/${id}`);
      return res.data;
    },
  });
}
export function useCreateProject() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationKey: ["createProject"],
    mutationFn: async (data: any) => {
      const res = await axios.post("/api/projects/", data);
      return res.data;
    },
    onSuccess: (newProject) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast({ title: "Success", description: "Project created successfully" });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useUpdateProject(id: number) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationKey: ["updateProject", id],

    mutationFn: async (data: any) => {
      const res = await axios.put(`/api/projects/${id}/`, data);
      return res.data;
    },
    onSuccess: (updatedProject) => {
      queryClient.invalidateQueries({ queryKey: ["projects"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["activities"], exact: false });
      toast({ title: "Updated", description: "Project updated successfully" });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useDeleteProject(id: number) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationKey: ["deleteProject", id],
    mutationFn: async () => {
      const res = await axios.delete(`/api/projects/${id}/`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["activities"], exact: false });
      toast({ title: "Deleted", description: "Project removed successfully" });
    },
  });
}

export function useCreateFeature() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationKey: ["createFeature"],
    mutationFn: async (data: any) => {
      const res = await axios.post("/api/features/", data);
      return res.data;
    },
    onSuccess: (newFeature) => {
      queryClient.invalidateQueries({ queryKey: ["projects"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["activities"], exact: false });
      toast({ title: "Created", description: "Feature created successfully" });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useUpdateFeature() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationKey: ["updateFeature"],
    mutationFn: async (data: any) => {
      const isStatusChange = data.isStatusChange || false;
      const res = await axios.put(
        `/api/features/${data.id}/${isStatusChange ? "update-status/" : ""}`,
        data,
      );
      return res.data;
    },
    onSuccess: (updatedFeature) => {
      queryClient.invalidateQueries({ queryKey: ["projects"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["activities"], exact: false });
      toast({ title: "Updated", description: "Feature updated successfully" });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useDeleteFeature() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationKey: ["deleteFeature"],
    mutationFn: async (id: number) => {
      const res = await axios.delete(`/api/features/${id}/`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["activities"], exact: false });
      toast({ title: "Deleted", description: "Feature removed successfully" });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useCreateBug() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationKey: ["createBug"],
    mutationFn: async (data: any) => {
      const res = await axios.post("/api/bugs/", data);
      return res.data;
    },
    onSuccess: (newBug) => {
      queryClient.invalidateQueries({ queryKey: ["projects"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["activities"], exact: false });
      toast({ title: "Created", description: "Bug created successfully" });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useUpdateBug() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationKey: ["updateBug"],
    mutationFn: async (data: any) => {
      const isStatusChange = data.isStatusChange || false;
      const res = await axios.put(
        `/api/bugs/${data.id}/${isStatusChange ? "update-status/" : ""}`,
        data,
      );
      return res.data;
    },
    onSuccess: (updatedBug) => {
      queryClient.invalidateQueries({ queryKey: ["projects"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["activities"], exact: false });
      toast({ title: "Updated", description: "Bug updated successfully" });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useDeleteBug() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationKey: ["deleteBug"],
    mutationFn: async (id: number) => {
      const res = await axios.delete(`/api/bugs/${id}/`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["activities"], exact: false });
      toast({ title: "Deleted", description: "Bug removed successfully" });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useCreateImprovement() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationKey: ["createImprovement"],
    mutationFn: async (data: any) => {
      const res = await axios.post("/api/improvements/", data);
      return res.data;
    },
    onSuccess: (newImprovement) => {
      queryClient.invalidateQueries({ queryKey: ["projects"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["activities"], exact: false });
      toast({
        title: "Created",
        description: "Improvement created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useUpdateImprovement() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationKey: ["updateImprovement"],
    mutationFn: async (data: any) => {
      const isStatusChange = data.isStatusChange || false;
      const res = await axios.put(
        `/api/improvements/${data.id}/${isStatusChange ? "update-status/" : ""}`,
        data,
      );
      return res.data;
    },
    onSuccess: (updatedImprovement) => {
      queryClient.invalidateQueries({ queryKey: ["projects"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["activities"], exact: false });
      toast({
        title: "Updated",
        description: "Improvement updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useDeleteImprovement() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationKey: ["deleteImprovement"],
    mutationFn: async (id: number) => {
      const res = await axios.delete(`/api/improvements/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["activities"], exact: false });
      toast({
        title: "Deleted",
        description: "Improvement removed successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useActivities(projectId: number) {
  return useQuery({
    queryKey: ["activities", projectId],

    queryFn: async () => {
      const res = await axios.get(`/api/projects/${projectId}/activities/`);
      return res.data;
    },
  });
}
