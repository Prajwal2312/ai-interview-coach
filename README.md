# AI Interview Coach

A modern responsive interview-coaching web application built with **HTML, CSS and vanilla JavaScript**.

## Features

- Candidate setup: name, branch, target company, role, difficulty and question count.
- Role-specific technical question generation.
- Text-based answers.
- Browser speech recognition for verbal answers where supported.
- Automatic answer scoring out of 10 using a local coaching engine.
- Strengths, weaknesses and improvement suggestions.
- Progress dashboard.
- Interview history stored in `localStorage`.
- Sample student data.
- Responsive desktop/tablet/mobile UI.
- No API key required for the demo.

## Run

Open `index.html` directly in a browser, or use VS Code Live Server.

For best speech-recognition support, run the app through a local server:

```bash
python -m http.server 5500
```

Then open `http://localhost:5500`.

## Production AI integration

The current demo intentionally uses a local deterministic coaching engine so it runs without an external API. For a production deployment, replace `evaluateAnswer()` and the question-bank lookup with a secure backend endpoint such as:

`POST /api/interview/generate`
`POST /api/interview/evaluate`

Keep API keys on the server, not in browser JavaScript.

## Suggested production stack

Frontend: HTML/CSS/JavaScript or React/Next.js  
Backend: FastAPI / Node.js  
Database: PostgreSQL  
Authentication: OAuth/JWT  
AI: server-side LLM provider  
Speech: Web Speech API or a server-side transcription service  
Deployment: Vercel + Render/Railway/AWS
