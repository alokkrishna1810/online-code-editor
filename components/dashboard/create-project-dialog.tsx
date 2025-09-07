"use client";

import type React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Code2, FileText, Palette, Zap } from "lucide-react";

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateProject: (project: any) => void;
}

export function CreateProjectDialog({
  open,
  onOpenChange,
  onCreateProject,
}: CreateProjectDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    language: "html",
    isPublic: false,
    template: "blank",
  });
  const [isLoading, setIsLoading] = useState(false);

  const templates = [
    {
      id: "blank",
      name: "Blank Project",
      description: "Start from scratch",
      icon: FileText,
    },
    {
      id: "html-starter",
      name: "HTML Starter",
      description: "Basic HTML, CSS, JS setup",
      icon: Code2,
    },
    {
      id: "landing-page",
      name: "Landing Page",
      description: "Modern landing page template",
      icon: Palette,
    },
    {
      id: "interactive",
      name: "Interactive Demo",
      description: "JavaScript interactive example",
      icon: Zap,
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in first");
        return;
      }

      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          template: formData.template,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const newProject = {
          id: data.project._id,
          name: data.project.name,
          description: data.project.description,
          lastModified: "Just now",
          collaborators: 1,
          isPublic: data.project.isPublic,
          language: data.project.files[0]?.language || "html",
        };

        onCreateProject(newProject);
        onOpenChange(false);

        // Reset form
        setFormData({
          name: "",
          description: "",
          language: "html",
          isPublic: false,
          template: "blank",
        });
      } else {
        const error = await response.json();
        alert(error.error || "Failed to create project");
      }
    } catch (error) {
      console.error("Create project error:", error);
      alert("An error occurred while creating the project");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-space-grotesk">
            Create New Project
          </DialogTitle>

          <DialogDescription>
            Set up your new coding project with the options below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="project-name">Project Name</Label>
              <Input
                id="project-name"
                placeholder="My Awesome Project"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="project-description">Description</Label>
              <Textarea
                id="project-description"
                placeholder="Describe what your project does..."
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="project-language">Primary Language</Label>
                <Select
                  value={formData.language}
                  onValueChange={(value: string) =>
                    setFormData((prev) => ({ ...prev, language: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="html">HTML/CSS/JS</SelectItem>

                    <SelectItem value="react">React</SelectItem>

                    <SelectItem value="vue">Vue.js</SelectItem>

                    <SelectItem value="angular">Angular</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="project-template">Template</Label>
                <Select
                  value={formData.template}
                  onValueChange={(value: string) =>
                    setFormData((prev) => ({ ...prev, template: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="public-project">Make project public</Label>
                <p className="text-sm text-muted-foreground">
                  Anyone can view and fork this project
                </p>
              </div>

              <Switch
                id="public-project"
                checked={formData.isPublic}
                onCheckedChange={(checked: boolean) =>
                  setFormData((prev) => ({ ...prev, isPublic: checked }))
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isLoading || !formData.name.trim()}>
              {isLoading ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
