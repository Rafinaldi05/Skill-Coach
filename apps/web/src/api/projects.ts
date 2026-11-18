import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateProjectInputSchema, UpdateProjectInputSchema, ProjectSchema, ProjectsPageSchema, DeletedSchema, type CreateProjectInput, type UpdateProjectInput } from "@skill-coach/shared";
import { apiFetch, queryRetry } from "./client";
import { keys } from "./keys";
import { useAuthenticated } from "./session";
const path = (id: string) => `/projects/${encodeURIComponent(id)}`;
export function useProjects() {
  const enabled = useAuthenticated();
  return useInfiniteQuery({ queryKey: keys.projects.infinite(), initialPageParam: null as string | null,
    queryFn: ({ pageParam, signal }) => apiFetch(`/projects${pageParam ? `?cursor=${encodeURIComponent(pageParam)}` : ""}`, ProjectsPageSchema, { signal }),
    getNextPageParam: page => page.nextCursor ?? undefined, enabled, retry: queryRetry });
}
export function useCreateProject() {
  const client = useQueryClient();
  return useMutation({ retry: false, mutationFn: (input: CreateProjectInput) => apiFetch("/projects", ProjectSchema, { method: "POST", body: JSON.stringify(CreateProjectInputSchema.parse(input)) }), onSuccess: () => client.invalidateQueries({ queryKey: keys.projects.all() }) });
}
export function useUpdateProject() {
  const client = useQueryClient();
  return useMutation({ retry: false, mutationFn: ({ id, input }: { id: string; input: UpdateProjectInput }) => apiFetch(path(id), ProjectSchema, { method: "PATCH", body: JSON.stringify(UpdateProjectInputSchema.parse(input)) }), onSuccess: () => { void client.invalidateQueries({ queryKey: keys.projects.all() }); void client.invalidateQueries({ queryKey: ["portfolio"] }); } });
}
export function useDeleteProject() {
  const client = useQueryClient();
  return useMutation({ retry: false, mutationFn: (id: string) => apiFetch(path(id), DeletedSchema, { method: "DELETE" }), onSuccess: () => { client.removeQueries({ queryKey: ["versions"] }); void client.invalidateQueries({ queryKey: keys.projects.all() }); void client.invalidateQueries({ queryKey: ["portfolio"] }); } });
}
