export const keys = {
  auth: { me: () => ["me"] as const, quota: () => ["quota"] as const },
  projects: {
    all: () => ["projects"] as const,
    infinite: (filters?: Record<string, unknown>) => ["projects", "list", filters ?? {}] as const,
    detail: (id: string) => ["projects", id] as const,
  },
  versions: {
    detail: (id: string) => ["versions", id] as const,
    progress: (projectId: string) => ["projects", projectId, "progress"] as const,
  },
  portfolio: (username: string) => ["portfolio", username] as const,
};
