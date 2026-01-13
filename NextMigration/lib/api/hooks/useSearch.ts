// lib/api/hooks/useSearch.ts

import { useQuery } from '@tanstack/react-query';
import { api } from '../client';
import type { SearchResults } from '../types';

export function useSearch(query: string, enabled = true) {
    return useQuery({
        queryKey: ['search', query],
        queryFn: () => api.get<SearchResults>(`/search?q=${encodeURIComponent(query)}`),
        enabled: enabled && query.length >= 2,
        staleTime: 30 * 1000, // 30 seconden - search results verversen sneller
    });
}

// Debounced search hook
import { useState, useEffect } from 'react';

export function useDebouncedSearch(query: string, delay = 300) {
    const [debouncedQuery, setDebouncedQuery] = useState(query);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, delay);

        return () => clearTimeout(timer);
    }, [query, delay]);

    return useSearch(debouncedQuery, debouncedQuery.length >= 2);
}