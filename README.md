# Async Race

**Self-assessment score: 400/400**

**Deployed application:** https://async-race-amber.vercel.app/

**Frontend repository:** https://github.com/BTavkhelidze/async-race

**Mock server:** https://github.com/mikhama/async-race-api

## Overview

Async Race is a React Single Page Application for managing cars, controlling their engines, running asynchronous races, and displaying winner statistics.

The application contains two main views:

- **Garage**
- **Winners**

The race takes place directly inside the Garage view. After the first successful car reaches the finish line, the application displays the winner and saves or updates its statistics in the Winners view.

Only the frontend application is deployed.

## Main Features

### Garage

- Display all cars
- Display seven cars per page
- Create a new car
- Update a selected car
- Delete a car
- Select a car color
- Generate 100 random cars
- Start or stop an individual car
- Start a race for all cars on the current page
- Reset all cars to their initial positions
- Display the race winner
- Preserve form and pagination state between views

### Winners

- Display saved race winners
- Display ten winners per page
- Show car number, dynamically colored car icon, name, wins, and best time
- Sort by wins
- Sort by best time
- Support ascending and descending order
- Preserve pagination and sorting state between views

## Technology Stack

- React
- TypeScript
- Vite
- React Router
- Zustand
- TanStack Query
- Tailwind CSS
- Fetch API
- ESLint
- Prettier
- npm

## State Management

The application separates server state and client-side UI state.

### TanStack Query

TanStack Query is used for:

- Fetching cars
- Fetching winners
- Creating cars
- Updating cars
- Deleting cars
- Creating winner records
- Updating winner records
- Deleting winner records
- Loading and error states
- Query caching
- Query invalidation

### Zustand

Zustand is used for:

- Garage pagination
- Winners pagination
- Create form state
- Update form state
- Selected car state
- Winners sorting
- Race status
- Individual car animation state
- Winner announcement state
- Preserving UI state between route changes

API data is not duplicated inside Zustand.

## Application Flow

```text
Garage
  │
  ├── Manage cars
  ├── Start or stop individual cars
  └── Start race
        │
        ├── Start engines
        ├── Receive velocity and distance
        ├── Animate cars
        ├── Handle failed drive requests
        └── Detect first successful finisher
              │
              ├── Show winner announcement
              └── Save or update winner statistics
                    │
                    └── Display result in Winners
```

## Project Structure

```text
src/
├── app/
│   ├── providers/
│   │   └── QueryProvider.tsx
│   ├── router/
│   │   └── AppRouter.tsx
│   └── App.tsx
│
├── pages/
│   ├── garage/
│   │   └── GaragePage.tsx
│   └── winners/
│       └── WinnersPage.tsx
│
├── features/
│   ├── garage/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── store/
│   │   ├── types/
│   │   └── utils/
│   │
│   ├── race/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── store/
│   │   ├── types/
│   │   └── utils/
│   │
│   └── winners/
│       ├── api/
│       ├── components/
│       ├── hooks/
│       ├── store/
│       ├── types/
│       └── utils/
│
├── shared/
│   ├── api/
│   ├── components/
│   ├── constants/
│   ├── hooks/
│   ├── types/
│   └── utils/
│
├── assets/
├── index.css
└── main.tsx
```

## Architectural Principles

- API logic is separated from components.
- Server state is managed with TanStack Query.
- UI state is managed with Zustand.
- Business logic is placed in custom hooks and utilities.
- Reusable UI elements are placed in shared components.
- Magic numbers and strings are stored in constants.
- Functions have a single responsibility.
- Functions do not exceed 40 lines.
- TypeScript strict mode is enabled.
- Implicit `any` is not allowed.
- React components do not call `fetch` directly.

## Race Logic

For every car:

1. Start the engine.
2. Receive velocity and distance.
3. Calculate animation duration.
4. Start the animation.
5. Send the drive request.
6. Stop the animation if the drive request fails.

Animation duration:

```text
duration = distance / velocity
```

The finish position is calculated from the current track width so that animation remains responsive.

The UI supports screen widths down to 500 pixels.

A car with a failed drive request cannot become the winner.

## Actions During a Race

To keep behavior predictable, car-changing actions are disabled while a race is active.

Blocked actions:

- Create car
- Update car
- Delete car
- Generate random cars
- Change Garage page
- Start another race

Navigation to Winners may remain available, while the Garage race state is preserved.

## Form Validation

Car names are validated before submission.

Rules:

- Remove leading and trailing spaces
- Reject empty values
- Reject whitespace-only values
- Reject names longer than the configured maximum length
- Display validation messages
- Disable submission for invalid forms

## Pagination

Garage:

```text
7 cars per page
```

Winners:

