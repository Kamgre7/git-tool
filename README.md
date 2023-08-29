# Git-Tool App

GitTool is an application that provides functionality to interact with GitHub repositories and perform commit-related operations. It offers endpoints to commit individual binary files and commit multiple files stored within a zip archive.

### Features

- **Commit a Binary File**: Commit a single binary file to a GitHub repository.
- **Commit Multiple Files from a Zip Archive**: Commit multiple files from a zip archive to a GitHub repository.

### 🚀 Technologies

- Node.js
- Express.js
- TypeScript
- Zod
- Multer
- Adm-zip
- Octokit

### ✅ Requirements

Before starting, you need to have Git and Node installed.

### Run locally - backend

```bash
# Clone the project
$ git clone https://github.com/Kamgre7/git-tool.git

# Go to the project directory
$ cd git-tool-app

# Install dependencies
$ npm install

# Start the server
$ npm run start
```

### 🛠 API Reference

#### Commit a single binary file to a GitHub repository

```http
  POST /commit
```

**Body Params**:

- `commit-msg` (string): Commit message
- `repo` (string): Repository name
- `owner` (string): Repository owner
- `branch` (string): Repository branch
- `path` (string): Path from root to the target directory with files
- `file` (binary): Binary file

#### Commit multiple files from a zip archive to a GitHub repository

```http
  POST /commit/zip
```

**Body Params**:

- `commit-msg` (string): Commit message
- `repo` (string): Repository name
- `owner` (string): Repository owner
- `branch` (string): Repository branch
- `path` (string): Path from root to the target directory with files
- `file` (binary): Binary Zip file
