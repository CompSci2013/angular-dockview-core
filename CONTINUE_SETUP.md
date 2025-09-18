# Continue Extension Setup for Angular-Dockview-Core

## Setup Complete
- ✅ Ollama configured at http://ollama.minilab with qwen2.5-coder:14b
- ✅ Embedding model nomic-embed-text installed
- ✅ Continue config created in ~/.continue/config.json
- ✅ .continueignore file configured for Angular project

## How to Use Continue with This Project

### 1. Connect VS Code via Remote-SSH
From your Windows workstation:
1. Open VS Code
2. Use Remote-SSH to connect to Thor (192.168.0.244)
3. Open folder: `/home/odin/projects/angular-dockview-core`

### 2. Install Continue Extension
In VS Code (while connected to Thor):
1. Open Extensions (Ctrl+Shift+X)
2. Search for "Continue"
3. Install the Continue extension

### 3. Using Continue for Codebase Analysis

#### Architecture Questions
- `@codebase What components are in this Angular application?`
- `@codebase How is the dockview library integrated?`
- `@codebase What is the application structure?`

#### Focused Analysis
- `@folder:projects/demo What is the demo application doing?`
- `@folder:projects/angular-dockview How is the library structured?`

#### Code Generation
- `@codebase Generate a new Angular component following existing patterns`
- `@codebase Add unit tests for the dockview components`

## Project Access Points
- **Application**: http://dockview.minilab
- **GitLab**: http://gitlab.minilab/halo/angular-dockview-core
- **Ollama API**: http://ollama.minilab

## Troubleshooting
- If indexing gets stuck, restart VS Code
- If models timeout, check Ollama: `curl http://ollama.minilab/api/tags`
- Monitor indexing: Check ~/.continue/ directory size
