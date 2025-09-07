"use client";

import { useState, useCallback } from "react";

export interface FileSystemItem {
  name: string;
  type: "file" | "folder";
  path: string;
  children?: FileSystemItem[];
  content?: string;
}

const defaultFiles: FileSystemItem[] = [
  {
    name: "index.html",
    type: "file",
    path: "index.html",
    content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Project</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>Welcome to CodeCollab</h1>
        <p>Start building something amazing!</p>
        <button id="clickBtn" class="btn">Click me!</button>
    </div>
    <script src="script.js"></script>
</body>
</html>`,
  },
  {
    name: "style.css",
    type: "file",
    path: "style.css",
    content: `/* Reset and base styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #333;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.container {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    text-align: center;
    max-width: 500px;
    width: 90%;
}

h1 {
    color: #4a5568;
    margin-bottom: 1rem;
    font-size: 2.5rem;
}

p {
    color: #718096;
    margin-bottom: 2rem;
    font-size: 1.1rem;
}

.btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    font-size: 1rem;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
}

.btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn:active {
    transform: translateY(0);
}`,
  },
  {
    name: "script.js",
    type: "file",
    path: "script.js",
    content: `// Welcome to CodeCollab!
console.log('CodeCollab is ready! 🚀');

// Add interactivity to the button
document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('clickBtn');
    let clickCount = 0;
    
    if (button) {
        button.addEventListener('click', function() {
            clickCount++;
            
            // Update button text
            button.textContent = \`Clicked \${clickCount} time\${clickCount !== 1 ? 's' : ''}!\`;
            
            // Add some fun animations
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 150);
            
            // Change colors based on clicks
            if (clickCount % 5 === 0) {
                document.body.style.background = \`linear-gradient(135deg, 
                    hsl(\${Math.random() * 360}, 70%, 60%) 0%, 
                    hsl(\${Math.random() * 360}, 70%, 60%) 100%)\`;
            }
            
            console.log(\`Button clicked \${clickCount} times!\`);
        });
    }
});

// Add some utility functions
function showMessage(message) {
    const container = document.querySelector('.container');
    const messageEl = document.createElement('div');
    messageEl.textContent = message;
    messageEl.style.cssText = \`
        margin-top: 1rem;
        padding: 0.5rem;
        background: #e6fffa;
        border: 1px solid #38b2ac;
        border-radius: 4px;
        color: #234e52;
    \`;
    container.appendChild(messageEl);
    
    setTimeout(() => messageEl.remove(), 3000);
}`,
  },
];

export function useFileSystem() {
  const [files, setFiles] = useState<FileSystemItem[]>(defaultFiles);
  const [openFiles, setOpenFiles] = useState<string[]>(["index.html"]);
  const [activeFile, setActiveFile] = useState<string>("index.html");
  const [clipboard, setClipboard] = useState<{
    item: FileSystemItem;
    operation: "copy" | "cut";
  } | null>(null);

  const findItemByPath = useCallback(
    (items: FileSystemItem[], path: string): FileSystemItem | null => {
      for (const item of items) {
        if (item.path === path) return item;
        if (item.children) {
          const found = findItemByPath(item.children, path);
          if (found) return found;
        }
      }
      return null;
    },
    []
  );

  const removeItemByPath = useCallback(
    (items: FileSystemItem[], path: string): FileSystemItem[] => {
      return items.filter((item) => {
        if (item.path === path) return false;
        if (item.children) {
          item.children = removeItemByPath(item.children, path);
        }
        return true;
      });
    },
    []
  );

  const addItemToPath = useCallback(
    (
      items: FileSystemItem[],
      parentPath: string,
      newItem: FileSystemItem
    ): FileSystemItem[] => {
      return items.map((item) => {
        if (item.path === parentPath && item.type === "folder") {
          return {
            ...item,
            children: [...(item.children || []), newItem],
          };
        }
        if (item.children) {
          return {
            ...item,
            children: addItemToPath(item.children, parentPath, newItem),
          };
        }
        return item;
      });
    },
    []
  );

  const createFile = useCallback(
    (parentPath: string, name: string, content = "") => {
      const newPath = parentPath ? `${parentPath}/${name}` : name;
      const newFile: FileSystemItem = {
        name,
        type: "file",
        path: newPath,
        content,
      };

      if (parentPath) {
        setFiles((prev) => addItemToPath(prev, parentPath, newFile));
      } else {
        setFiles((prev) => [...prev, newFile]);
      }

      // Open the new file
      setOpenFiles((prev) => [...prev, newPath]);
      setActiveFile(newPath);
    },
    [addItemToPath]
  );

  const createFileFromTemplate = useCallback(
    (parentPath: string, name: string, content: string) => {
      createFile(parentPath, name, content);
    },
    [createFile]
  );

  const createFolder = useCallback(
    (parentPath: string, name: string) => {
      const newPath = parentPath ? `${parentPath}/${name}` : name;
      const newFolder: FileSystemItem = {
        name,
        type: "folder",
        path: newPath,
        children: [],
      };

      if (parentPath) {
        setFiles((prev) => addItemToPath(prev, parentPath, newFolder));
      } else {
        setFiles((prev) => [...prev, newFolder]);
      }
    },
    [addItemToPath]
  );

  const renameItem = useCallback((path: string, newName: string) => {
    setFiles((prev) => {
      const updatePath = (items: FileSystemItem[]): FileSystemItem[] => {
        return items.map((item) => {
          if (item.path === path) {
            const newPath =
              item.path.split("/").slice(0, -1).concat(newName).join("/") ||
              newName;
            return { ...item, name: newName, path: newPath };
          }
          if (item.children) {
            return { ...item, children: updatePath(item.children) };
          }
          return item;
        });
      };
      return updatePath(prev);
    });
  }, []);

  const deleteItem = useCallback(
    (path: string) => {
      setFiles((prev) => removeItemByPath(prev, path));
      setOpenFiles((prev) => prev.filter((file) => file !== path));
      if (activeFile === path) {
        const remainingFiles = openFiles.filter((file) => file !== path);
        setActiveFile(remainingFiles[0] || "");
      }
    },
    [activeFile, openFiles, removeItemByPath]
  );

  const copyItem = useCallback(
    (path: string) => {
      const item = findItemByPath(files, path);
      if (item) {
        setClipboard({ item, operation: "copy" });
      }
    },
    [files, findItemByPath]
  );

  const cutItem = useCallback(
    (path: string) => {
      const item = findItemByPath(files, path);
      if (item) {
        setClipboard({ item, operation: "cut" });
      }
    },
    [files, findItemByPath]
  );

  const updateFileContent = useCallback((path: string, content: string) => {
    setFiles((prev) => {
      const updateContent = (items: FileSystemItem[]): FileSystemItem[] => {
        return items.map((item) => {
          if (item.path === path && item.type === "file") {
            return { ...item, content };
          }
          if (item.children) {
            return { ...item, children: updateContent(item.children) };
          }
          return item;
        });
      };
      return updateContent(prev);
    });
  }, []);

  const openFile = useCallback(
    (path: string) => {
      if (!openFiles.includes(path)) {
        setOpenFiles((prev) => [...prev, path]);
      }
      setActiveFile(path);
    },
    [openFiles]
  );

  const closeFile = useCallback(
    (path: string) => {
      setOpenFiles((prev) => prev.filter((file) => file !== path));
      if (activeFile === path) {
        const remainingFiles = openFiles.filter((file) => file !== path);
        setActiveFile(remainingFiles[0] || "");
      }
    },
    [activeFile, openFiles]
  );

  const getFileContent = useCallback(
    (path: string): string => {
      const item = findItemByPath(files, path);
      return item?.content || "";
    },
    [files, findItemByPath]
  );

  return {
    files,
    openFiles,
    activeFile,
    clipboard,
    createFile,
    createFileFromTemplate,
    createFolder,
    renameItem,
    deleteItem,
    copyItem,
    cutItem,
    updateFileContent,
    openFile,
    closeFile,
    getFileContent,
    setActiveFile,
  };
}
