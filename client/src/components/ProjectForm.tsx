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
} from "@/components/ui/form";
import { Loader2, Plus, X } from "lucide-react";

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="col-span-1 md:col-span-2">
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
              <FormItem className="col-span-1 md:col-span-2">
                <FormLabel>Description (Markdown)</FormLabel>
                <FormControl>
                  <Textarea placeholder="What does this project do?" className="h-24" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="frontendDetails"
            render={({ field }) => (
              <FormItem className="col-span-1 md:col-span-2">
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
              <FormItem className="col-span-1 md:col-span-2">
                <FormLabel>Backend Details (Markdown)</FormLabel>
                <FormControl>
                  <Textarea placeholder="API, storage, database, security..." className="h-24" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="col-span-1 md:col-span-2 space-y-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <FormLabel className="text-base">Setup & Running Instructions</FormLabel>
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
            
            <div className="space-y-3">
              {(form.watch("setupSteps") || []).map((_, index) => (
                <div key={index} className="flex gap-2 group">
                  <div className="flex-none w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary mt-1.5">
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
                            placeholder={`Step ${index + 1}: e.g. clone the project...`}
                            className="bg-background/50 h-9"
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
                    className="opacity-0 group-hover:opacity-100 h-9 w-9 text-muted-foreground hover:text-destructive transition-opacity"
                    onClick={() => {
                      const currentSteps = form.getValues("setupSteps") || [];
                      form.setValue("setupSteps", currentSteps.filter((_, i) => i !== index));
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              
              {(!form.watch("setupSteps") || form.watch("setupSteps").length === 0) && (
                <div className="text-center py-6 border border-dashed border-border rounded-lg text-xs text-muted-foreground">
                  No setup steps added yet. Add steps like "Clone the repo", "Configure env", etc.
                </div>
              )}
            </div>
          </div>

          <FormField
            control={form.control}
            name="productionLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Production URL</FormLabel>
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
                <FormLabel>Repository URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://github.com/..." {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="col-span-1 md:col-span-2 space-y-4 pt-4 border-t border-border">
            <h4 className="font-medium text-sm text-muted-foreground">Technical Details (Private)</h4>
            
            <FormField
              control={form.control}
              name="envDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Environment Variables</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="DATABASE_URL=...&#10;API_KEY=..." 
                      className="font-mono text-xs h-24" 
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
                    <FormLabel>Test Users</FormLabel>
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
                    <FormLabel>Auth Configuration</FormLabel>
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
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {defaultValues ? "Update Project" : "Create Project"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
