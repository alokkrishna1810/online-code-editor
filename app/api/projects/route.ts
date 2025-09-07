"use client";

import { type NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    await connectDB();
    const projects = await Project.find({
      $or: [{ owner: payload.userId }, { collaborators: payload.userId }],
    })
      .populate("owner", "name email")
      .populate("collaborators", "name email")
      .sort({ updatedAt: -1 });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Get projects error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { name, description, template = "blank" } = await request.json();
    if (!name) {
      return NextResponse.json(
        { error: "Project name is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Create default files based on template
    const defaultFiles = [
      {
        name: "index.html",
        content:
          template === "react"
            ? `<!DOCTYPE html>\n<html>\n<head>\n    <title>${name}</title>\n    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>\n    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>\n    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>\n</head>\n<body>\n    <div id="root"></div>\n</body>\n</html>`
            : `<!DOCTYPE html>\n<html>\n<head>\n    <title>${name}</title>\n    <link rel="stylesheet" href="style.css">\n</head>\n<body>\n    <h1>Hello World!</h1>\n    <script src="script.js"></script>\n</body>\n</html>`,
        language: "html" as const,
        path: "/index.html",
      },
      {
        name: "style.css",
        content:
          "body {\n    font-family: Arial, sans-serif;\n    margin: 0;\n    padding: 20px;\n    background-color: #f5f5f5;\n}\n\nh1 {\n    color: #333;\n    text-align: center;\n}",
        language: "css" as const,
        path: "/style.css",
      },
      {
        name: "script.js",
        content:
          template === "react"
            ? `const { useState } = React;\n\nfunction App() {\n    const [count, setCount] = useState(0);\n\n    return React.createElement('div', null,\n        React.createElement('h1', null, 'React App'),\n        React.createElement('p', null, \`Count: \${count}\`),\n        React.createElement('button', {\n            onClick: () => setCount(count + 1)\n        }, 'Increment')\n    );\n}\n\nReactDOM.render(React.createElement(App), document.getElementById('root'));`
            : 'console.log("Hello World!");\n\n// Add your JavaScript code here\ndocument.addEventListener("DOMContentLoaded", function() {\n    console.log("Page loaded!");\n});',
        language: "javascript" as const,
        path: "/script.js",
      },
    ];

    const project = new Project({
      name,
      description,
      owner: payload.userId,
      template,
      files: defaultFiles,
    });

    await project.save();
    await project.populate("owner", "name email");

    return NextResponse.json({ project });
  } catch (error) {
    console.error("Create project error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
