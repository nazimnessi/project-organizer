import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Import Auth Models
export * from "./models/auth";

// Projects Table
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(), // Links to users.id from auth
  name: text("name").notNull(),
  description: text("description"),
  productionLink: text("production_link"),
  repoLink: text("repo_link"),
  frontendLink: text("frontend_link"),
  backendLink: text("backend_link"),
  envDetails: text("env_details"),
  testUserDetails: text("test_user_details"),
  authDetails: text("auth_details"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Features Table
export const features = pgTable("features", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  description: text("description").notNull(),
  status: text("status").default("pending"), // pending, completed
  createdAt: timestamp("created_at").defaultNow(),
});

// Bugs Table
export const bugs = pgTable("bugs", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  description: text("description").notNull(),
  status: text("status").default("open"), // open, fixed
  createdAt: timestamp("created_at").defaultNow(),
});

// Improvements Table
export const improvements = pgTable("improvements", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  description: text("description").notNull(),
  status: text("status").default("pending"), // pending, completed
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const projectsRelations = relations(projects, ({ many }) => ({
  features: many(features),
  bugs: many(bugs),
  improvements: many(improvements),
}));

export const featuresRelations = relations(features, ({ one }) => ({
  project: one(projects, {
    fields: [features.projectId],
    references: [projects.id],
  }),
}));

export const bugsRelations = relations(bugs, ({ one }) => ({
  project: one(projects, {
    fields: [bugs.projectId],
    references: [projects.id],
  }),
}));

export const improvementsRelations = relations(improvements, ({ one }) => ({
  project: one(projects, {
    fields: [improvements.projectId],
    references: [projects.id],
  }),
}));

// Schemas
export const insertProjectSchema = createInsertSchema(projects).omit({ id: true, createdAt: true, userId: true }); // userId handled by backend
export const insertFeatureSchema = createInsertSchema(features).omit({ id: true, createdAt: true });
export const insertBugSchema = createInsertSchema(bugs).omit({ id: true, createdAt: true });
export const insertImprovementSchema = createInsertSchema(improvements).omit({ id: true, createdAt: true });

// Types
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type Feature = typeof features.$inferSelect;
export type InsertFeature = z.infer<typeof insertFeatureSchema>;

export type Bug = typeof bugs.$inferSelect;
export type InsertBug = z.infer<typeof insertBugSchema>;

export type Improvement = typeof improvements.$inferSelect;
export type InsertImprovement = z.infer<typeof insertImprovementSchema>;

// API Request Types
export type CreateProjectRequest = InsertProject;
export type UpdateProjectRequest = Partial<InsertProject>;
