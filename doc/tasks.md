# Implementation Tasks - Folder Structure and Framework Definitions

This document outlines the tasks required to define the game project's folder structure, select frameworks, libraries, and establish the overall technical stack. These tasks are derived from the specifications in [project.md] and our design documents.

## 1. Define Folder Structure

### Frontend and Game Engine
- **/src**: Contains all frontend and game engine source code.
  - **/src/engine**: Core game engine and runtime logic.
    - **/src/engine/core**: Core engine functionality
    - **/src/engine/physics**: Physics integration with Cannon.js
    - **/src/engine/rendering**: Three.js integration and rendering
    - **/src/engine/utils**: Utility functions for the engine
    - **/src/engine/types**: TypeScript type definitions

  - **/src/ui**: Front-end application code, built with Vue 3, Vite, and TypeScript.
    - **/src/ui/assets**: Static assets (images, fonts, global styles)
    - **/src/ui/components**: Reusable Vue components
      - **/src/ui/components/common**: Shared UI components (buttons, inputs, etc.)
      - **/src/ui/components/layout**: Layout components (headers, footers, etc.)
      - **/src/ui/components/game**: Game-specific UI components
    - **/src/ui/composables**: Vue 3 composition API functions
    - **/src/ui/features**: Feature-based modules
      - **/src/ui/features/auth**: Authentication related components and logic
      - **/src/ui/features/city**: City management features
      - **/src/ui/features/player**: Player-related features
      - **/src/ui/features/social**: Social interaction features
    - **/src/ui/pages**: Top-level page components
    - **/src/ui/router**: Vue Router configuration
    - **/src/ui/stores**: Pinia stores for state management
    - **/src/ui/services**: API services and external integrations
    - **/src/ui/styles**: Tailwind configuration and global styles
    - **/src/ui/types**: TypeScript type definitions
    - **/src/ui/utils**: Utility functions

  - **/src/ai**: AI components and behavior modules.
    - **/src/ai/behaviors**: Individual AI behavior modules
    - **/src/ai/decision**: Decision-making systems
    - **/src/ai/pathfinding**: Pathfinding algorithms
    - **/src/ai/types**: TypeScript type definitions

  - **/src/networking**: Client-side networking code for communicating with the backend.
    - **/src/networking/api**: API client integration
    - **/src/networking/websocket**: WebSocket client integration
    - **/src/networking/models**: Data models for network communication
    - **/src/networking/types**: TypeScript type definitions

- **/public**: Static files that should be served as-is (favicon, robots.txt, etc.)

- **/assets**: Game assets such as models, textures, audio, etc.
  - **/assets/models**: 3D models
  - **/assets/textures**: Texture files
  - **/assets/audio**: Sound effects and music
  - **/assets/animations**: Animation files

### Backend (Go)
- **/cmd**: Main applications.
  - **/cmd/server**: The main API and WebSocket server application.
  - **/cmd/worker**: Any background workers or processes (if needed).

- **/internal**: Private application code.
  - **/internal/auth**: Authentication and authorization logic.
  - **/internal/game**: Game state management and rules.
  - **/internal/api**: API handlers and routing.
  - **/internal/websocket**: WebSocket implementation.
  - **/internal/models**: Data models and schemas.
  - **/internal/database**: Database access and persistence.
    - **/internal/database/postgres**: PostgreSQL repository implementations.
    - **/internal/database/mongodb**: MongoDB repository implementations.
    - **/internal/database/redis**: Redis repository and cache implementations.
    - **/internal/database/migrations**: Database migration scripts and tools.

- **/pkg**: Public library code (if any).

- **/configs**: Configuration files for the backend.
  - **/configs/postgres**: PostgreSQL configuration.
  - **/configs/mongodb**: MongoDB configuration.
  - **/configs/redis**: Redis configuration.

### Shared Resources
- **/doc**: Documentation files including project specs, design docs, task lists, etc.

- **/build**: Build scripts and output directories.

- **/scripts**: Build and deployment scripts.
  - **/scripts/db**: Database maintenance and migration scripts.

