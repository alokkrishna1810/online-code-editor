"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Code2,
  Users,
  Calendar,
  MoreHorizontal,
  Edit,
  Trash2,
  Share,
  Copy,
} from "lucide-react";
import Link from "next/link";

interface Project {
  id: string;
  name: string;
  description: string;
  lastModified: string;
  collaborators: number;
  isPublic: boolean;
  language: "html" | "react" | "vue" | "angular";
  preview?: string;
}

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
  onShare: (project: Project) => void;
}

export function ProjectCard({
  project,
  onEdit,
  onDelete,
  onShare,
}: ProjectCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const getLanguageColor = (language: string) => {
    switch (language) {
      case "html":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "react":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "vue":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "angular":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const handleOpen = async () => {
    setIsLoading(true);
    // Simulate loading
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsLoading(false);
  };

  return (
    <Card className="group hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <Code2 className="h-5 w-5 text-primary" />

            <CardTitle className="text-lg font-space-grotesk">
              {project.name}
            </CardTitle>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(project)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Details
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => onShare(project)}>
                <Share className="h-4 w-4 mr-2" />
                Share Project
              </DropdownMenuItem>

              <DropdownMenuItem>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => onDelete(project.id)}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <CardDescription className="line-clamp-2">
          {project.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{project.lastModified}</span>
            </div>

            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{project.collaborators}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Badge className={getLanguageColor(project.language)}>
              {project.language.toUpperCase()}
            </Badge>
            {project.isPublic && <Badge variant="outline">Public</Badge>}
          </div>
        </div>

        <Link href="/editor">
          <Button className="w-full" onClick={handleOpen} disabled={isLoading}>
            {isLoading ? "Opening..." : "Open Project"}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
