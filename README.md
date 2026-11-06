# FORGE AI — Fitness, built around you

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/kotahasini12/forge-ai)

A local-first fitness coaching web app starter built with React + Vite and Express.
This first milestone includes a searchable exercise library, muscle-group filters,
difficulty/equipment filters, exercise details, and a guided workout timer.

## Requirements
- Node.js 20+ (LTS recommended)
- npm

## Run locally
```bash
npm install
npm run dev
```
- Frontend: http://localhost:5173
- API: http://localhost:5000/api/health

## Project structure
```text
forge-ai/
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   ├── data/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   └── package.json
├── server/                 # Express API
│   ├── src/
│   │   └── index.js
│   └── package.json
└── README.md
```

## Build roadmap
1. Exercise library + guided workout
2. Weekly workout planner, saved workout history, and progress summary (local storage)
3. Nutrition planner with Indian meal options and preference/allergy filters
4. Rule-based fitness assistant with clearly sourced guidance
5. Express + MongoDB persistence and secure authentication
6. Optional browser-side pose estimation for selected exercises
7. Tests, accessibility, deployment, and interview-ready documentation

## Important notes
- No paid API is required to run this starter.
- The demo motion is an original CSS illustration, not a real human movement
  recording and not proof of correct exercise form.
- Camera-based rep counting will be added only for exercises that can be
  validated reliably. Camera frames should be processed locally in the browser.
- Nutrition guidance will be general wellness information, not medical advice.
