# DevPad: The Collaborative Cloud Editor

## Table of Contents

* [Introduction](#introduction)
* [Features](#features)
* [Tech Stack](#tech-stack)
* [Getting Started](#getting-started)
* [Phase 1: Core Client-Side Editor](#phase-1-core-client-side-editor)
* [Phase 2: Polyglot IDE (Server-Side Execution)](#phase-2-polyglot-ide-server-side-execution)
* [Phase 3: Collaborative Hub](#phase-3-collaborative-hub)
* [Contributing](#contributing)
* [License](#license)

## Introduction

DevPad is a collaborative cloud editor that allows users to write, execute, save, and share code snippets or small projects directly in their browser. This project is built in three distinct phases, each adding significant value to the platform.

## Features

* **Core Client-Side Editor**: A three-panel layout for HTML, CSS, and JavaScript code, with live rendering and saving capabilities.
* **Polyglot IDE (Server-Side Execution)**: Execute backend languages like Python, Java, or C++ in a secure sandboxed environment using Docker Containers.
* **Collaborative Hub**: Real-time collaboration, user authentication, and multi-file project support.

## Tech Stack

* Frontend: React, Monaco Editor
* Backend: Node.js, Express.js
* Database: MongoDB
* Containerization: Docker

## Getting Started

1. Clone the repository: `git clone https://github.com/alokkrishna1810/online-code-editor.git`
2. Install dependencies: `npm install`
3. Start the development server: `npm start`

## Phase 1: Core Client-Side Editor

* Implement a three-panel layout for HTML, CSS, and JavaScript code.
* Integrate Monaco Editor for syntax highlighting and code completion.
* Implement live rendering and saving capabilities.

## Phase 2: Polyglot IDE (Server-Side Execution)

* Design a robust API endpoint to handle code execution requests.
* Implement sandboxing using Docker Containers for secure code execution.
* Set strict limits on resources to prevent abuse.

## Phase 3: Collaborative Hub

* Implement user authentication using JWT or OAuth.
* Design a more complex database schema to link files to projects and users.
* Implement real-time collaboration using WebSockets.

## Contributing

Contributions are welcome! Please submit a pull request with a clear description of the changes.

## License

Let's see...