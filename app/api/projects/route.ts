import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import { z } from "zod";
import { File } from "@/lib/types";
import { errorHandler } from "@/app/api/middleware/errorHandler";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const projects = await Project.find({
      $or: [{ owner: userId }, { collaborators: userId }],
    }).sort({ updatedAt: -1 });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Get projects error:", error);
    return errorHandler(error);
  }
}

const createDefaultFiles = (language: string, projectName: string): File[] => {
  const htmlContent =
    language === "react"
      ? `<!DOCTYPE html>\n<html>\n<head>\n    <title>${projectName}</title>\n    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>\n    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>\n    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>\n</head>\n<body>\n    <div id="root"></div>\n</body>\n</html>`
      : `<!DOCTYPE html>\n<html>\n<head>\n    <title>${projectName}</title>\n    <link rel="stylesheet" href="style.css">\n</head>\n<body>\n    <h1>Hello World!</h1>\n    <script src="script.js"></script>\n</body>\n</html>`;

  const cssContent = `body {\n    font-family: Arial, sans-serif;\n    margin: 0;\n    padding: 20px;\n    background-color: #f5f5f5;\n}\n\nh1 {\n    color: #333;\n    text-align: center;\n}`;

  const jsContent =
    language === "react"
      ? `const { useState } = React;\n\nfunction App() {\n    const [count, setCount] = useState(0);\n\n    return React.createElement('div', null,\n        React.createElement('h1', null, 'React App'),\n        React.createElement('p', null, \`Count: \${count}\`),\n        React.createElement('button', {\n            onClick: () => setCount(count + 1)\n        }, 'Increment')\n    );\n}\n\nReactDOM.render(React.createElement(App), document.getElementById('root'));`
      : 'console.log("Hello World!");\n\n// Add your JavaScript code here\ndocument.addEventListener("DOMContentLoaded", function() {\n    console.log("Page loaded!");\n});';

  return [
    {
      name: "index.html",
      content: htmlContent,
      language: "html",
      path: "/index.html",
    },
    {
      name: "style.css",
      content: cssContent,
      language: "css",
      path: "/style.css",
    },
    {
      name: "script.js",
      content: jsContent,
      language: "javascript",
      path: "/script.js",
    },
  ];
};

const createProjectSchema = z.object({
  name: z.string().min(1, { message: "Project name is required" }).max(100),
  description: z.string().max(500).optional(),
  language: z.enum(["html", "react", "vue", "angular"]),
  template: z.string().optional().default("blank"),
});

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth(); // Corrected: Added await
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validation = createProjectSchema.safeParse(body);

    if (!validation.success) {
      return errorHandler(validation.error);
    }

    const { name, description, language, template } = validation.data;

    await connectDB();

    const project = new Project({
      name,
      description,
      owner: userId,
      template,
      language,
      files: createDefaultFiles(language, name),
    });

    await project.save();

    return NextResponse.json({ project });
  } catch (error) {
    console.error("Create project error:", error);
    return errorHandler(error);
  }
}
