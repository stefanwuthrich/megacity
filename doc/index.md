# Megacity MMO Browser Game Documentation Index

This documentation index provides a comprehensive guide to all documentation files related to the Megacity MMO Browser Game project. Use this index to quickly find information about specific aspects of the project.

## Project Overview

- [Project Concept](project.md) - Overview of the Megacity browser-based MMO game concept, core gameplay features, and technical aspects.
- [System Requirements](system-requirements.md) - Hardware, software, and networking requirements for running the game.
- [System Design](system-design.md) - High-level architecture and detailed component breakdown of the game system.

## Requirements Documents

- [Frontend Requirements](frontend-requirements.md) - UI framework, tooling, and design decisions for the web-based game interface.
- [Backend Requirements](backend-requirements.md) - Server-side technology stack, architecture, and requirements for game state management and multiplayer functionality.
- [AI Requirements](ai-requirements.md) - Artificial intelligence implementation details for NPC behavior, dynamic environments, and real-time decision making.
- [Engine Physics](engine-physics.md) - Physics engine requirements and design using Cannon.js for realistic interactions within the game world.

## Implementation and Gameplay

- [Implementation](implementation.md) - Detailed task plan for building the game, including phases, required tools, and milestones.
- [Gameplay](gameplay.md) - Game mechanics, player experience, and features that create the dynamic city simulation experience.
- [Tasks](tasks.md) - Implementation tasks including folder structure, framework definitions, and development milestones.

## Project Structure

### Frontend (/src)
- Modern feature-based architecture with Vue 3 and TypeScript
- Composition API for better reusability and type safety
- Component organization following UI component hierarchy
- State management with Pinia stores
- Three.js integration via custom composables
- Type-safe networking and API services

### Backend (Go)
- CMD-based application structure
- Internal packages for game logic, API, and data
- RESTful and WebSocket API endpoints
- Couchbase and Redis integration

## Key Features

### Technology Stack
- Vue 3 with Composition API and TypeScript 5
- Tailwind CSS 4.x for utility-first styling
- Pinia for state management
- Vue Router 4.x with code-splitting
- Three.js for 3D rendering
- Cannon.js for physics simulation
- Go 1.24 for backend services
- WebSockets for real-time communication
- Couchbase and Redis for data persistence and caching
- Zitadel for authentication

### Game Mechanics
- Dynamic city simulation with AI-driven citizens
- Player progression from individual to city mayor
- Democratic governance system with player voting
- Inter-city trade and cooperation
- Real-time physics and environmental simulation

## Development Practices
- Feature-based module organization
- Strong typing throughout with TypeScript
- Component documentation and style guides
- Comprehensive testing with Vitest
- CI/CD pipeline with automated testing and deployment
- Docker-based development environment

## How to Use This Documentation

1. Start with the [Project Concept](project.md) to understand the overall vision.
2. Review the [System Design](system-design.md) to understand the architecture.
3. Explore specific requirement documents based on your area of interest.
4. Refer to [Tasks](tasks.md) for implementation details and current development status.

This index will be updated as new documentation is added to the project. 