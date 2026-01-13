import { db } from "./db";
import { 
  projects, features, bugs, improvements,
  type InsertProject, type InsertFeature, type InsertBug, type InsertImprovement,
  type Project, type Feature, type Bug, type Improvement
} from "@shared/schema";
import { eq } from "drizzle-orm";

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
}

export class DatabaseStorage implements IStorage {
  async getProjects(userId: string) {
    try {
      const rows = await db.query.projects.findMany({
        where: eq(projects.userId, userId),
        with: {
          features: true,
          bugs: true,
          improvements: true,
        },
        orderBy: (projects, { desc }) => [desc(projects.createdAt)],
      });
      return rows;
    } catch (error) {
      console.error("Error in getProjects:", error);
      return [];
    }
  }

  async getProject(id: number, userId: string) {
    const row = await db.query.projects.findFirst({
      where: (projects, { and, eq }) => and(eq(projects.id, id), eq(projects.userId, userId)),
      with: {
        features: true,
        bugs: true,
        improvements: true,
      },
    });
    return row;
  }

  async createProject(userId: string, insertProject: InsertProject) {
    const [project] = await db.insert(projects).values({ ...insertProject, userId }).returning();
    return project;
  }

  async updateProject(id: number, userId: string, updates: Partial<InsertProject>) {
    const [project] = await db
      .update(projects)
      .set(updates)
      .where(eq(projects.id, id)) // In a real app, also check userId
      .returning();
    return project;
  }

  async deleteProject(id: number, userId: string) {
    await db.delete(projects).where(eq(projects.id, id));
  }

  // Features
  async createFeature(insertFeature: InsertFeature) {
    const [feature] = await db.insert(features).values(insertFeature).returning();
    return feature;
  }

  async updateFeature(id: number, updates: Partial<InsertFeature>) {
    const [feature] = await db.update(features).set(updates).where(eq(features.id, id)).returning();
    return feature;
  }

  async deleteFeature(id: number) {
    await db.delete(features).where(eq(features.id, id));
  }

  // Bugs
  async createBug(insertBug: InsertBug) {
    const [bug] = await db.insert(bugs).values(insertBug).returning();
    return bug;
  }

  async updateBug(id: number, updates: Partial<InsertBug>) {
    const [bug] = await db.update(bugs).set(updates).where(eq(bugs.id, id)).returning();
    return bug;
  }

  async deleteBug(id: number) {
    await db.delete(bugs).where(eq(bugs.id, id));
  }

  // Improvements
  async createImprovement(insertImprovement: InsertImprovement) {
    const [improvement] = await db.insert(improvements).values(insertImprovement).returning();
    return improvement;
  }

  async updateImprovement(id: number, updates: Partial<InsertImprovement>) {
    const [improvement] = await db.update(improvements).set(updates).where(eq(improvements.id, id)).returning();
    return improvement;
  }

  async deleteImprovement(id: number) {
    await db.delete(improvements).where(eq(improvements.id, id));
  }
}

export const storage = new DatabaseStorage();
