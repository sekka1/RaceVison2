# AGENTS.md - RaceVision Development Guide

This document provides AI agents with essential context for understanding and working with the RaceVision codebase.

## Project Overview

**RaceVision** is an open-source Electron-based overlay application for iRacing that displays real-time telemetry and session data. It provides multiple overlay windows showing standings, relative positions, inputs, track maps, and fuel calculations.

- **Tech Stack**: Electron, TypeScript, React
- **License**: MIT
- **Author**: Michael Pavich
- **Status**: In Active Development ⚠️

## Architecture

### Application Structure

```
Electron Main Process (src/main/)
├── main.ts - Application entry point
├── preload.ts - Secure IPC bridge
├── services/
│   ├── iracingHandlers.ts - iRacing SDK integration
│   ├── windowManager.ts - Overlay window management
│   ├── ipcHandlers.ts - IPC communication handlers
│   ├── autoUpdater.ts - Application update logic
│   └── appEvents.ts - Application lifecycle events

Electron Renderer Process (src/renderer/)
├── index.tsx - React root
├── mainRouter.tsx - React Router configuration
└── routes/ - Individual overlay pages
    ├── main.tsx - Main control panel
    ├── standings.tsx - Standings overlay
    ├── relative.tsx - Relative positions overlay
    ├── inputs.tsx - Pedal/steering inputs
    ├── inputGraph.tsx - Input graph visualization
    ├── trackMap.tsx - Real-time track map
    └── fuelCalculator.tsx - Fuel strategy calculator

Components (src/components/)
├── common/ - Shared UI components
├── standings/ - Standings table components
├── relative/ - Relative position components
├── inputs/ - Input visualization components
├── trackMap/ - Track map canvas components
└── main/ - Main window components
```

### Key Technologies

- **Electron**: Desktop application framework
- **React 18**: UI framework with hooks
- **TypeScript**: Type-safe JavaScript
- **Webpack 5**: Module bundler
- **Chart.js**: Data visualization
- **React Router**: Client-side routing
- **iracing-sdk-js**: iRacing SDK wrapper by Friss

## Data Flow

1. **iRacing SDK** → Main Process (`iracingHandlers.ts`)
2. **Main Process** → IPC Events → Renderer Process
3. **Renderer Process** → React Components → UI Updates
4. **User Actions** → IPC Messages → Main Process → iRacing SDK

### IPC Channels (src/constants/ipcChannels.ts)

Key communication channels between main and renderer:
- Telemetry data streaming
- Session information updates
- Window management commands
- Settings persistence

## Development Workflow

### Setup & Installation

```bash
# Prerequisites
# - Node.js v21+
# - OAuth2 credentials from iRacing (for track data tools)

# Install dependencies
npm install

# Start development server
npm run start

# Run tests
npm test
npm run test:watch
npm run test:coverage

# Lint code
npm run lint
```

### Building & Packaging

```bash
# Build for production
npm run build

# Create distributable package
npm run package

# Publish release (requires git tag)
npm run publish
```

### Track Data Tools (tools/iRacingTrackData/)

Scripts for downloading and processing iRacing track maps:

```bash
# Download track maps from iRacing API
npm run download-track-maps

# Convert downloaded data to JSON format
npm run convert-track-maps

# Run both steps
npm run generate-tracks
```

