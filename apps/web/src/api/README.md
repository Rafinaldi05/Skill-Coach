# API hooks

Set `VITE_API_URL` (default `http://localhost:3000`, no `/api` prefix).
Existing QueryClientProvider is reused. All HTTP response contracts come from `@skill-coach/shared`.

```tsx
import { useLogin, useProjects, useCreateVersion, useVersion, useReviewFeedback, usePortfolio } from './api';
// login.mutate({ email, password })
// useProjects(): infinite query; fetchNextPage() uses the backend cursor.
// useCreateVersion(projectId).mutate({ textContent })
// useVersion(versionId): polls every 3s while queued/processing.
// useReviewFeedback(reviewId).mutate({ helpful: true })
// usePortfolio(username): public, does not send auth tokens.
```

Other exports: useRegister, useLogout().logout(), useProfile, useUpdateProfile,
useQuota, useUpdateProject, useDeleteProject, useProgress, useRetryVersion,
useReview (takes versionId), refreshSession, ApiError, apiFetch.

Wire version statuses are uppercase; parsed statuses are queued/processing/done/failed.
Review records expose backend camelCase `nextSteps`, not LLM output `next_steps`.
There is no GET project detail or GET review endpoint. Review retrieval uses version detail.
Mount either useVersion or useReview in a view, not both for the same ID.
Polling stops on terminal status or after query errors exhaust bounded retries.

Access token lives in memory; rotated refresh token lives in sessionStorage, scoped to this tab.
Private queries restore access via refresh before fetching. Refresh is single-flight and retries
an unauthorized request at most once. Storage is readable by JavaScript: XSS can steal refresh
tokens; HttpOnly cookies require a separate backend change. Logout is local only (no server logout route).
Session boundaries cancel and clear caches through main.tsx; reuse that setup if embedding elsewhere.
Mutations are not automatically retried after ambiguous network failures.

Tests (from repository root): `node apps/web/src/api/api.test.mjs`.
This dependency-free harness uses installed Vite and Node assertions. It tests the HTTP client;
React hooks/polling and live backend integration still need runtime integration tests.