- **/tests**: Unit and integration tests.
  - **/tests/unit**: Unit tests for frontend and backend
  - **/tests/integration**: Integration tests
  - **/tests/e2e**: End-to-end tests

## 2. Framework and Library Selections

- **Front-End (UI):**
  - Use Vue 3 as the web framework with TypeScript for type safety.
  - Implement the Composition API for better code organization and type inference.
  - Use Pinia for state management (Vue 3's recommended solution replacing Vuex).
  - Leverage Tailwind CSS 4.x for responsive, utility-first styling with component extraction.
  - Use Vue Router 4.x for page routing with code-splitting capabilities.

- **Game Engine / Rendering:**
  - Use Three.js for 3D rendering in the browser.
  - Implement custom Three.js composables for Vue 3 integration.

- **Physics Simulation:**
  - Implement Cannon.js for physics simulation.
  - Create abstraction layer for physics engine interactions.

- **Backend:**
  - Develop server-side components in Go 1.24 using the standard net/http package.
  - Use WebSockets for real-time communication between frontend and backend.
  - Implement PostgreSQL for user data, authentication, governance, and transactions.
  - Employ MongoDB for game state, content management, and AI-related data.
  - Use Redis for caching, session management, and real-time data.
  - Integrate Zitadel Cloud for authentication and user management.

- **Tooling and Build:**
  - Use Node.js with npm for frontend dependency management.
  - Set up Vite 6 with TypeScript 5 for frontend build tooling.
  - Implement ESLint and Prettier for code quality and formatting.
  - Use Vitest for unit testing Vue components.
  - Use Docker for containerization and deployment.
  - Employ Flyway for PostgreSQL migrations.

## 3. Task List

1. **Finalize Folder Structure**
   [x] Create the initial directory outline as described above, incorporating Vue, Vite, and TypeScript for the front-end.
   [x] Restructure the backend following Go best practices with cmd/internal directory organization.
   [x] Set up the feature-based frontend architecture with Composition API best practices.
   
   Note: The folder structure has been created without adding any code files yet. This provides a clean foundation for our iterative development approach.

2. **Select Front-End Framework**
   [x] Finalize the front-end framework by choosing Vue as the basis for the web application, using the latest version of Vite for build tooling and Tailwind 4.x for styling.
   [x] Document the decision rationale.

3. **Evaluate Rendering Engine Options**
   [x] Compare Three.js and Babylon.js for 3D rendering capabilities in modern browsers.
   [x] Chose Three.js based on its maturity, flexibility, and community support.

4. **Choose a Physics Library**
   [x] Compare features and performance of Cannon.js vs Ammo.js.
   [x] Chose Cannon.js based on its simplicity and adequate performance for our needs.

5. **Outline AI Module Requirements**
   [x] Identify necessary AI behaviors, including simulation of NPC actions, dynamic environment interactions (traffic, events), real-time decision making, and resource optimization.
   [x] Document potential libraries or frameworks, while keeping the option open for custom AI solutions if required.

6. **Select Database Technologies**
   [x] Evaluate database requirements for different use cases (user data, game state, real-time data, etc.).
   [x] Choose PostgreSQL for structured data requiring ACID compliance.
   [x] Select MongoDB for flexible document storage.
   [x] Confirm Redis for caching and real-time operations.
   [x] Document the database strategy and migration approach.

7. **Set Up Project Scaffold**
   [ ] Initialize the frontend project with Vue 3, Vite, TypeScript, and Tailwind CSS:
     - [ ] Set up Vite 6 project with Vue 3 and TypeScript 5
     - [ ] Configure Tailwind CSS 4.x with PostCSS plugins
     - [ ] Set up feature-based folder structure
     - [ ] Configure Pinia for state management
     - [ ] Set up Vue Router with code-splitting
     - [ ] Implement base Composition API utilities
     - [ ] Create initial Three.js integration setup
     - [ ] Configure ESLint and Prettier
     - [ ] Set up Vitest for unit testing

   [ ] Initialize the Go backend project:
     - [ ] Create Go module at root level (go mod init github.com/username/megacity)
     - [ ] Set up cmd/server with basic HTTP server implementation
     - [ ] Implement internal package structure (auth, game, api, websocket, models, database)
     - [ ] Implement WebSocket server capability (using Gorilla WebSocket or similar)
     - [ ] Set up database repository interfaces and implementations
     - [ ] Configure database connections for PostgreSQL, MongoDB, and Redis
     - [ ] Set up Zitadel Cloud authentication integration

   [ ] Configure databases and migrations:
     - [ ] Set up PostgreSQL schemas and initial migrations with Flyway
     - [ ] Create MongoDB collections and indexes
     - [ ] Configure Redis for caching and session management
     - [ ] Implement data access layer with repository pattern
     - [ ] Set up connection pooling and database configuration

   [ ] Configure Docker for development:
     - [ ] Create Dockerfiles for frontend and backend
     - [ ] Set up docker-compose for local development with database services
     - [ ] Configure volume mounting for hot reloading
     - [ ] Create database initialization scripts

   [ ] Implement basic development workflow:
     - [ ] Configure hot reloading for frontend development
     - [ ] Set up Go development tools and live reloading
     - [ ] Create development documentation for the team
     - [ ] Implement database backup and restore procedures

8. **Establish Data Communication**
   [ ] Define WebSocket communication protocol between frontend and backend
   [ ] Create type-safe API client using TypeScript
   [ ] Implement Pinia stores for managing server state
   [ ] Implement basic data models for game state synchronization
   [ ] Create API endpoints for core game functionality
   [ ] Set up data persistence across multiple databases:
     - [ ] Implement user data storage in PostgreSQL
     - [ ] Store game state in MongoDB
     - [ ] Utilize Redis for caching and real-time data

9. **Implement Database Migration Strategy**
   [ ] Set up Flyway for PostgreSQL schema migrations
   [ ] Create migration scripts for schema evolution
   [ ] Implement MongoDB schema versioning strategy
   [ ] Develop data access abstraction layer
   [ ] Create data mappers between domain objects and database entities
   [ ] Document database access patterns and query optimization strategies

10. **Integrate Continuous Integration (CI)**
   [ ] Establish CI workflows to facilitate automated testing and builds
   [ ] Configure testing frameworks for both frontend and backend
   [ ] Set up code quality and linting tools
   [ ] Implement basic security scanning
   [ ] Configure type checking in CI pipeline
   [ ] Add database schema validation checks to CI process

11. **Create Development Environment Documentation**
   [ ] Document development setup instructions
   [ ] Create API documentation
   [ ] Document data models and schemas
   [ ] Create component documentation
   [ ] Document state management patterns
   [ ] Prepare database interaction examples and best practices
   [ ] Prepare contribution guidelines for the team

## 4. Milestones

- **Initial Setup:** Complete the folder structure and project scaffold.
- **Framework Decisions:** Finalize choices for the front-end, rendering engine, physics library, and database technologies.
- **Database Foundation:** Establish database schemas, repositories, and migration strategies.
- **Prototype Build:** Develop an initial working prototype demonstrating the chosen stack.
- **Documentation Update:** Continuously update this document as decisions are made and milestones are reached.

This task list provides the foundation for our implementation plan, focusing on establishing a robust structural and technological base to successfully build the game project.

## Multiplayer and Social Dynamics Implementation

- **User Progression System:** Allow users to start as individuals, create families, rent houses, and eventually construct their own homes.
- **Points and Leveling:** Enable users to earn points through gameplay, leveling up to unlock new features and opportunities.
- **City Mayor Election:** Implement a voting mechanism for eligible users to be elected as city mayors.
- **Mayor Functionalities:** Allow city mayors to construct key public infrastructures (schools, hospitals, cultural centers) and manage city projects and budgets.
- **Inter-City Interactions:** Develop systems for inter-city trade, business, and cooperative events.
- **Democratic Governance:** Integrate a system for democratic decision-making where city project budgets are proposed by the mayor and must be approved by the residents.
