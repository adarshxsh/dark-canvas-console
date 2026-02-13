# Dark Canvas Console

An interactive web console for managing serverless functions, files, billing, and settings. Built with React, TypeScript, Vite, and Tailwind CSS.

## Features

- **Dashboard**: Overview of your serverless infrastructure.
- **Function Management**: Create, view, and invoke serverless functions.
- **File Explorer**: Manage files and metadata easily.
- **Billing & Usage**: Track your resource consumption and costs.
- **Logs & Invocations**: Monitor system activity and function calls.
- **Modern UI**: Responsive design with GitHub-inspired dark aesthetics.

## Tech Stack

- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS & PostCSS
- **State Management**: TanStack Query (React Query)
- **Icons**: Lucide React
- **Testing**: Vitest

## Getting Started

### Prerequisites

- Node.js (v18+)
- Bun (optional, for faster installation)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/adarshxsh/dark-canvas-console.git
   cd dark-canvas-console
   ```

2. Install dependencies:
   ```bash
   # Using bun
   bun install
   # Or using npm
   npm install
   ```

### Running the App

```bash
# Start development server
npm run dev # or bun run dev
```

The application will be available at `http://localhost:8080`.

### Running Tests

```bash
npm run test # or bun run test
```

## Folder Structure

- `src/components/`: UI components and layout systems.
- `src/pages/`: Main application routes and views.
- `src/hooks/`: Custom React hooks for state and logic.
- `src/lib/`: Utility functions and mock data.
- `src/contexts/`: React context providers.
- `public/`: Static assets and icons.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any features or bug fixes.

## License

This project is licensed under the MIT License.

---

Built for the [Devlup Labs](https://github.com/devlup-labs) community.
