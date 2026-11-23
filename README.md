# StudySpot

**Find your space. Find your focus.**

StudySpot is a responsive student-focused campus study-space finder. Students can explore study spaces, search by name or building, filter by study atmosphere and amenities, and submit a demo seat reservation.

## Run locally

Requirements: Node.js 18 or newer.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually http://localhost:5173).

## Production build

```bash
npm run build
npm run preview
```

## Features

- Responsive landing page and campus space directory
- Live search by space name, building, description, or tags
- Filters for Quiet / Moderate / Group study vibes
- Optional filters for open seats and power outlets
- Reservation form with name, student ID, and session duration
- Confirmation screen and demo seat-count updates

## Prototype limitations

This is a front-end prototype using sample campus locations and availability. A reservation only changes the in-memory demo data in the current browser session. It does **not** create a real booking, authenticate students, or connect to a campus occupancy system.

A production version would need a campus-managed database/API, verified student authentication, real-time occupancy data, server-side reservation validation, and clear booking/cancellation rules.

## Tech stack

React, TypeScript, Vite, Lucide icons, and custom responsive CSS.

## Project

Created for a design sprint concept: **Option A — Study Spot Finder**.