```text
10 winners per page
```

Pagination is requested from the server.

When the last car on a Garage page is deleted and the page becomes empty, the application moves to the previous available page.

## Winners Logic

When a car wins for the first time:

- Create a winner record
- Set wins to `1`
- Save the race time

When the same car wins again:

- Increment wins
- Update best time only when the new time is faster

Sorting is applied to the complete winners collection through server query parameters.

## Commit Convention

The project follows Conventional Commits.

Examples:

```text
init: add initial Vite React and TypeScript template
chore: configure project dependencies
chore: configure Tailwind CSS
chore: configure ESLint and Prettier
feat: add application navigation
feat: implement car creation
feat: implement garage pagination
feat: add individual engine controls
feat: implement async race
feat: add winners statistics
fix: stop car animation after drive failure
refactor: extract reusable API client
docs: update project documentation
```

## Deployment

Only the frontend is deployed.

**Deployment platform:** Vercel

**Deployment URL:** https://async-race-amber.vercel.app/

The evaluator must run the original mock server locally before opening the deployed frontend.

## Self-assessment Checklist — 400/400

### UI Deployment

- [x] Deploy the frontend application.
- [x] Add the deployment URL at the top of README.

### Commits and Repository

- [x] Follow Conventional Commits.
- [x] Include the checklist in README.
- [x] Include the self-assessment score.
- [x] Add the final deployment URL.

## Basic Structure — 80/80

- [x] **Two Views — 10 points**
  - Implement Garage and Winners.

- [x] **Garage View Content — 30 points**
  - Display Garage title.
  - Display creation and editing controls.
  - Display race controls.
  - Display Garage cars.

- [x] **Winners View Content — 10 points**
  - Display Winners title.
  - Display Winners table.
  - Display pagination.

- [x] **Persistent State — 30 points**
  - Preserve Garage page.
  - Preserve Winners page.
  - Preserve create form values.
  - Preserve edit form values.
  - Preserve sorting state.

## Garage View — 90/90

- [x] **CRUD Operations — 20 points**
  - Create cars.
  - Update cars.
  - Delete cars.
  - Validate names.
  - Delete related winner records.

- [x] **Color Selection — 10 points**
  - Select car color.
  - Apply color to car image.

- [x] **Random Car Creation — 20 points**
  - Generate 100 cars.
  - Use at least 10 brands.
  - Use at least 10 models.
  - Generate random colors.

- [x] **Car Management Buttons — 10 points**
  - Add Select button.
  - Add Delete button.

- [x] **Pagination — 10 points**
  - Display seven cars per page.

- [x] **Empty Garage — 10 extra points**
  - Show a user-friendly message.

- [x] **Empty Garage Page — 10 extra points**
  - Move to the previous page after deleting the last car.

## Winners View — 50/50

- [x] **Display Winners — 15 points**
  - Save and display winners.

- [x] **Pagination — 10 points**
  - Display ten winners per page.

- [x] **Winners Table — 15 points**
  - Display number.
  - Display car image.
  - Display name.
  - Display wins.
  - Display best time.
  - Increment wins.
  - Update only faster times.

- [x] **Sorting — 10 points**
  - Sort by wins.
  - Sort by time.
  - Support ascending order.
  - Support descending order.

## Race — 170/170

- [x] **Start Engine Animation — 20 points**
  - Start engine.
  - Wait for response.
  - Animate car.
  - Send drive request.
  - Stop animation on failure.

- [x] **Stop Engine Animation — 20 points**
  - Stop engine.
  - Return car to start.

- [x] **Responsive Animation — 30 points**
  - Support responsive tracks.
  - Support screens down to 500px.

- [x] **Start Race — 10 points**
  - Start all cars on the current page.

- [x] **Reset Race — 15 points**
  - Stop animations.
  - Return cars to start.
  - Clear winner.

- [x] **Winner Announcement — 5 points**
  - Display winner name.
  - Display winning time.

- [x] **Button States — 20 points**
  - Disable invalid actions.
  - Prevent duplicate starts.
  - Show loading states.

- [x] **Actions During Race — 50 points**
  - Handle create action.
  - Handle update action.
  - Handle delete action.
  - Handle random generation.
  - Handle pagination.
  - Handle view navigation.

## Prettier and ESLint — 10/10

- [x] **Prettier — 5 points**
  - Configure `format`.
  - Configure `ci:format`.

- [x] **ESLint — 5 points**
  - Configure Airbnb rules.
  - Configure `lint`.
  - Enable strict TypeScript.
  - Enable `noImplicitAny`.

## Current Status

```text
Project setup: In progress
Garage: Implemented
Race: Implemented
Winners: Implemented
Deployment: Completed
Self-assessment: 400/400
```
