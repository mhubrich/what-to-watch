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
        return (
            <div className="bg-red-500 text-white p-8 rounded-xl font-bold text-xl uppercase tracking-wider text-center">
                Error loading movies.
            </div>
        );
    }

    return (
        <div className="space-y-8 min-h-[50vh]">
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="flex gap-2">
                        <div className="w-5 h-5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-5 h-5 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-5 h-5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                </div>
            ) : processedMovies.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-16 bg-surface text-text-main rounded-xl border-[3px] border-border text-center">
                    <h2 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight mb-4">
                        {searchQuery ? "No Matches Found" : "Nothing to Watch"}
                    </h2>
                    <p className="text-lg md:text-xl text-text-muted font-medium">
                        {searchQuery ? `We couldn't find any results for "${searchQuery}".` : "Your watchlist is currently empty. Start adding some movies!"}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 md:gap-8">
                    {processedMovies.map((record) => (
                        <MovieCard key={record.movie.id} record={record} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
