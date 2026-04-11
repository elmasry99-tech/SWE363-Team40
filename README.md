# CypherNet Front-End

CypherNet is a Next.js front-end for a secure multi-tenant communication platform. The app includes role-based flows for:

- System Administrator
- Organization Security Officer
- Internal Secure End-User
- Guest User

This repository currently focuses on front-end behavior and interaction design. It is structured so backend services can be integrated later.

## Current Features

- role-based sign-in
- approval-based sign-up for internal employees and organization security officers
- admin dashboard for organization creation, editing, activation, suspension, and audit history
- organization officer controls for policies, retention, user approvals, user activation/disable, room oversight, and reports
- internal secure rooms with room creation, join-by-code, room codes, chat, file sharing, and local call controls
- guest access verification, waiting state, admitted room flow, chat, uploads, and local call controls
- local browser media support for camera, microphone, and screen sharing in the meeting UI

## Tech Stack

- Next.js 16
- React 19
- Tailwind CSS 4
- Lucide React

## Project Structure

```text
front-end/
├── public/
│   ├── icons/
│   ├── images/
│   └── mock/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── guest/
│   │   ├── profile/
│   │   ├── reports/
│   │   ├── rooms/
│   │   ├── globals.css
│   │   ├── layout.jsx
│   │   └── page.jsx
│   ├── components/
│   ├── data/
│   ├── features/
│   ├── hooks/
│   └── lib/
├── .env.example
├── package.json
└── README.md
```

## Installation

1. Open a terminal in the project:

```bash
cd /Users/mac/Desktop/SWE363/Project/SWE363-Team40/front-end
```

2. Install dependencies:

```bash
npm install
```

## Running The Website

Start the development server:

```bash
npm run dev
```

Then open:

- [http://localhost:3000](http://localhost:3000)

Useful commands:

```bash
npm run lint
npx next build --webpack
```

## Main Routes

- `/` access portal with sign-in and sign-up
- `/auth` alternate entry route to the same access experience
- `/auth/pending` pending approval page for officer/internal sign-up
- `/admin/platform` system administrator dashboard
- `/admin/platform/new` create organization flow
- `/admin/platform/[orgSlug]/edit` edit organization flow
- `/admin/organization` organization security officer workspace
- `/dashboard` dashboard for non-admin roles
- `/rooms` internal room list
- `/rooms/[roomId]` internal room workspace
- `/guest` guest room experience
- `/reports` reports page
- `/profile` editable profile page

## Notes About Media Features

The meeting UI currently supports local browser media actions:

- turn camera on/off locally
- turn microphone on/off locally
- start/stop screen sharing locally

This works in the browser without backend integration. Real multi-user live calling still needs WebRTC signaling and backend support.

## Team
    - Belal Shebl,  Frontend Developer, s202361930
    - Mazen Abdelatty,WebRTC, SocketCluster, Media Specialist, s202277380
    - Fuad Anabosi, Backend Developer, s202367450 
    - Loay Shqair, Database Designer, s202365030

All members contribute to each submission but based on the task there is a main member that directs the work and oversees it. For example, for the front-end, Belal was the member overseeing the work and was the main member for this task, while all other members also contributed to help him. 