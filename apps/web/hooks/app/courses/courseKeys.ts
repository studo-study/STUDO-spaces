export const courseKeys = {
  all: ["courses"] as const,
  course: (id: string) => ["courses", "course", id] as const,
  documents: (courseId: string) =>
    ["courses", "course", courseId, "documents"] as const,
  document: (courseId: string, docId: string) =>
    ["courses", "course", courseId, "documents", docId] as const,
};
