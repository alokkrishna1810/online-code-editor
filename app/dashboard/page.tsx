"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { ProjectCard } from "@/components/dashboard/project-card";
import { CreateProjectDialog } from "@/components/dashboard/create-project-dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code2, Clock, Users, Star, Plus } from "lucide-react";

const mockProjects = [
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

export default function DashboardPage() {
  const [projects, setProjects] = useState(mockProjects);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateProject = (newProject: any) => {
    setProjects((prev) => [newProject, ...prev]);
  };

  const handleEditProject = (project: any) => {
    console.log("[v0] Edit project:", project);
    // Implementation for editing project
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
  };

  const handleShareProject = (project: any) => {
    console.log("[v0] Share project:", project);
    // Implementation for sharing project
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        onCreateProject={() => setShowCreateDialog(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-space-grotesk mb-2">
            Welcome back, John!
          </h1>

          <p className="text-muted-foreground">
            Continue working on your projects or start something new.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-lg p-4 border">
            <div className="flex items-center space-x-2">
              <Code2 className="h-5 w-5 text-primary" />

              <span className="text-sm font-medium">Total Projects</span>
            </div>

            <p className="text-2xl font-bold mt-2">{projects.length}</p>
          </div>

          <div className="bg-card rounded-lg p-4 border">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-secondary" />

              <span className="text-sm font-medium">Recent Activity</span>
            </div>

            <p className="text-2xl font-bold mt-2">12</p>
          </div>

          <div className="bg-card rounded-lg p-4 border">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-accent" />

              <span className="text-sm font-medium">Collaborators</span>
            </div>

            <p className="text-2xl font-bold mt-2">8</p>
          </div>

          <div className="bg-card rounded-lg p-4 border">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-500" />

              <span className="text-sm font-medium">Starred</span>
            </div>

            <p className="text-2xl font-bold mt-2">3</p>
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
            {filteredProjects.length > 0 ? (
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
