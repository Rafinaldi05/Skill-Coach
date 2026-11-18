import { useMutation } from "@tanstack/react-query";
import { FeedbackInputSchema, FeedbackSchema, type FeedbackInput } from "@skill-coach/shared";
import { apiFetch } from "./client";
import { useVersion } from "./versions";
// Share the version cache and polling lifecycle; do not mount both hooks for the same view.
export function useReview(versionId: string) {
  const query = useVersion(versionId);
  return { ...query, version: query.data, data: query.data?.review ?? null };
}
export function useReviewFeedback(reviewId: string) {
  return useMutation({ retry: false, mutationFn: (input: FeedbackInput) => apiFetch(`/reviews/${encodeURIComponent(reviewId)}/feedback`, FeedbackSchema, { method: "POST", body: JSON.stringify(FeedbackInputSchema.parse(input)) }) });
}
