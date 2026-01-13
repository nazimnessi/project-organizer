import { db } from "./db";
import { 
  projects, features, bugs, improvements, activities,
  type InsertProject, type InsertFeature, type InsertBug, type InsertImprovement, type InsertActivity,
  type Project, type Feature, type Bug, type Improvement, type Activity
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Projects
  getProjects(userId: string): Promise<(Project & { features: Feature[], bugs: Bug[], improvements: Improvement[] })[]>;
  getProject(id: number, userId: string): Promise<(Project & { features: Feature[], bugs: Bug[], improvements: Improvement[] }) | undefined>;
  createProject(userId: string, project: InsertProject): Promise<Project>;
  updateProject(id: number, userId: string, updates: Partial<InsertProject>): Promise<Project>;
  deleteProject(id: number, userId: string): Promise<void>;

  // Features
  createFeature(feature: InsertFeature): Promise<Feature>;
  updateFeature(id: number, updates: Partial<InsertFeature>): Promise<Feature>;
  deleteFeature(id: number): Promise<void>;

  // Bugs
  createBug(bug: InsertBug): Promise<Bug>;
  updateBug(id: number, updates: Partial<InsertBug>): Promise<Bug>;
  deleteBug(id: number): Promise<void>;

  // Improvements
  createImprovement(improvement: InsertImprovement): Promise<Improvement>;
  updateImprovement(id: number, updates: Partial<InsertImprovement>): Promise<Improvement>;
  deleteImprovement(id: number): Promise<void>;

  // Activities
  getActivities(projectId: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
}

export class DatabaseStorage implements IStorage {
  async getProjects(userId: string) {
    try {
      const rows = await db
        .select()
        .from(projects)
        .where(eq(projects.userId, userId))
        .orderBy(desc(projects.createdAt));
      
      const projectsWithDetails = await Promise.all(rows.map(async (project) => {
        const projectFeatures = await db.select().from(features).where(eq(features.projectId, project.id));
        const projectBugs = await db.select().from(bugs).where(eq(bugs.projectId, project.id));
        const projectImprovements = await db.select().from(improvements).where(eq(improvements.projectId, project.id));
        
        return {
          ...project,
          features: projectFeatures,
          bugs: projectBugs,
          improvements: projectImprovements,
        };
      }));

      return projectsWithDetails;
    } catch (error) {
      console.error("Error in getProjects:", error);
      return [];
    }
  }

  async getProject(id: number, userId: string) {
    try {
      const [project] = await db.select().from(projects).where(eq(projects.id, id));
      if (!project) return undefined;

      const projectFeatures = await db.select().from(features).where(eq(features.projectId, project.id));
      const projectBugs = await db.select().from(bugs).where(eq(bugs.projectId, project.id));
      const projectImprovements = await db.select().from(improvements).where(eq(improvements.projectId, project.id));

      return {
        ...project,
        features: projectFeatures,
        bugs: projectBugs,
        improvements: projectImprovements,
      };
    } catch (error) {
      console.error("Error in getProject:", error);
      return undefined;
    }
  }

  async createProject(userId: string, insertProject: InsertProject) {
    const [project] = await db.insert(projects).values({ ...insertProject, userId }).returning();
    await this.createActivity({
      projectId: project.id,
      type: "create",
      entity: "project",
      entityId: project.id,
      description: `Created project "${project.name}"`,
    });
    return project;
  }

  async updateProject(id: number, userId: string, updates: Partial<InsertProject>) {
    const [project] = await db
      .update(projects)
      .set(updates)
      .where(eq(projects.id, id)) // In a real app, also check userId
      .returning();
    
    await this.createActivity({
      projectId: project.id,
      type: "update",
      entity: "project",
      entityId: project.id,
      description: `Updated project "${project.name}" settings`,
    });
    return project;
  }

  async deleteProject(id: number, userId: string) {
    await db.delete(projects).where(eq(projects.id, id));
  }

  // Features
  async createFeature(insertFeature: InsertFeature) {
    const [feature] = await db.insert(features).values(insertFeature).returning();
    await this.createActivity({
      projectId: feature.projectId,
      type: "create",
      entity: "feature",
      entityId: feature.id,
      description: `Added new feature: "${feature.description}"`,
    });
    return feature;
  }

  async updateFeature(id: number, updates: Partial<InsertFeature>) {
    const [feature] = await db.update(features).set(updates).where(eq(features.id, id)).returning();
    await this.createActivity({
      projectId: feature.projectId,
      type: "update",
      entity: "feature",
      entityId: feature.id,
      description: `Updated feature "${feature.description}" (Status: ${feature.status})`,
    });
    return feature;
  }

  async deleteFeature(id: number) {
    const [feature] = await db.select().from(features).where(eq(features.id, id));
    if (feature) {
      await this.createActivity({
        projectId: feature.projectId,
        type: "delete",
        entity: "feature",
        entityId: feature.id,
        description: `Deleted feature: "${feature.description}"`,
      });
      await db.delete(features).where(eq(features.id, id));
    }
  }

  // Bugs
  async createBug(insertBug: InsertBug) {
    const [bug] = await db.insert(bugs).values(insertBug).returning();
    await this.createActivity({
      projectId: bug.projectId,
      type: "create",
      entity: "bug",
      entityId: bug.id,
      description: `Reported new bug: "${bug.description}"`,
    });
    return bug;
  }

  async updateBug(id: number, updates: Partial<InsertBug>) {
    const [bug] = await db.update(bugs).set(updates).where(eq(bugs.id, id)).returning();
    await this.createActivity({
      projectId: bug.projectId,
      type: "update",
      entity: "bug",
      entityId: bug.id,
      description: `Updated bug "${bug.description}" (Status: ${bug.status})`,
    });
    return bug;
  }

  async deleteBug(id: number) {
    const [bug] = await db.select().from(bugs).where(eq(bugs.id, id));
    if (bug) {
      await this.createActivity({
        projectId: bug.projectId,
        type: "delete",
        entity: "bug",
        entityId: bug.id,
        description: `Deleted bug: "${bug.description}"`,
      });
      await db.delete(bugs).where(eq(bugs.id, id));
    }
  }

  // Improvements
  async createImprovement(insertImprovement: InsertImprovement) {
    const [improvement] = await db.insert(improvements).values(insertImprovement).returning();
    await this.createActivity({
      projectId: improvement.projectId,
      type: "create",
      entity: "improvement",
      entityId: improvement.id,
      description: `Suggested improvement: "${improvement.description}"`,
    });
    return improvement;
  }

  async updateImprovement(id: number, updates: Partial<InsertImprovement>) {
    const [improvement] = await db.update(improvements).set(updates).where(eq(improvements.id, id)).returning();
    await this.createActivity({
      projectId: improvement.projectId,
      type: "update",
      entity: "improvement",
      entityId: improvement.id,
      description: `Updated improvement "${improvement.description}" (Status: ${improvement.status})`,
    });
    return improvement;
  }

  async deleteImprovement(id: number) {
    const [improvement] = await db.select().from(improvements).where(eq(improvements.id, id));
    if (improvement) {
      await this.createActivity({
        projectId: improvement.projectId,
        type: "delete",
        entity: "improvement",
        entityId: improvement.id,
        description: `Deleted improvement: "${improvement.description}"`,
      });
      await db.delete(improvements).where(eq(improvements.id, id));
    }
  }

  // Activities
  async getActivities(projectId: number) {
    return await db.query.activities.findMany({
      where: eq(activities.projectId, projectId),
      orderBy: (activities, { desc }) => [desc(activities.createdAt)],
      limit: 50,
    });
  }

  async createActivity(activity: InsertActivity) {
    const [newActivity] = await db.insert(activities).values(activity).returning();
    return newActivity;
  }
}

export const storage = new DatabaseStorage();
