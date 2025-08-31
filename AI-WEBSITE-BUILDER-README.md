# AI Website Builder

A comprehensive AI-powered website builder that allows users to create, edit, and deploy websites through natural language descriptions and interactive annotation mode.

## Features

### 🚀 Project Initialization
- **Multiple Framework Support**: Create Next.js, static HTML/CSS/JS, or custom framework projects
- **AI-Powered Generation**: Describe your website in natural language and let AI create the initial code
- **Automatic Setup**: Dependencies, configuration files, and project structure are automatically generated

### 🎨 Interactive Annotation Mode
- **Visual Editing**: Click on any element in the live preview to edit it
- **Multiple Actions**: 
  - Add comments and feedback
  - Update text content
  - Add new sections
  - Replace images
- **Real-time Updates**: Changes are applied immediately to the codebase

### 🌐 Live Preview
- **Development Server**: Automatic startup of development servers for each project
- **Live Reload**: See changes in real-time as you edit
- **Responsive Preview**: View your website in different screen sizes

### 🚀 Deployment Options
- **Vercel**: One-click deployment with automatic configuration
- **Netlify**: Deploy static sites with build optimization
- **GitHub Pages**: Free hosting for static websites
- **Custom Domains**: Support for custom domain configuration

### 📚 GitHub Integration
- **Repository Creation**: Automatically create GitHub repositories
- **Code Push**: Push your project to GitHub with proper .gitignore and README
- **Version Control**: Full Git integration with commit history

## Architecture

### Frontend Components
- `src/app/ai-website-builder/page.tsx` - Main builder interface
- `src/components/ai-website-builder/AnnotationMode.tsx` - Interactive editing mode
- `src/components/ui/` - Reusable UI components

### Backend API Endpoints
- `/api/ai-website-builder/initialize` - Create new projects
- `/api/ai-website-builder/preview/[projectId]` - Serve project previews
- `/api/ai-website-builder/annotations` - Process user annotations
- `/api/ai-website-builder/deploy` - Deploy to various platforms
- `/api/ai-website-builder/github` - GitHub integration

### Project Structure
```
projects/
├── [project-id]/
│   ├── project.json          # Project metadata
│   ├── comments.json         # User annotations
│   ├── package.json          # Dependencies
│   ├── src/                  # Source code
│   └── ...                   # Framework-specific files
```

## Usage

### 1. Create a New Project
1. Navigate to `/ai-website-builder`
2. Enter project name and description
3. Choose project type (Next.js, Static, or Custom)
4. Describe your website requirements
5. Click "Create Website"

### 2. Edit in Annotation Mode
1. Click "Edit in Annotation Mode" in the project controls
2. Click on any element in the preview to edit it
3. Choose action type:
   - **Add Comment**: Provide feedback or suggestions
   - **Update Text**: Change text content
   - **Add Section**: Insert new content sections
   - **Replace Image**: Upload and replace images
4. Submit changes to apply them

### 3. Deploy Your Website
1. Choose deployment platform:
   - **Vercel**: Best for Next.js and React apps
   - **Netlify**: Great for static sites
   - **GitHub Pages**: Free hosting for static content
2. Follow the deployment instructions
3. Your website will be live at the provided URL

### 4. Push to GitHub
1. Click "Push to GitHub"
2. Enter repository name and description
3. Choose public or private repository
4. Your code will be pushed to GitHub with proper documentation

## Technical Details

### Project Types

#### Next.js Projects
- Full-stack React applications
- Server-side rendering
- API routes support
- TypeScript configuration
- Tailwind CSS styling

#### Static Projects
- HTML/CSS/JavaScript
- Responsive design
- Modern CSS features
- Interactive JavaScript
- Optimized for performance

#### Custom Projects
- Framework-agnostic setup
- Basic project structure
- Documentation templates
- Deployment configurations

### Annotation Processing
- **Element Identification**: Unique IDs assigned to DOM elements
- **Code Modification**: AST-based code updates for accurate changes
- **Asset Management**: Image upload and optimization
- **Change Tracking**: Complete history of all modifications

### Development Servers
- **Port Management**: Automatic port assignment to avoid conflicts
- **Process Management**: Background server processes
- **Health Checks**: Server status monitoring
- **Auto-restart**: Automatic restart on code changes

## API Reference

### Initialize Project
```typescript
POST /api/ai-website-builder/initialize
{
  "name": "My Website",
  "type": "nextjs",
  "description": "A modern portfolio website"
}
```

### Process Annotation
```typescript
POST /api/ai-website-builder/annotations
{
  "projectId": "uuid",
  "elementId": "element-123",
  "action": "update-text",
  "instruction": "Change the heading text",
  "newContent": "New Heading"
}
```

### Deploy Project
```typescript
POST /api/ai-website-builder/deploy
{
  "projectId": "uuid",
  "platform": "vercel"
}
```

### Push to GitHub
```typescript
POST /api/ai-website-builder/github
{
  "projectId": "uuid",
  "repoName": "my-website",
  "repoDescription": "My awesome website",
  "isPrivate": false
}
```

## Dependencies

### Core Dependencies
- `next` - React framework
- `react` - UI library
- `typescript` - Type safety
- `tailwindcss` - Styling
- `clsx` - Class name utilities
- `tailwind-merge` - CSS class merging
- `uuid` - Unique ID generation

### Development Dependencies
- `@types/uuid` - TypeScript types
- `eslint` - Code linting
- `prettier` - Code formatting

## Environment Setup

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Git (for GitHub integration)
- Vercel CLI (for Vercel deployment)
- Netlify CLI (for Netlify deployment)

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Environment Variables
```env
# Optional: GitHub API token for enhanced GitHub integration
GITHUB_TOKEN=your_github_token

# Optional: Vercel token for deployment
VERCEL_TOKEN=your_vercel_token
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the API reference

---

**Built with ❤️ using Next.js, React, and AI-powered development tools.**

