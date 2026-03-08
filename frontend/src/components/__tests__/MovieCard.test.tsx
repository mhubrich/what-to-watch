import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MovieCard from '../MovieCard';
import type { MovieRecord } from '@/api/whatToWatchApi';

const queryClient = new QueryClient();

const mockRecord: MovieRecord = {
    movie: {
        id: 'tt12345',
        name: 'Test Movie',
        poster: 'http://example.com/poster.jpg',
        year: '2023',
        runtime: '120 min',
        rating: '8.5',
        genre: ['Action', 'Comedy'],
        summary: 'A great test movie.',
        imdb: 'http://imdb.com/title/tt12345',
        type: { name: 'movie' },
    },
    meta: {
        id: 'record-1',
        userId: 'test_user',
        dateAdded: new Date().toISOString()
    }
};

describe('MovieCard', () => {
    it('renders movie details correctly', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MovieCard record={mockRecord} />
            </QueryClientProvider>
        );
        expect(screen.getByText('Test Movie')).toBeInTheDocument();
        expect(screen.getByText('2023')).toBeInTheDocument();
        expect(screen.getByText('120 min')).toBeInTheDocument();
    });

    it('renders "Remove from list" button when movie is saved (has meta)', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MovieCard record={mockRecord} />
            </QueryClientProvider>
        );
        // Since we use lucide-react Trash2 icon, it doesn't have text. Let's find by title attribute.
        const button = screen.getByTitle('Remove from list');
        expect(button).toBeInTheDocument();
    });

    it('renders "Add to list" button when movie is NOT saved', () => {
        const unsavedRecord = { ...mockRecord, meta: undefined as any };
        render(
            <QueryClientProvider client={queryClient}>
                <MovieCard record={unsavedRecord} />
            </QueryClientProvider>
        );
        const button = screen.getByTitle('Add to list');
        expect(button).toBeInTheDocument();
    });
});
