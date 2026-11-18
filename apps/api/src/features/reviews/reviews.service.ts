import { prisma } from "../../app.js";

export async function saveReviewFeedback(
  reviewId: string,
  userId: string,
  data: { helpful: boolean; comment?: string },
) {
  const review = await prisma.review.findFirst({
    where: { id: reviewId, version: { project: { userId } } },
  });
  if (!review) return null;

  return prisma.reviewFeedback.upsert({
    where: { reviewId_userId: { reviewId: review.id, userId } },
    create: { reviewId: review.id, userId, ...data },
    update: data,
  });
}
