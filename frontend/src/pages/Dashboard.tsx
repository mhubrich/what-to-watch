import { useMovies, useSearchMovies } from '@/hooks/useMovies';
import { useMoviesContext } from '@/contexts/MoviesContext';
import { useMemo } from 'react';
import MovieCard from '@/components/MovieCard';

const Dashboard = () => {
    const { searchQuery, sortValue, filterType, filterUser } = useMoviesContext();

    // If there's a search query, use the search hook, else use get all movies
    const { data: allMovies, isLoading: isAllLoading, error: allErr } = useMovies();
    const { data: searchResults, isLoading: isSearchLoading } = useSearchMovies(searchQuery);

    const isLoading = searchQuery ? isSearchLoading : isAllLoading;
    const rawData = searchQuery ? searchResults : allMovies;

    const processedMovies = useMemo(() => {
        if (!rawData) return [];

        let filtered = [...rawData];

        if (filterType !== 'all') {
            filtered = filtered.filter(m => m.movie.type?.name?.toLowerCase() === filterType.toLowerCase());
        }

        if (filterUser !== 'all') {
            filtered = filtered.filter(m => m.meta?.userId === filterUser);
        }

        filtered.sort((a, b) => {
            switch (sortValue) {
                case '0': // Alphabetically
                    return a.movie.name.localeCompare(b.movie.name);
                case '1': { // Date
                    const dateA = a.meta?.dateAdded ? new Date(a.meta.dateAdded).getTime() : 0;
                    const dateB = b.meta?.dateAdded ? new Date(b.meta.dateAdded).getTime() : 0;
                    return dateB - dateA;
                }
                case '2': // Rating
                    return (Number(b.movie.rating) || 0) - (Number(a.movie.rating) || 0);
                default:
                    return 0;
            }
        });

        return filtered;
    }, [rawData, filterType, filterUser, sortValue]);

    if (allErr) {
        return <div className="text-red-500 p-4">Error loading movies.</div>;
    }

    return (
        <div className="space-y-6">
            {isLoading ? (
                <div className="flex justify-center p-12">
                    <span className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
                </div>
            ) : processedMovies.length === 0 ? (
                <div className="text-center p-12 text-text-muted bg-surface rounded-xl border border-border">
                    {searchQuery ? "No movies found for your search." : "Your watchlist is empty."}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {processedMovies.map((record) => (
                        <MovieCard key={record.movie.id} record={record} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
