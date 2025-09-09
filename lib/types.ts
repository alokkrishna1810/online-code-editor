export type Language = "html" | "react" | "vue" | "angular";

export interface Project {
  id: string;
  name: string;
  description: string;
  lastModified: string;
  collaborators: number;
  isPublic: boolean;
  language: Language;
}

export interface DashboardProject extends Project {
  updatedAt: Date;
}

export interface File {
  name: string;
  content: string;
  language: "html" | "css" | "javascript";
  path: string;
}
