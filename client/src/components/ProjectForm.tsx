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
import { Loader2 } from "lucide-react";

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
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="What does this project do?" className="h-20" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
