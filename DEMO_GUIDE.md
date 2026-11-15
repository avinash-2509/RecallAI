# RecallAI Demo Guide

This 2–3 minute flow demonstrates the core assignment requirements without rushing.

## Before Recording

- Add a valid Groq key to `server/.env` and run `npm start`.
- Generate one small set in advance so **My Study Sets** is populated.
- Use a short, specific topic and 5 items for a predictable recording length.
- Keep DevTools closed unless you plan to demonstrate an API error.

## Suggested Script

**0:00–0:25 — Introduce and generate**

“RecallAI turns notes or a topic into stateful learning components rather than a chat response.” Paste a topic, select **Both**, **Beginner**, and **5**, then click **Generate Study Set**. Point out the cancel option and loading state.

**0:25–0:55 — Study flashcards**

Open a flashcard, flip it, mark one **Got it** and another **Need review**. Mention keyboard controls and show **Review difficult** so the filtered study loop is visible.

**0:55–1:35 — Take the quiz**

Switch to Quiz, answer at least one question incorrectly, and show the immediate correct-answer highlight and explanation. Complete the quiz quickly and call out the score summary.

**1:35–1:55 — Review and retest**

Choose **Review mistakes**, show the user's answer, correct answer, and explanation, then click **Retest these questions**. Explain that a new isolated attempt is created from only the missed questions.

**1:55–2:15 — Persistence**

Open **My Study Sets**, reopen a prior set, and explain that this uses validated browser storage and does not call the model again.

**2:15–2:35 — Reliability**

Optionally stop the API and attempt generation, or temporarily use an invalid key, to show the recoverable error and Retry action. Explain that malformed AI output is rejected on the server and stale requests are blocked by both cancellation and a request-sequence check.

**2:35–2:50 — Close**

Briefly show the responsive mobile layout and conclude with the server-only key, structured output, and test suite.

Do not claim that a flow was manually tested unless you actually performed it before recording.
