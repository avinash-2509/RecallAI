# RecallAI Interview Guide

## Architecture Overview

RecallAI is an npm-workspace monorepo. The Vite/React client owns interaction state and sends one generation request to Express. Express validates request data, builds an injection-resistant educational prompt, calls the configured provider (Groq by default) with structured output, validates the response with Zod, assigns trusted IDs, and returns JSON. The browser converts that contract into flashcards and quizzes and saves completed sets to validated `localStorage`.

The important boundary is: **model output is data, never UI code**. React renders strings using its normal escaping behavior. No raw HTML or `eval` is used.

## Important Components

- `App.jsx`: view coordination, active session, saved-session collection, and storage warnings.
- `StudyGenerator.jsx`: controlled form, input limits, mode/difficulty/count choices, and examples.
- `FlashcardViewer.jsx`: card navigation, flip state, understanding map, keyboard shortcuts, and review filtering.
- `QuizPlayer.jsx`: explicit quiz phases, isolated answer maps, feedback, results, review, and retest.
- `SavedStudySets.jsx`: reopening and confirmed deletion of locally saved sessions.
- `useStudyGenerator.js`: async lifecycle, AbortController, retry data, cleanup, and stale-response guard.
- `studySchema.js` on the server: request and AI-output trust boundary.
- `geminiService.js`: provider-specific code isolated from routes and React.

## React Hooks Used and Why

- `useState` models local UI state: page, form fields, card position, understanding status, and quiz phase.
- `useEffect` installs and removes flashcard keyboard handlers and aborts a generation request on unmount.
- `useRef` stores the AbortController, last request, and monotonically increasing request sequence without causing renders.
- `useMemo` derives the difficult-card list from cards and status; it avoids maintaining a second mutable list.

No global state library is necessary because state ownership is shallow and the app has one active study session.

## AI Request and Response Flow

1. The controlled form blocks blank or very short input and enforces a 12,000-character maximum.
2. `useStudyGenerator` aborts the prior request, increments its sequence, and sends the request through `studyApi.js`.
3. Express validates input with `generateRequestSchema`.
4. `promptBuilder.js` describes quantity and difficulty, and delimits user material as untrusted source content.
5. `geminiService.js` requests `application/json` constrained by a JSON Schema.
6. `parseAndNormalizeStudySet` safely parses text, validates it with Zod, checks the requested mode, caps item counts, and assigns deterministic local item IDs.
7. The client checks the response shape again, creates a browser session ID, saves the set, and renders interactive components.

## JSON Validation

Provider schema enforcement improves consistency but is not a security boundary. The server still handles empty text, JSON parse failure, wrong properties, missing fields, incorrect option counts, answer indexes outside 0–3, and missing requested-mode content. The policy is strict for malformed items: the result is rejected rather than silently changing an arbitrary correct answer. Returning fewer otherwise-valid items is allowed and the UI displays the real array length.

## AbortController and Stale Responses

`AbortController` stops browser waiting and asks the network layer to cancel. That is not enough because an already-resolving promise or non-cooperative upstream may still finish. Each generation captures a sequence number. Before every success, error, or cleanup state change, it checks that the captured number equals the latest ref. Canceling or starting a new request increments the ref, making every older completion inert.

The server also creates a controller for the provider request. It aborts on timeout or when the client connection closes.

## Quiz Scoring and Retests

Answers are stored as `{ [questionId]: selectedOptionIndex }`. `scoreQuiz` compares each answer with `correctAnswer` and derives correct, incorrect, total, and percentage. `incorrectQuestions` filters the current attempt's question list. Retest calls the same quiz initializer with that filtered list and a brand-new empty answer map, so answers from the prior attempt cannot leak into the retest.

## Likely Interview Questions

### 1. Why validate the AI response if the provider already receives a JSON Schema?

External services and model output are never trusted boundaries. SDK behavior, partial responses, model changes, or upstream defects can still violate assumptions. Zod gives the application a runtime guarantee before data reaches React.

### 2. Why use both AbortController and a request ID?

Abort is cooperative and does not guarantee that no asynchronous callback will resolve. The identity check makes stale responses harmless even when cancellation loses a race.

### 3. Why is quiz state represented by phases?

One `phase` value (`intro`, `answering`, `results`, `review`) prevents impossible combinations such as “completed and answering.” Other fields only have meaning within the relevant phase.

### 4. How is prompt injection from pasted notes reduced?

System instructions and the prompt both define notes as source material, delimit them, and say embedded instructions must not change behavior. Output is schema-constrained and validated. This reduces risk, though no prompt defense is perfect.

### 5. What would you change for a production multi-user app?

Add authentication, server-side persistence, encrypted secret management, per-user and per-IP quotas, observability, content safety policies, provider retries with backoff, source citations, end-to-end tests, and a privacy/data-retention policy.
