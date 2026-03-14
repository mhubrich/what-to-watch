import { useMovies, useSearchMovies } from '@/hooks/useMovies';
import { useMoviesContext } from '@/contexts/MoviesContext';
import { useMemo } from 'react';
import MovieCard from '@/components/MovieCard';
import { unescapeHtml } from '@/lib/utils';

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
                    return unescapeHtml(a.movie.name).localeCompare(unescapeHtml(b.movie.name));
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
            <div className="border-4 border-primary bg-background p-8 relative overflow-hidden">
                <div className="swiss-diagonal z-0"></div>
                <h3 className="text-3xl font-black uppercase tracking-tighter text-primary relative z-10">
                    SYSTEM ERROR
                </h3>
                <p className="mt-2 text-lg font-bold uppercase tracking-widest text-text-main relative z-10">
                    UNABLE TO LOAD RECORDS.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 md:gap-12">

            {isLoading ? (
                <div className="flex justify-center items-center py-24">
                    <div className="text-2xl md:text-4xl font-black uppercase tracking-widest text-primary animate-pulse">
                        LOADING  //  PLEASE WAIT...
                    </div>
                </div>
            ) : processedMovies.length === 0 ? (
                <div className="text-center py-24 px-6 border-4 border-border bg-surface relative overflow-hidden group">
                    <div className="swiss-diagonal z-0"></div>
                    <div className="relative z-10">
                        <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-text-main mb-4 group-hover:text-primary transition-colors duration-300">
                            {searchQuery ? "ZERO RESULTS" : "EMPTY ARCHIVE"}
                        </h3>
                        <p className="text-lg font-bold uppercase tracking-widest text-text-muted">
                            {searchQuery ? "ADJUST PARAMETERS" : "BEGIN ADDING RECORDS"}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
                    {processedMovies.map((record) => (
                        <MovieCard key={record.movie.id} record={record} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
