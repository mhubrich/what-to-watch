import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getMovies,
    searchMovies,
    searchMovieById,
    postRecord,
    deleteRecord,
    getStreamingProviders,
} from '@/api/whatToWatchApi';
import type { MovieRecord, StreamingProvider } from '@/api/whatToWatchApi';

export const useMovies = () => {
    return useQuery<MovieRecord[], Error>({
        queryKey: ['movies'],
        queryFn: getMovies,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

export const useSearchMovies = (query: string) => {
    return useQuery<MovieRecord[], Error>({
        queryKey: ['movies', 'search', query],
        queryFn: () => searchMovies(query),
        enabled: !!query, // Only fetch when there's a query
    });
};

export const useSearchMovieById = (id: string, enabled: boolean = false) => {
    return useQuery<MovieRecord, Error>({
        queryKey: ['movie', id],
        queryFn: () => searchMovieById(id),
        enabled,
    });
};

export const useAddMovie = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (record: MovieRecord) => postRecord(record),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['movies'] });
        },
    });
};

export const useDeleteRecord = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteRecord(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['movies'] });
        },
    });
};

export const useStreamingProviders = (id: string, type: string, enabled: boolean = false) => {
    return useQuery<StreamingProvider[], Error>({
        queryKey: ['streaming', id, type],
        queryFn: () => getStreamingProviders(id, type, true),
        enabled: !!id && !!type && enabled,
        staleTime: 1000 * 60 * 60, // 1 hour
    });
};
