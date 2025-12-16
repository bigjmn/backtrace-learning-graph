# Backtrace Learning Graph

An interactive learning graph that helps you visualize and track knowledge dependencies. Create nodes for questions and resources, connect them to show relationships, and track your understanding progress.

## Features

### Node Types
- **Question Nodes** (pink) - Represent learning questions or concepts
  - Track understanding level (0-100%)
  - Add optional notes and topic tags
  - Click on understanding level to edit with slider
- **Resource Nodes** (blue) - Represent learning materials
  - Support various resource types: video, PDF, book, article, website, other
  - Include direct links to resources
  - Add topic tags for organization

### Interactive Features
- **Visual Graph Interface** - Drag and drop nodes to organize your learning map
- **Auto-save Positions** - Node positions are automatically saved to Firebase
- **Smart Connections** - Connect resources to questions they answer
- **Keyboard Shortcuts** - Delete selected nodes with Delete/Backspace keys
- **Real-time Sync** - Changes are saved to Firebase and sync across sessions

### Node Management
- Create new nodes with dedicated forms
- Connect nodes directly from node buttons or by dragging
- Delete nodes (removes node and all connected edges)
- Update question understanding levels with interactive slider
- Visual selection with highlighted borders

## Tech Stack

- **Frontend**: Next.js 15 with React 18
- **UI**: ReactFlow for graph visualization, Tailwind CSS for styling  
- **Database**: Firebase Firestore for real-time data persistence
- **Language**: TypeScript for type safety

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up Firebase**:
   - Create a Firebase project
   - Enable Firestore
   - Add your Firebase config to `src/config/firebase.ts`

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open** [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Add Resources**: Click "Add Resource Node" to create learning materials
2. **Add Questions**: Click "Add Question Node" to create learning objectives  
3. **Connect Nodes**: Use the + buttons on nodes or drag between connection handles
4. **Track Progress**: Click on question understanding percentages to update
5. **Organize**: Drag nodes to arrange your learning map visually
6. **Manage**: Select nodes and press Delete to remove them

## Data Structure

The app uses two main Firestore collections:
- `nodes` - Stores question and resource node data with positions
- `edges` - Stores connections between nodes

Node positions and all changes are automatically persisted to Firebase for seamless experience across sessions.