**Important**: Requires OAuth2 credentials in `.env`:
- `IRACING_USERNAME` - iRacing email
- `IRACING_PASSWORD` - iRacing password
- `IRACING_CLIENT_ID` - OAuth2 client ID (must register at https://oauth.iracing.com/)
- `IRACING_CLIENT_SECRET` - OAuth2 client secret

See [tools/iRacingTrackData/README.md](tools/iRacingTrackData/README.md) for OAuth2 registration details.

## Key Files & Locations

### Configuration Files

- `package.json` - Dependencies, scripts, electron-builder config
- `tsconfig.json` - TypeScript compiler configuration
- `jest.config.js` - Jest testing configuration
- `.erb/configs/` - Webpack configurations for dev/prod builds

### Source Code

- `src/main/` - Electron main process code
- `src/renderer/` - React UI code
- `src/components/` - Reusable React components
- `src/hooks/` - Custom React hooks (iRacing data, document utilities)
- `src/services/` - Business logic (color generation, iRating calculations)
- `src/types/` - TypeScript type definitions
- `src/utils/` - Utility functions
- `src/constants/` - Application constants

### Assets & Resources

- `src/assets/normalized/tracks.json` - Track map data
- `assets/` - Application icons and resources
- `release/` - Build output directory

## Common Development Tasks

### Adding a New Overlay

1. Create route component in `src/renderer/routes/`
2. Add route to `src/renderer/mainRouter.tsx`
3. Create component folder in `src/components/`
4. Add window management logic to `src/main/services/windowManager.ts`
5. Register IPC handlers in `src/main/services/ipcHandlers.ts`
6. Update main window sidebar to launch overlay

### Working with iRacing Data

1. **Telemetry Data**: See `src/hooks/iracing/useTelemetry.ts`
2. **Session Info**: See `src/hooks/iracing/useSession.ts`
3. **Type Definitions**: See `src/types/iracing/`
4. **Data Processing**: See `src/services/iracingMappingUtils.ts`

### Styling

- CSS Modules (`.module.css` files)
- Scoped to components
- Color constants in `src/constants/colorConstants.ts`
- Default options in `src/constants/defaultOptions.ts`

### State Management

- React Context API (`src/components/main/contextProvider.tsx`)
- Custom hooks for iRacing data
- Electron Store for settings persistence (`src/main/storeUtils.ts`)

## Testing

- **Framework**: Jest
- **Test Files**: Located alongside source files or in `__tests__/` directories
- **Example**: `tools/iRacingTrackData/__tests__/`

## Build & Release Process

### Release Creation (Automated via GitHub Actions)

1. Create and push a semantic version tag:
   ```bash
   git tag v1.2.3
   git push origin v1.2.3
   ```

2. GitHub Actions automatically:
   - Updates `release/app/package.json` with version
   - Builds application for Windows and macOS
   - Creates GitHub release
   - Uploads installers and update files

### Artifacts

- Windows: `RaceVision-Setup-{version}.exe` + blockmap
- macOS: DMG installer
- Update metadata: `latest.yml`, `latest-mac.yml`

## Important Patterns & Conventions

### File Naming

- React components: PascalCase (e.g., `StandingsTable.tsx`)
- Hooks: camelCase with `use` prefix (e.g., `useTelemetry.ts`)
- Utilities: camelCase (e.g., `colorUtils.ts`)
- Types: PascalCase (e.g., `DriverInfo.ts`)
- CSS Modules: `{component}.module.css`

### TypeScript

- Strict mode enabled
- Prefer interfaces over types for object shapes
- Use type definitions from `src/types/`
- Avoid `any` - use proper typing

### React

- Functional components with hooks
- Custom hooks for shared logic
- CSS Modules for styling
- Props typing with TypeScript interfaces

### Electron

- Use preload scripts for secure IPC
- Main process handles all iRacing SDK interactions
- Renderer process is UI-only
- IPC channels defined in constants

## Common Issues & Solutions

### Authentication Errors (Track Data Tools)

- **Problem**: 405 Not Allowed or auth failures
- **Solution**: Ensure OAuth2 credentials are registered with iRacing. The old cookie-based auth is deprecated.

### Build Failures

- **Problem**: Native module compilation errors
- **Solution**: Run `npm run rebuild` to rebuild native modules for Electron

### Development Server Issues

- **Problem**: Port already in use
- **Solution**: Script auto-checks port availability (see `.erb/scripts/check-port-in-use.js`)

## External Dependencies

### Critical Dependencies

- `iracing-sdk-js` - iRacing telemetry SDK wrapper
- `electron-store` - Settings persistence
- `electron-updater` - Auto-update functionality
- `chart.js` - Graph visualizations
- `react-router-dom` - Navigation

### Development Dependencies

- `webpack` - Module bundler
- `ts-node` - TypeScript execution
- `electron-builder` - Application packaging
- `jest` - Testing framework
- `eslint` - Code linting

## Project Goals & Constraints

### Goals

- Provide free overlay solution for iRacing
- Display telemetry data not shown in iRacing's default UI
- Support multiclass racing scenarios
- Maintain performance during races
- Easy installation and updates

### Constraints

- Windows-focused (iRacing requirement)
- macOS support for development/testing
- Must not violate iRacing's terms of service
- Real-time performance critical
- Limited by iRacing SDK data availability

## Contributing Guidelines

1. Fork and create feature branches
2. Follow existing code patterns and naming conventions
3. Add tests for new functionality
4. Update documentation as needed
5. Create pull requests with clear descriptions
6. Ensure builds pass before submitting

## Resources

- **Website**: https://www.racevision.app/
- **GitHub**: https://github.com/mpavich2/RaceVision
- **iRacing SDK**: https://github.com/Friss/iracing-sdk-js
- **OAuth2 Docs**: https://oauth.iracing.com/oauth2/book/
- **Issues**: https://github.com/mpavich2/RaceVision/issues

## Agent Tips

- Always check `package.json` scripts before running commands
- Refer to type definitions in `src/types/` for data structures
- Use existing hooks in `src/hooks/` rather than creating duplicates
- Follow the component structure in `src/components/` for consistency
- Test changes with `npm run start` before building
- When modifying authentication, refer to OAuth2 documentation
- Track map data is pre-generated - run `generate-tracks` when tracks update
- **After making any code changes, run `npm run lint` to ensure code quality and formatting are correct**
