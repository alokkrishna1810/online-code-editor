"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { ProjectCard } from "@/components/dashboard/project-card";
import { CreateProjectDialog } from "@/components/dashboard/create-project-dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code2, Clock, Users, Star, Plus, LogOut, Loader2 } from "lucide-react";

// Move mock data outside component to prevent recreation on every render
const MOCK_PROJECTS = [
  {
    id: "1",
    name: "Portfolio Website",
    description:
      "My personal portfolio showcasing web development projects and skills",
    lastModified: "2 hours ago",
    collaborators: 1,
    isPublic: true,
    language: "html" as const,
  },
  {
    id: "2",
    name: "E-commerce Landing",
    description:
      "Modern landing page for an e-commerce platform with interactive elements",
    lastModified: "1 day ago",
    collaborators: 3,
    isPublic: false,
    language: "react" as const,
  },
  {
    id: "3",
    name: "Dashboard UI",
    description:
      "Clean and responsive dashboard interface with data visualization components",
    lastModified: "3 days ago",
    collaborators: 2,
    isPublic: true,
    language: "vue" as const,
  },
  {
    id: "4",
    name: "Mobile App Prototype",
    description:
      "Interactive prototype for a mobile application with smooth animations",
    lastModified: "1 week ago",
    collaborators: 4,
    isPublic: false,
    language: "angular" as const,
  },
];

// Type definitions for better type safety
type Language = "html" | "react" | "vue" | "angular";

interface Project {
  id: string;
  name: string;
  description: string;
  lastModified: string;
  collaborators: number;
  isPublic: boolean;
  language: Language;
}

interface User {
  name: string;
  email: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProjectsLoading, setIsProjectsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Memoized fetchProjects function to prevent unnecessary re-creation
  const fetchProjects = useCallback(async (token: string) => {
    setIsProjectsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/projects", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProjects(
          data.projects.map((p: any) => ({
            id: p._id,
            name: p.name,
            description: p.description,
            lastModified: new Date(p.updatedAt).toLocaleDateString(),
            collaborators: p.collaborators.length + 1,
            isPublic: p.isPublic,
            language: p.files[0]?.language || "html",
          }))
        );
      } else {
        setError("Failed to fetch projects");
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      setError("Network error occurred");
    } finally {
      setIsProjectsLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);
        fetchProjects(token);
      } catch (error) {
        console.error("Error parsing user data:", error);
        router.push("/auth");
      }
    } else {
      router.push("/auth");
    }
    setIsLoading(false);
  }, [router, fetchProjects]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
    router.push("/auth");
  }, [router]);

  // Memoized filtered projects to prevent unnecessary recalculations
  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return projects;

    const query = searchQuery.toLowerCase();
    return projects.filter(
      (project) =>
        project.name.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query)
    );
  }, [projects, searchQuery]);

  // Memoized stats calculation
  const stats = useMemo(() => {
    const totalProjects = projects.length;
    const totalCollaborators = projects.reduce(
      (sum, project) => sum + project.collaborators,
      0
    );
    const publicProjects = projects.filter((p) => p.isPublic).length;
    const recentActivity = projects.filter((p) => {
      // Consider projects modified within last 7 days as recent
      const daysSinceModified = Math.floor(Math.random() * 30); // Mock calculation
      return daysSinceModified <= 7;
    }).length;

    return {
      totalProjects,
      totalCollaborators,
      publicProjects,
      recentActivity,
    };
  }, [projects]);

  const handleCreateProject = useCallback((newProject: Project) => {
    setProjects((prev) => [newProject, ...prev]);
  }, []);

  const handleEditProject = useCallback((project: Project) => {
    console.log("[v0] Edit project:", project);
    // Implementation for editing project
  }, []);

  const handleDeleteProject = useCallback((projectId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
  }, []);

  const handleShareProject = useCallback((project: Project) => {
    console.log("[v0] Share project:", project);
    // Implementation for sharing project
  }, []);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        onCreateProject={() => setShowCreateDialog(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold font-space-grotesk mb-2">
              Welcome back, {user?.name || "User"}!
            </h1>

            <p className="text-muted-foreground">
              Continue working on your projects or start something new.
            </p>
          </div>

          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-lg p-4 border">
            <div className="flex items-center space-x-2">
              <Code2 className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Total Projects</span>
            </div>
            <p className="text-2xl font-bold mt-2">{stats.totalProjects}</p>
          </div>

          <div className="bg-card rounded-lg p-4 border">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-secondary" />
              <span className="text-sm font-medium">Recent Activity</span>
            </div>
            <p className="text-2xl font-bold mt-2">{stats.recentActivity}</p>
          </div>

          <div className="bg-card rounded-lg p-4 border">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-accent" />
              <span className="text-sm font-medium">Collaborators</span>
            </div>
            <p className="text-2xl font-bold mt-2">
              {stats.totalCollaborators}
            </p>
          </div>

          <div className="bg-card rounded-lg p-4 border">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-medium">Public Projects</span>
            </div>
            <p className="text-2xl font-bold mt-2">{stats.publicProjects}</p>
          </div>
        </div>

        {/* Projects Section */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList>
            <TabsTrigger value="all">All Projects</TabsTrigger>

            <TabsTrigger value="recent">Recent</TabsTrigger>

            <TabsTrigger value="shared">Shared</TabsTrigger>

            <TabsTrigger value="starred">Starred</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {isProjectsLoading ? (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">Loading projects...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-500 mb-4">
                  <Code2 className="h-12 w-12 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Error loading projects
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">{error}</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const token = localStorage.getItem("token");
                      if (token) fetchProjects(token);
                    }}
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            ) : filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onEdit={handleEditProject}
                    onDelete={handleDeleteProject}
                    onShare={handleShareProject}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Code2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">
                  No projects found
                </h3>

                <p className="text-muted-foreground mb-4">
                  {searchQuery
                    ? "Try adjusting your search terms"
                    : "Get started by creating your first project"}
                </p>

                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Project
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="recent">
            <div className="text-center py-12">
              <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />

              <h3 className="text-lg font-semibold mb-2">Recent Projects</h3>

              <p className="text-muted-foreground">
                Your recently accessed projects will appear here
              </p>
            </div>
          </TabsContent>

          <TabsContent value="shared">
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />

              <h3 className="text-lg font-semibold mb-2">Shared Projects</h3>

              <p className="text-muted-foreground">
                Projects shared with you by other users
              </p>
            </div>
          </TabsContent>

          <TabsContent value="starred">
            <div className="text-center py-12">
              <Star className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />

              <h3 className="text-lg font-semibold mb-2">Starred Projects</h3>

              <p className="text-muted-foreground">
                Your favorite projects will appear here
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <CreateProjectDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onCreateProject={handleCreateProject}
      />
    </div>
  );
}
