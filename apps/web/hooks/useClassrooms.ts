"use client";

import { useCallback, useEffect, useState } from "react";
import { CreateClassroom, FullClassroom } from "@/types/types";

interface UseClassroomsReturn {
  classrooms: FullClassroom[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createClassroom: (data: CreateClassroom) => Promise<FullClassroom>;
  deleteClassroom: (classroomId: string) => Promise<void>;
}

export function useClassrooms(): UseClassroomsReturn {
  const [classrooms, setClassrooms] = useState<FullClassroom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClassrooms = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/classrooms");
      if (!response.ok) throw new Error("Failed to fetch classrooms");
      const data = await response.json();
      setClassrooms(data.classrooms ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClassrooms();
  }, [fetchClassrooms]);

  const createClassroom = useCallback(
    async (data: CreateClassroom): Promise<FullClassroom> => {
      const response = await fetch("/api/classrooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create classroom");
      const created = await response.json();
      await fetchClassrooms();
      return created;
    },
    [fetchClassrooms],
  );

  const deleteClassroom = useCallback(
    async (classroomId: string): Promise<void> => {
      const response = await fetch(`/api/classrooms/${classroomId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete classroom");
      await fetchClassrooms();
    },
    [fetchClassrooms],
  );

  return {
    classrooms,
    isLoading,
    error,
    refetch: fetchClassrooms,
    createClassroom,
    deleteClassroom,
  };
}

interface UseClassroomReturn {
  classroom: FullClassroom | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useClassroom(classroomId: string | null): UseClassroomReturn {
  const [classroom, setClassroom] = useState<FullClassroom | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClassroom = useCallback(async () => {
    if (!classroomId) {
      setClassroom(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/classrooms/${classroomId}`);
      if (!response.ok) throw new Error("Failed to fetch classroom");
      const data = await response.json();
      setClassroom(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, [classroomId]);

  useEffect(() => {
    fetchClassroom();
  }, [fetchClassroom]);

  return {
    classroom,
    isLoading,
    error,
    refetch: fetchClassroom,
  };
}
