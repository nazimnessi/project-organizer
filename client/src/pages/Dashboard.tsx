import { useState } from "react";
import { Link, useRoute } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useProjects, useProject, useDeleteProject, useCreateProject, useUpdateProject } from "@/hooks/use-projects";
import { 
  Loader2, LogOut, Plus, Search, Github, Globe, Server, User, 
  Key, Box, ChevronRight, LayoutGrid, Settings, AlertCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectForm } from "@/components/ProjectForm";
import { TaskBoard } from "@/components/TaskBoard";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { data: projects, isLoading } = useProjects();
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  const createProject = useCreateProject();

  const filteredProjects = projects?.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const handleCreate = async (data: any) => {
    await createProject.mutateAsync(data);
    setIsCreateOpen(false);
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!projects || projects.length === 0 && !isLoading) {
    // If it's an error state from the API (e.g. 500), React Query usually handles it via isError,
    // but the user wants a specific "something went wrong" page if it's not 200.
    // The current template uses a simple projects check.
  }

  const isError = !projects && !isLoading;

  if (isError) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-background p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-display font-bold mb-2">Something went wrong</h2>
        <p className="text-muted-foreground max-w-md mb-8">
          We encountered an error while trying to load your projects. Please try refreshing the page or check back later.
        </p>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-80 border-r border-border/50 bg-card/30 flex flex-col hidden md:flex">
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/20">
              <Box className="w-5 h-5 text-primary" />
            </div>
            <span className="font-display font-bold text-lg">Project Hub</span>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search projects..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-background/50 border-border/50 focus:bg-background"
            />
          </div>
        </div>

        <ScrollArea className="flex-1 px-3 py-4">
          <div className="space-y-1">
            <Button 
              variant={selectedProjectId === null ? "secondary" : "ghost"} 
              className="w-full justify-start font-medium"
              onClick={() => setSelectedProjectId(null)}
            >
              <LayoutGrid className="w-4 h-4 mr-2" /> All Projects
            </Button>
            
            <div className="pt-4 pb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Your Projects
            </div>
            
            {filteredProjects.map((project) => (
              <Button
                key={project.id}
                variant={selectedProjectId === project.id ? "secondary" : "ghost"}
                className="w-full justify-start truncate"
                onClick={() => setSelectedProjectId(project.id)}
              >
                <div className={`w-2 h-2 rounded-full mr-2 ${selectedProjectId === project.id ? "bg-primary" : "bg-muted-foreground/30"}`} />
                {project.name}
              </Button>
            ))}
            
            {filteredProjects.length === 0 && (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                No projects found
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-border/50">
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="w-full shadow-lg shadow-primary/20">
                <Plus className="w-4 h-4 mr-2" /> New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
              </DialogHeader>
              <ProjectForm 
                onSubmit={handleCreate} 
                isSubmitting={createProject.isPending} 
              />
            </DialogContent>
          </Dialog>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border/50 px-6 flex items-center justify-between bg-background/80 backdrop-blur-md">
          <div className="md:hidden font-display font-bold">Project Hub</div>
          <div className="flex items-center gap-4 ml-auto">
            <span className="text-sm text-muted-foreground hidden sm:block">
              Welcome back, {user?.firstName || "Developer"}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9 border border-border">
                    <AvatarImage src={user?.profileImageUrl || undefined} alt={user?.firstName || "User"} />
                    <AvatarFallback>{(user?.firstName?.[0] || "U")}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem className="text-red-500 cursor-pointer" onClick={() => logout()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <ScrollArea className="flex-1 bg-background/50">
          <div className="p-6 md:p-10 max-w-6xl mx-auto">
            <AnimatePresence mode="wait">
              {selectedProjectId ? (
                <ProjectDetails key={selectedProjectId} id={selectedProjectId} onBack={() => setSelectedProjectId(null)} />
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredProjects.map((project) => (
                    <ProjectCard 
                      key={project.id} 
                      project={project} 
                      onClick={() => setSelectedProjectId(project.id)} 
                    />
                  ))}
                  
                  {/* Empty state add button */}
                  <button 
                    onClick={() => setIsCreateOpen(true)}
                    className="flex flex-col items-center justify-center p-8 h-full min-h-[200px] border border-dashed border-border rounded-xl text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-full bg-muted/50 group-hover:bg-primary/10 flex items-center justify-center mb-4 transition-colors">
                      <Plus className="w-6 h-6" />
                    </div>
                    <span className="font-medium">Create New Project</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}

function ProjectCard({ project, onClick }: { project: any, onClick: () => void }) {
  const pendingFeaturesList = project?.features?.filter((i: any) => i.status === "pending" || i.status === "open") || [];
  const pendingImprovementsList = project?.improvements?.filter((i: any) => i.status === "pending" || i.status === "open") || [];
  const pendingBugsList = project?.bugs?.filter((i: any) => i.status === "pending" || i.status === "open") || [];
  const [hoveredType, setHoveredType] = useState<"features" | "improvements" | "bugs" | null>(null);

  if (!project) return null;

  return (
    <motion.div 
      whileHover={{ y: -4, shadow: "0 10px 30px -10px rgba(0,0,0,0.3)" }}
      onClick={onClick}
      className="bg-card border border-border/50 rounded-xl p-6 cursor-pointer hover:border-primary/50 transition-all shadow-lg shadow-black/5 flex flex-col h-full relative group/card overflow-hidden"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-display font-semibold line-clamp-1">{project.name}</h3>
        <ChevronRight className="w-5 h-5 text-muted-foreground" />
      </div>
      <div className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-1">
        <div className="prose prose-xs prose-invert max-w-none">
          <ReactMarkdown>{project.description || "No description provided."}</ReactMarkdown>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2 border-t border-border/50 pt-4">
          <Badge 
            variant="outline" 
            onMouseEnter={() => setHoveredType("features")}
            onMouseLeave={() => setHoveredType(null)}
            className="flex items-center gap-1.5 text-[10px] py-0 h-5 bg-blue-500/5 text-blue-400 border-blue-500/20 hover:bg-blue-500/10 transition-colors"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            {pendingFeaturesList.length} Features
          </Badge>
          <Badge 
            variant="outline" 
            onMouseEnter={() => setHoveredType("improvements")}
            onMouseLeave={() => setHoveredType(null)}
            className="flex items-center gap-1.5 text-[10px] py-0 h-5 bg-purple-500/5 text-purple-400 border-purple-500/20 hover:bg-purple-500/10 transition-colors"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
            {pendingImprovementsList.length} Improvements
          </Badge>
          <Badge 
            variant="outline" 
            onMouseEnter={() => setHoveredType("bugs")}
            onMouseLeave={() => setHoveredType(null)}
            className="flex items-center gap-1.5 text-[10px] py-0 h-5 bg-red-500/5 text-red-400 border-red-500/20 hover:bg-red-500/10 transition-colors"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
            {pendingBugsList.length} Bugs
          </Badge>
        </div>

        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${hoveredType ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
          {hoveredType === "features" && pendingFeaturesList.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Pending Features</h4>
              <ul className="space-y-1">
                {pendingFeaturesList.slice(0, 3).map((item: any) => (
                  <li key={item.id} className="text-[11px] text-foreground border-l-2 border-blue-500 pl-2 line-clamp-1">{item.description}</li>
                ))}
              </ul>
            </div>
          )}
          {hoveredType === "improvements" && pendingImprovementsList.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Pending Improvements</h4>
              <ul className="space-y-1">
                {pendingImprovementsList.slice(0, 3).map((item: any) => (
                  <li key={item.id} className="text-[11px] text-foreground border-l-2 border-purple-500 pl-2 line-clamp-1">{item.description}</li>
                ))}
              </ul>
            </div>
          )}
          {hoveredType === "bugs" && pendingBugsList.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Active Bugs</h4>
              <ul className="space-y-1">
                {pendingBugsList.slice(0, 3).map((item: any) => (
                  <li key={item.id} className="text-[11px] text-foreground border-l-2 border-red-500 pl-2 line-clamp-1">{item.description}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

import { ActivityLog } from "@/components/ActivityLog";

function ProjectDetails({ id, onBack }: { id: number, onBack: () => void }) {
  const { data: project, isLoading } = useProject(id);
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"classic" | "modern">("modern");

  if (isLoading || !project) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleUpdate = async (formData: any) => {
    console.log("Form data before cleaning:", formData);
    // Ensure we only send the fields that insertProjectSchema expects
    const { 
      features, bugs, improvements, activities, createdAt, userId, id: _, 
      ...validData 
    } = formData;
    
    const finalData = {
      ...validData,
      setupSteps: Array.isArray(formData.setupSteps) ? formData.setupSteps : []
    };
    
    console.log("Sending payload to mutation:", finalData);
    await updateProject.mutateAsync({ id, ...finalData });
    setIsEditOpen(false);
  };

  const handleDelete = async () => {
    await deleteProject.mutateAsync(id);
    onBack();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Header & Controls */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 w-fit transition-colors">
            <ChevronRight className="w-4 h-4 rotate-180" /> Back to dashboard
          </button>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-muted/50 rounded-lg p-1 mr-2 border border-border/50">
              <Button 
                variant={viewMode === "classic" ? "secondary" : "ghost"} 
                size="sm" 
                className="h-7 text-[10px] uppercase tracking-wider font-bold"
                onClick={() => setViewMode("classic")}
              >
                Classic
              </Button>
              <Button 
                variant={viewMode === "modern" ? "secondary" : "ghost"} 
                size="sm" 
                className="h-7 text-[10px] uppercase tracking-wider font-bold"
                onClick={() => setViewMode("modern")}
              >
                Modern
              </Button>
            </div>

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  <Settings className="w-3.5 h-3.5 mr-2" /> Settings
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Project</DialogTitle>
                </DialogHeader>
                <ProjectForm 
                  defaultValues={{
                    ...project,
                    setupSteps: project.setupSteps || []
                  } as any} 
                  onSubmit={handleUpdate} 
                  isSubmitting={updateProject.isPending} 
                />
              </DialogContent>
            </Dialog>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="h-8">
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the project
                    and all associated tasks.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete Project
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="flex justify-between items-start gap-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-display font-bold tracking-tight">{project.name}</h1>
            <div className="mt-2 text-muted-foreground leading-relaxed">
              <div className="prose prose-sm prose-invert max-w-none">
                <ReactMarkdown>{project.description || ""}</ReactMarkdown>
              </div>
            </div>
          </div>
          
          <div className="hidden sm:flex flex-wrap gap-2 max-w-[300px] justify-end">
            {project.productionLink && (
              <Button size="sm" variant="outline" className="h-8 gap-2 rounded-full" asChild>
                <a href={project.productionLink} target="_blank" rel="noopener noreferrer">
                  <Globe className="w-3 h-3 text-emerald-400" /> Live App
                </a>
              </Button>
            )}
            {project.repoLink && (
              <Button size="sm" variant="outline" className="h-8 gap-2 rounded-full" asChild>
                <a href={project.repoLink} target="_blank" rel="noopener noreferrer">
                  <Github className="w-3 h-3" /> Source
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === "modern" ? (
          <motion.div 
            key="modern"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Main Content Area - 8 columns */}
            <div className="lg:col-span-8 space-y-8">
              <Tabs defaultValue="backlog" className="w-full">
                <TabsList className="bg-muted/30 p-1 border border-border/50 mb-6">
                  <TabsTrigger value="backlog" className="text-xs uppercase tracking-widest px-6">Backlog</TabsTrigger>
                  <TabsTrigger value="setup" className="text-xs uppercase tracking-widest px-6">Setup</TabsTrigger>
                  <TabsTrigger value="technical" className="text-xs uppercase tracking-widest px-6">Docs</TabsTrigger>
                </TabsList>
                
                <TabsContent value="backlog" className="mt-0 space-y-6">
                  <div className="bg-card/30 border border-border/50 rounded-xl p-1 overflow-hidden">
                    <TaskBoard 
                      projectId={project.id} 
                      features={project.features} 
                      bugs={project.bugs} 
                      improvements={project.improvements} 
                    />
                  </div>
                </TabsContent>

                <TabsContent value="setup" className="mt-0">
                  <div className="bg-card/30 border border-border/50 rounded-xl p-8 space-y-8">
                    <div className="flex items-center gap-3 border-b border-border/50 pb-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <Box className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Running Instructions</h3>
                        <p className="text-xs text-muted-foreground">Follow these steps to get the project up and running locally.</p>
                      </div>
                    </div>

                    {project.setupSteps && project.setupSteps.length > 0 ? (
                      <div className="space-y-8 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-[1px] before:bg-border/50">
                        {project.setupSteps.map((step: string, index: number) => (
                          <div key={index} className="relative pl-12 group">
                            <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-background border border-border/50 flex items-center justify-center text-[10px] font-bold text-muted-foreground group-hover:border-primary group-hover:text-primary transition-colors z-10">
                              {index + 1}
                            </div>
                            <div className="space-y-1">
                              <div className="text-[10px] font-bold uppercase tracking-widest text-primary/70">
                                Step {index + 1}
                              </div>
                              <div className="text-sm text-foreground leading-relaxed font-mono bg-muted/20 p-3 rounded-lg border border-border/30">
                                {step}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-12 text-center border border-dashed border-border rounded-xl">
                        <p className="text-sm text-muted-foreground">No setup instructions provided.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="technical" className="mt-0 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-card/30 border border-border/50 rounded-xl p-6 space-y-4">
                      <div className="flex items-center gap-2 text-purple-400">
                        <LayoutGrid className="w-4 h-4" />
                        <h4 className="font-semibold text-sm uppercase tracking-wider">Frontend</h4>
                      </div>
                      <div className="prose prose-sm prose-invert max-w-none text-muted-foreground min-h-[100px]">
                        <ReactMarkdown components={{ p: ({ children }) => <div className="mb-4 last:mb-0">{children}</div> }}>{project.frontendDetails || "No frontend details documented."}</ReactMarkdown>
                      </div>
                    </div>
                    <div className="bg-card/30 border border-border/50 rounded-xl p-6 space-y-4">
                      <div className="flex items-center gap-2 text-blue-400">
                        <Server className="w-4 h-4" />
                        <h4 className="font-semibold text-sm uppercase tracking-wider">Backend</h4>
                      </div>
                      <div className="prose prose-sm prose-invert max-w-none text-muted-foreground min-h-[100px]">
                        <ReactMarkdown components={{ p: ({ children }) => <div className="mb-4 last:mb-0">{children}</div> }}>{project.backendDetails || "No backend details documented."}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar Area - 4 columns */}
            <div className="lg:col-span-4 space-y-6">
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/70 px-1">Private Access</h4>
                <div className="space-y-3">
                  <PrivateDetailCard 
                    title="Environment" 
                    icon={<Server className="w-3.5 h-3.5" />}
                    content={project.envDetails} 
                    placeholder="None"
                  />
                  <PrivateDetailCard 
                    title="Test Accounts" 
                    icon={<User className="w-3.5 h-3.5" />}
                    content={project.testUserDetails} 
                    placeholder="None"
                  />
                  <PrivateDetailCard 
                    title="Authentication" 
                    icon={<Key className="w-3.5 h-3.5" />}
                    content={project.authDetails} 
                    placeholder="None"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/70 px-1">Recent Activity</h4>
                <div className="bg-card/30 border border-border/50 rounded-xl p-4 overflow-hidden max-h-[400px]">
                  <ActivityLog projectId={project.id} />
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="classic"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            {/* Classic View Layout (Original full page view) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {project.productionLink && (
                <LinkCard href={project.productionLink} icon={<Globe className="w-5 h-5 text-emerald-400" />} label="Production" />
              )}
              {project.repoLink && (
                <LinkCard href={project.repoLink} icon={<Github className="w-5 h-5 text-foreground" />} label="Repository" />
              )}
              {project.backendLink && (
                <LinkCard href={project.backendLink} icon={<Server className="w-5 h-5 text-blue-400" />} label="Backend" />
              )}
              {project.frontendLink && (
                <LinkCard href={project.frontendLink} icon={<LayoutGrid className="w-5 h-5 text-purple-400" />} label="Frontend" />
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {(project.frontendDetails || project.backendDetails) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {project.frontendDetails && (
                      <div className="bg-card/50 border border-border/50 rounded-xl p-6">
                        <h3 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
                          <LayoutGrid className="w-4 h-4 text-purple-400" /> Frontend Details
                        </h3>
                        <div className="prose prose-sm prose-invert max-w-none text-muted-foreground">
                          <ReactMarkdown>{project.frontendDetails}</ReactMarkdown>
                        </div>
                      </div>
                    )}
                    {project.backendDetails && (
                      <div className="bg-card/50 border border-border/50 rounded-xl p-6">
                        <h3 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
                          <Server className="w-4 h-4 text-blue-400" /> Backend Details
                        </h3>
                        <div className="prose prose-sm prose-invert max-w-none text-muted-foreground">
                          <ReactMarkdown>{project.backendDetails}</ReactMarkdown>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="bg-card/50 border border-border/50 rounded-xl p-6">
                  <TaskBoard 
                    projectId={project.id} 
                    features={project.features} 
                    bugs={project.bugs} 
                    improvements={project.improvements} 
                  />
                </div>

                {project.setupSteps && project.setupSteps.length > 0 && (
                  <div className="bg-card/50 border border-border/50 rounded-xl p-6">
                    <h3 className="text-lg font-display font-semibold mb-6 flex items-center gap-2">
                      <Box className="w-4 h-4 text-primary" /> Setup & Running Instructions
                    </h3>
                    <div className="space-y-6">
                      {project.setupSteps.map((step: string, index: number) => (
                        <div key={index} className="space-y-2">
                          <div className="text-[10px] font-bold uppercase tracking-widest text-primary/70">
                            Step {index + 1}
                          </div>
                          <div className="text-sm text-foreground leading-relaxed pl-0">
                            {step}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <PrivateDetailCard 
                  title="Environment Variables" 
                  icon={<Server className="w-4 h-4" />}
                  content={project.envDetails} 
                  placeholder="No environment details saved."
                />
                
                <PrivateDetailCard 
                  title="Test Users" 
                  icon={<User className="w-4 h-4" />}
                  content={project.testUserDetails} 
                  placeholder="No test users saved."
                />
                
                <PrivateDetailCard 
                  title="Auth Credentials" 
                  icon={<Key className="w-4 h-4" />}
                  content={project.authDetails} 
                  placeholder="No auth details saved."
                />

                <div className="bg-card/50 border border-border/50 rounded-xl p-6">
                  <ActivityLog projectId={project.id} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function LinkCard({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-4 rounded-lg border border-border/50 bg-card hover:border-primary/50 hover:bg-card/80 transition-all hover:-translate-y-0.5"
    >
      <div className="p-2 rounded-md bg-background border border-border/50">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-0.5">{label}</div>
        <div className="text-sm font-medium truncate">{new URL(href).hostname}</div>
      </div>
    </a>
  );
}

function PrivateDetailCard({ title, icon, content, placeholder }: { title: string, icon: React.ReactNode, content: string | null, placeholder: string }) {
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <div className="bg-card border border-border/50 rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-border/50 bg-muted/20 flex items-center justify-between">
        <div className="flex items-center gap-2 font-medium text-sm">
          {icon} {title}
        </div>
        <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => setIsRevealed(!isRevealed)}>
          {isRevealed ? "Hide" : "Reveal"}
        </Button>
      </div>
      <div className="p-4 bg-black/20 relative min-h-[100px]">
        {content ? (
          <pre className={`text-xs font-mono text-muted-foreground whitespace-pre-wrap ${!isRevealed ? "blur-sm select-none" : ""}`}>
            {content}
          </pre>
        ) : (
          <div className="text-xs text-muted-foreground italic">{placeholder}</div>
        )}
        
        {!isRevealed && content && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-medium text-foreground bg-background/80 px-3 py-1 rounded-full border border-border backdrop-blur-sm">
              Hidden for security
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
