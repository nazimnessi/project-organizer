import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProjectSchema, type InsertProject } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Plus, X, Globe, Github, Server, LayoutGrid, Key, User, Info, ListOrdered } from "lucide-react";

interface ProjectFormProps {
  defaultValues?: Partial<InsertProject>;
  onSubmit: (data: InsertProject) => void;
  isSubmitting: boolean;
}

export function ProjectForm({ defaultValues, onSubmit, isSubmitting }: ProjectFormProps) {
  const form = useForm<InsertProject>({
    resolver: zodResolver(insertProjectSchema),
    defaultValues: {
      name: "",
      description: "",
      productionLink: "",
      repoLink: "",
      frontendLink: "",
      backendLink: "",
      frontendDetails: "",
      backendDetails: "",
      envDetails: "",
      testUserDetails: "",
      authDetails: "",
      setupSteps: [],
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <Info className="w-4 h-4" /> <span className="hidden sm:inline">Basic</span>
            </TabsTrigger>
            <TabsTrigger value="technical" className="flex items-center gap-2">
              <LayoutGrid className="w-4 h-4" /> <span className="hidden sm:inline">Details</span>
            </TabsTrigger>
            <TabsTrigger value="setup" className="flex items-center gap-2">
              <ListOrdered className="w-4 h-4" /> <span className="hidden sm:inline">Setup</span>
            </TabsTrigger>
            <TabsTrigger value="private" className="flex items-center gap-2">
              <Key className="w-4 h-4" /> <span className="hidden sm:inline">Private</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Finance Tracker" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Markdown)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="What does this project do?" className="h-32" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <FormField
                control={form.control}
                name="productionLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Globe className="w-3 h-3 text-emerald-400" /> Production URL
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="repoLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Github className="w-3 h-3" /> Repository URL
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="https://github.com/..." {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>

          <TabsContent value="technical" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="frontendLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <LayoutGrid className="w-3 h-3 text-purple-400" /> Frontend URL
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="backendLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Server className="w-3 h-3 text-blue-400" /> Backend URL
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="frontendDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frontend Details (Markdown)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Architecture, components, styling..." className="h-24" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="backendDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Backend Details (Markdown)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="API, storage, database, security..." className="h-24" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="setup" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <FormLabel className="text-base">Running Instructions</FormLabel>
                  <FormDescription>Step-by-step guide to get the project running.</FormDescription>
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    const currentSteps = form.getValues("setupSteps") || [];
                    form.setValue("setupSteps", [...currentSteps, ""]);
                  }}
                >
                  <Plus className="w-3 h-3 mr-1" /> Add Step
                </Button>
              </div>
              
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {(form.watch("setupSteps") || []).map((_, index) => (
                  <div key={index} className="flex gap-2 group items-start">
                    <div className="flex-none w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary mt-2">
                      {index + 1}
                    </div>
                    <FormField
                      control={form.control}
                      name={`setupSteps.${index}`}
                      render={({ field }) => (
                        <FormItem className="flex-1 space-y-0">
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder={`Step ${index + 1}: e.g. npm install...`}
                              className="bg-background/50 h-10"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 h-10 w-10 text-muted-foreground hover:text-destructive transition-opacity"
                      onClick={() => {
                        const currentSteps = form.getValues("setupSteps") || [];
                        form.setValue("setupSteps", currentSteps.filter((_, i) => i !== index));
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                
                {(!form.watch("setupSteps") || (form.watch("setupSteps")?.length ?? 0) === 0) && (
                  <div className="text-center py-12 border border-dashed border-border rounded-lg text-sm text-muted-foreground bg-muted/20">
                    <ListOrdered className="w-8 h-8 mx-auto mb-2 opacity-20" />
                    No setup steps added yet.
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="private" className="space-y-6">
            <div className="bg-muted/30 p-4 rounded-lg border border-yellow-500/20 mb-4">
              <p className="text-xs text-yellow-500/80 flex items-center gap-2">
                <Key className="w-3 h-3" /> Information in this tab is only visible to you.
              </p>
            </div>

            <FormField
              control={form.control}
              name="envDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Server className="w-3 h-3" /> Environment Variables
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="DATABASE_URL=...&#10;API_KEY=..." 
                      className="font-mono text-xs h-32" 
                      {...field} 
                      value={field.value || ""} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="testUserDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <User className="w-3 h-3" /> Test Users
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="user: admin@test.com&#10;pass: 123456" 
                        className="font-mono text-xs h-24" 
                        {...field} 
                        value={field.value || ""} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="authDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Key className="w-3 h-3" /> Auth Configuration
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Auth0 Client ID: ...&#10;Callback URL: ..." 
                        className="font-mono text-xs h-24" 
                        {...field} 
                        value={field.value || ""} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-6 border-t border-border">
          <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto h-11 px-8 shadow-lg shadow-primary/20">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {defaultValues ? "Save Changes" : "Create Project"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
