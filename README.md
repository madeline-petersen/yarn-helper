# Yarn Helper

A Vue 3 application that helps knitters find compatible yarns for their patterns through intelligent gauge matching and visual swatch previews.

## Overview

Yarn Helper is a specialized tool for knitters that solves a common problem: finding the right yarn for a knitting pattern. The app analyzes knitting patterns, suggests compatible yarns based on gauge compatibility scoring, and provides visual swatch previews to help users understand how their yarn choices will affect the final fabric.

**Why it's interesting:** This app addresses a real pain point in knitting - yarn substitution. Knitters often want to use different yarns than what's specified in patterns, but gauge matching is complex and mistakes can be costly. The app combines data science (Gaussian compatibility scoring) with intuitive visualizations (SVG gauge swatches) to make yarn selection both accurate and accessible.

## Features

- **Pattern Browser**: Browse curated knitting patterns with detailed specifications
- **Intelligent Yarn Suggestions**: Mathematical compatibility scoring using Gaussian distribution modeling
- **Visual Gauge Comparison**: Side-by-side SVG swatch previews showing pattern vs. selected yarn gauge
- **Multi-Strand Support**: Handle complex patterns with multiple yarn strands (e.g., main + carry)
- **Comprehensive Insights**: Weight, gauge, and skein compatibility analysis
- **Accessibility-First Design**: Full keyboard navigation, ARIA labels, and screen reader support
- **Responsive Layout**: Mobile-optimized interface with touch-friendly controls

### Non-Trivial Features

- **Gaussian Compatibility Scoring**: Uses mathematical modeling to score yarn compatibility based on gauge differences, reflecting real-world knitting behavior
- **SVG Gauge Visualization**: Custom-built swatch previews that dynamically render stitch grids based on gauge calculations
- **Multi-Strand Gauge Calculation**: Harmonic mean calculations for combining multiple yarn gauges
- **Contextual Swatch Guidance**: Dynamic advice based on compatibility scores and gauge differences

## Tech Stack

- **Vue 3** with Composition API and TypeScript
- **Vite** for fast development and optimized builds
- **Vue Router** for client-side routing
- **Pinia** for state management
- **TypeScript** for type safety
- **ESLint + Prettier** for code quality
- **Vitest** for unit testing
- **Playwright** for end-to-end testing

## Data Source

**Fixed Dataset (Option B)**: The app uses locally bundled JSON data files:

- `src/data/patterns.ts` - Curated knitting patterns with detailed specifications
- `src/data/yarns.ts` - Comprehensive yarn database with gauge, weight, and fiber information

**Data Structure**:

- Patterns include gauge requirements, yarn weights, techniques, and photo URLs
- Yarns include gauge specifications, fiber content, and skein information
- All data is strongly typed with TypeScript interfaces

**Parsing**: Data is imported as TypeScript modules with compile-time type checking, ensuring data integrity and providing excellent developer experience.

## Getting Started

### Prerequisites

