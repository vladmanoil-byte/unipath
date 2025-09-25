# React UI Prototype for University Application Platform

A front-end-only MVP that helps EU students discover universities, manage application tasks, and complete an onboarding profile. The project focuses on clean, accessible UI and local state management using React, React Router, and Tailwind CSS.

## Overview
- **Target users:** EU undergraduates exploring programmes across Europe.
- **Tech stack:** React 18 + Vite, React Router for client-side routing, Tailwind CSS for styling, localStorage for persistence, and mock JSON data for universities, user profile, and applications.
- **Design goals:** Fast, mobile-first experience with generous whitespace, semantic HTML, keyboard accessibility, and informative feedback (e.g., skeleton loaders, progress indicators, and deadline badges).

## Modules
### University Search & Discovery
- Prominent keyword search with debounce and multi-select filters for countries, fields, languages, and tuition ranges.
- Desktop layout keeps filters in a sidebar; on mobile the filters collapse into a drawer for space efficiency.
- Sorting options (ranking, tuition, upcoming deadlines) and a reset button prevent users getting “stuck” in filtered states.
- Responsive card grid summarises logo, location, tuition, ranking, and next deadline with urgency colour-coding.
- Recommendation strip surfaces universities that intersect with the user profile preferences; falls back to top-ranked picks if onboarding is incomplete.
- Compare workflow lets students select universities and open a sticky compare bar that routes to the comparison table.

### University Detail & Compare
- Detail view showcases hero imagery, key facts, deadlines, entry criteria, and programmes in tabbed sections.
- Actions allow adding the university to applications (creates a draft checklist) or toggling compare selection.
- The compare page renders a horizontally scrollable table on small screens, aligning tuition, language, ranking, deadlines, and entry criteria for side-by-side evaluation.

### Application Tracking & Dashboard
- KPI counters summarise applications by status (in progress, submitted, accepted, rejected) using colour-coded badges.
- Application cards reveal progress bars based on checklist completion, next deadline badges, and quick actions.
- Drawer view exposes editable task lists (with overdue styling), inline notes, and a calendar widget that highlights upcoming deadlines using severity colours.
- Notification bell aggregates deadline and task reminders with dismissible items to keep applicants proactive.

### Profile Onboarding & Profile Page
- Three-step onboarding wizard (academics, interests & countries, preferences) with inline validation and progress indicator.
- Supports GPA scale toggle (0–10 or 0–4), language preferences, and budget range inputs; completion persists to localStorage and recalibrates recommendations.
- Profile page summarises academics and preferences with edit controls, plus simple “fit insight” pills and a resume preview modal for future export flows.

### Landing & Marketing Experience
- Responsive landing page at `/` with hero, value propositions, EU country strip, feature highlights, testimonials, CTA banner, and footer.
- Primary CTA directs to the onboarding wizard while secondary navigation links surface Search, Dashboard, and Profile routes.

## Mock Data
`src/mockData.js` seeds:
- 12+ universities with country, language, tuition, ranking, deadlines, entry criteria, programmes, logos, and imagery references.
- A sample user profile with academics, tests, and preference scaffolding.
- Application records containing status, checklists, and next-deadline metadata used across dashboard components.

## Accessibility & UX Considerations
- Semantic sections, aria labels, and focus-visible styles applied across inputs and interactive elements.
- Skeleton loaders communicate loading states; cards and drawers use consistent spacing and shadow depth for hierarchy.
- Badges and chips employ colour and iconography to reinforce urgency and completion without relying solely on colour perception.

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Launch the development server:
   ```bash
   npm run dev
   ```
   Visit the printed `localhost` URL to explore the app with hot module reload.
3. Lint the project (fails on warnings):
   ```bash
   npm run lint
   ```
4. Produce a production build:
   ```bash
   npm run build
   ```
5. Preview the production bundle locally:
   ```bash
   npm run preview
   ```

## Project Structure
```
src/
  App.jsx
  main.jsx
  index.css
  context/AppContext.jsx
  lib/storage.js
  mockData.js
  components/
    layout/
    marketing/
    search/
    dashboard/
    shared/
    wizard/
  routes/
    LandingPage.jsx
    SearchPage.jsx
    UniversityDetailPage.jsx
    ComparePage.jsx
    DashboardPage.jsx
    ProfileOnboarding.jsx
    ProfilePage.jsx
    Wizard.jsx
```

## License
Prototype source for evaluation purposes only. No commercial licence granted.
