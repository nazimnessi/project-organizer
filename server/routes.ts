import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Auth Setup
  await setupAuth(app);
  registerAuthRoutes(app);

  // Projects API
  app.get(api.projects.list.path, isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).claims.sub;
      const projects = await storage.getProjects(userId);
      res.json(projects);
    } catch (error) {
      console.error("Failed to list projects:", error);
      res.status(500).json({ message: "Failed to load projects" });
    }
  });

  app.get(api.projects.get.path, isAuthenticated, async (req, res) => {
    const userId = (req.user as any).claims.sub;
    const project = await storage.getProject(Number(req.params.id), userId);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  });

  app.post(api.projects.create.path, isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).claims.sub;
      const input = api.projects.create.input.parse(req.body);
      const project = await storage.createProject(userId, input);
      res.status(201).json(project);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.put(api.projects.update.path, isAuthenticated, async (req, res) => {
    const userId = (req.user as any).claims.sub;
    const input = api.projects.update.input.parse(req.body);
    const project = await storage.updateProject(Number(req.params.id), userId, input);
    res.json(project);
  });

  app.delete(api.projects.delete.path, isAuthenticated, async (req, res) => {
    const userId = (req.user as any).claims.sub;
    await storage.deleteProject(Number(req.params.id), userId);
    res.status(204).send();
  });

  // Features API
  app.post(api.features.create.path, isAuthenticated, async (req, res) => {
    const input = api.features.create.input.parse(req.body);
    const feature = await storage.createFeature({ ...input, projectId: Number(req.params.projectId) });
    res.status(201).json(feature);
  });

  app.put(api.features.update.path, isAuthenticated, async (req, res) => {
    const input = api.features.update.input.parse(req.body);
    const feature = await storage.updateFeature(Number(req.params.id), input);
    res.json(feature);
  });

  app.delete(api.features.delete.path, isAuthenticated, async (req, res) => {
    await storage.deleteFeature(Number(req.params.id));
    res.status(204).send();
  });

  // Bugs API
  app.post(api.bugs.create.path, isAuthenticated, async (req, res) => {
    const input = api.bugs.create.input.parse(req.body);
    const bug = await storage.createBug({ ...input, projectId: Number(req.params.projectId) });
    res.status(201).json(bug);
  });

  app.put(api.bugs.update.path, isAuthenticated, async (req, res) => {
    const input = api.bugs.update.input.parse(req.body);
    const bug = await storage.updateBug(Number(req.params.id), input);
    res.json(bug);
  });

  app.delete(api.bugs.delete.path, isAuthenticated, async (req, res) => {
    await storage.deleteBug(Number(req.params.id));
    res.status(204).send();
  });

  // Improvements API
  app.post(api.improvements.create.path, isAuthenticated, async (req, res) => {
    const input = api.improvements.create.input.parse(req.body);
    const improvement = await storage.createImprovement({ ...input, projectId: Number(req.params.projectId) });
    res.status(201).json(improvement);
  });

  app.put(api.improvements.update.path, isAuthenticated, async (req, res) => {
    const input = api.improvements.update.input.parse(req.body);
    const improvement = await storage.updateImprovement(Number(req.params.id), input);
    res.json(improvement);
  });

  app.delete(api.improvements.delete.path, isAuthenticated, async (req, res) => {
    await storage.deleteImprovement(Number(req.params.id));
    res.status(204).send();
  });

  // Activities API
  app.get("/api/projects/:projectId/activities", isAuthenticated, async (req, res) => {
    const activities = await storage.getActivities(Number(req.params.projectId));
    res.json(activities);
  });

  // Seed Data Endpoint (For development/demo purposes, ideally authenticated or run once)
  app.post("/api/seed", isAuthenticated, async (req, res) => {
    const userId = (req.user as any).claims.sub;
    const existing = await storage.getProjects(userId);
    if (existing.length > 0) return res.json({ message: "Already seeded" });

    // Task Manager
    const taskManager = await storage.createProject(userId, {
      name: "Task Manager",
      description: "A web application to manage my Tasks or todos",
      productionLink: "https://nazims-task-manager.lovable.app/",
      repoLink: "https://github.com/nazimnessi/step-by-step-success",
      frontendLink: "https://lovable.dev/projects/ebbf5e25-de26-412f-bf4b-bc0b029fb04f",
      backendLink: "Inbuilt superbase of lovable",
      authDetails: "Google authentication, Normal authenticated",
      envDetails: "uploaded with github",
    });

    await storage.createFeature({ projectId: taskManager.id, description: "Add checklist feature to a task", status: "pending" });
    await storage.createFeature({ projectId: taskManager.id, description: "Project (collection of tasks)", status: "pending" });
    await storage.createImprovement({ projectId: taskManager.id, description: "Add a push notification for task reminder time", status: "pending" });
    await storage.createImprovement({ projectId: taskManager.id, description: "Option to add key values value as tag", status: "pending" });
    await storage.createImprovement({ projectId: taskManager.id, description: "Option to set some tags to task and match it with candidate", status: "pending" });
    await storage.createBug({ projectId: taskManager.id, description: "UI fix for mobiles", status: "open" });
    await storage.createBug({ projectId: taskManager.id, description: "UI break on long text", status: "open" });

    // Image Unifier
    const imageUnifier = await storage.createProject(userId, {
      name: "Image Unifier",
      description: "A web application to view all images across my google drive",
      productionLink: "https://nazims-image-unifier.lovable.app",
      repoLink: "https://github.com/nazimnessi/photo-unifier",
      frontendLink: "https://lovable.dev/projects/7e5e45a4-2110-4907-863c-bc852df195fb",
      authDetails: "Google authentication",
      envDetails: "uploaded with github",
      backendLink: "No backend",
    });

    await storage.createFeature({ projectId: imageUnifier.id, description: "Add option to delete a file on google drive", status: "pending" });

    // Finance App
    const financeApp = await storage.createProject(userId, {
      name: "Finance app",
      description: "A web application to manage my finances.",
      productionLink: "https://nazims-finance-app.lovable.app",
      repoLink: "https://github.com/nazimnessi/finance-hub",
      frontendLink: "https://lovable.dev/projects/1669c8b8-cdf9-4891-ab94-49e03ea2c13a",
      backendLink: "https://supabase.com/dashboard/project/qolqbicjgpyerfpnjsjv",
      authDetails: "Google authentication, Normal authenticated",
      envDetails: "uploaded with github",
    });

    await storage.createFeature({ projectId: financeApp.id, description: "Add EMI tracker", status: "pending" });
    await storage.createImprovement({ projectId: financeApp.id, description: "Show target amount in default dashboards", status: "pending" });
    await storage.createImprovement({ projectId: financeApp.id, description: "Split up goal to a certain category", status: "pending" });
    await storage.createImprovement({ projectId: financeApp.id, description: "Remove unwanted cards in summery", status: "pending" });

    res.json({ message: "Seeded successfully" });
  });

  return httpServer;
}