- Node.js ^20.19.0 || >=22.12.0
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd yarn-helper

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run test` - Run unit tests
- `npm run test:unit` - Run unit tests in watch mode
- `npm run test:e2e` - Run end-to-end tests with Playwright
- `npm run lint` - Run ESLint with auto-fix
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking

## Accessibility & UX

The app implements comprehensive accessibility features:

- **Semantic HTML**: Proper heading hierarchy, definition lists, and landmark roles
- **ARIA Labels**: Descriptive labels for all interactive elements and complex UI components
- **Keyboard Navigation**: Full keyboard support with logical tab order and focus management
- **Screen Reader Support**: `aria-labelledby`, `aria-describedby`, and `role` attributes
- **Reduced Motion**: Respects `prefers-reduced-motion` for animations
- **Focus Management**: Smooth scrolling to focused elements with reduced motion support
- **Color Contrast**: High contrast ratios for text and interactive elements
- **Responsive Design**: Touch-friendly interface with appropriate target sizes

## Performance & Lighthouse Basics

- **Vite Build**: Optimized production builds with tree-shaking and code splitting
- **Image Optimization**: Proper `loading`, `decoding`, and `sizes` attributes
- **Lazy Loading**: Route-based code splitting for pattern views
- **Efficient Rendering**: Computed properties and reactive updates
- **Bundle Analysis**: Optimized dependencies and minimal bundle size

## Engineering Practices

### Type Safety

- **Comprehensive TypeScript**: All components, composables, and utilities are fully typed
- **Domain Types**: Centralized type definitions in `src/types/domain.ts`
- **API Layer**: Typed data imports with compile-time validation

### State Management

- **Composables Pattern**: Custom composables for business logic (`useYarnSuggestions`, `useGaugeInsights`, etc.)
- **Reactive State**: Vue 3's reactivity system with computed properties
- **Pinia Available**: Installed but not used (composables pattern preferred)

### Error Handling

- **Loading States**: Skeleton loaders and loading indicators
- **Empty States**: Graceful handling of missing data
- **Error Boundaries**: Pattern not found and error fallbacks
- **Validation**: Input validation and data integrity checks

### Code Organization

```
src/
├── components/     # Reusable UI components
├── composables/    # Business logic and state management
├── data/          # Static data files
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
├── views/         # Page components
└── router/        # Vue Router configuration
```

## Visualizations

### SVG Gauge Swatch Preview

The app features a custom-built SVG visualization component (`GaugePreviewSvg.vue`) that:

- **Renders Stitch Grids**: Dynamic SVG grids showing pattern vs. selected yarn gauge
- **Visual Comparison**: Side-by-side swatches with different colors and scales
- **Responsive Design**: Adapts to different screen sizes
- **Accessibility**: Proper ARIA labels and semantic markup
- **Performance**: Efficient rendering with minimal DOM manipulation

**Why it helps**: Knitters can visually understand how their yarn choice will affect the final fabric density, making gauge differences tangible and easier to interpret.

## Trade-offs & Future Work

### Current Simplifications

- **Static Data**: Local JSON files instead of Ravelry API (API approval process can take weeks)
- **Combined Gauge Model**: Uses harmonic mean for multi-strand calculations (simplified but effective)
- **No Fabric Analysis**: Skipped advanced fabric properties in favor of core functionality

### Future Enhancements

- **Ravelry API Integration**: Connect to Ravelry API for dynamic pattern and yarn data
  - Add loading states for data fetching
  - Implement error handling for API failures
  - Cache API responses for better performance
- **Yarn Stash Integration**: Allow users to select any yarn from database dropdown
  - Enable insights for yarns users are considering or have in their stash
  - Support custom yarn additions
- **Fabric Analysis**: Implement advanced fabric property analysis
  - Drape, texture, and structure predictions
  - Fiber-specific behavior modeling
- **Enhanced Testing & Quality**: More comprehensive test coverage and code review
  - Additional e2e tests for edge cases
  - Unit tests for all composables and utilities
  - Thorough accessibility audit and improvements
  - Edge case handling and error state management

### If Starting Over

I would prioritize fewer features in favor of:

- Thorough code review and refactoring
- Comprehensive test coverage (unit + e2e)
- Edge case handling and error state management
- Accessibility audit and improvements
- Performance optimization and best practices review

## Nice-to-haves Implemented

✅ **Visualization**: Custom SVG gauge swatch previews  
✅ **Simple Routing**: Detail page + list with Vue Router  
✅ **E2E Testing**: Playwright tests for core user flows

## Requirement Traceability

### Must-haves

- [x] **TypeScript**: Full TypeScript implementation with strict typing (`tsconfig.json`, all `.ts`/`.vue` files)
- [x] **Project Scripts**: `dev`, `build`, `test` scripts defined in `package.json`
- [x] **Linting/Formatting**: ESLint + Prettier configured (`eslint.config.ts`, `.prettierrc`)
- [x] **Readme Sections**: All required sections present with proper structure
- [x] **Git History**: Meaningful commits with descriptive messages (verified in git log)
- [x] **AI Usage Transparency**: Code comments and `AI_USAGE.md` document AI assistance

### Nice-to-haves (Selected)

- [x] **Visualization**: SVG gauge swatch previews (`GaugePreviewSvg.vue`)
- [x] **Simple Routing**: Vue Router with home and pattern detail pages (`src/router/index.ts`)
- [x] **E2E Testing**: Playwright tests for core flows (`e2e/` directory)

## AI Usage

This project uses AI assistance for several components, documented in code comments:

- **Gauge Compatibility Scoring**: Gaussian distribution modeling for yarn compatibility
- **SVG Visualization**: Gauge swatch preview component structure
- **Composables**: All 6 business logic composables (gauge, weight, yarn suggestions, skein insights, natural language descriptions)
- **E2E Tests**: Playwright test scaffolding for all test files
- **Natural Language**: Pattern and summary description functions

See `AI_USAGE.md` for detailed documentation of all AI-assisted sections.
