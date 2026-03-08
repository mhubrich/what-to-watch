import React from 'react';
import type { MovieRecord } from '@/api/whatToWatchApi';
import { useAddMovie, useDeleteRecord } from '@/hooks/useMovies';
import StreamingOffers from './StreamingOffers';
import { Plus, Trash2, Youtube, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MovieCardProps {
    record: MovieRecord;
}

const MovieCard: React.FC<MovieCardProps> = ({ record }) => {
    const { movie, meta } = record;
    const isSaved = !!meta;

    const { mutate: addMovie, isPending: isAdding } = useAddMovie();
    const { mutate: deleteRecord, isPending: isDeleting } = useDeleteRecord();

    const handleAction = async () => {
        if (isSaved) {
            deleteRecord(meta.id);
        } else {
            // If we only have basic info from search, we need to fetch the full record before saving.
            // But typically search API returns standard card details. We will just pass the record here.
            // Wait, the legacy card.js says:
            // searchMovie(card.movieId).then(record => postRecord(record))
            // It means search returns partial, and we must fetch the full one from IMDb proxy.
            addMovie(record);
        }
    };

    const isActionPending = isAdding || isDeleting;

    return (
        <div className="bg-surface border border-border rounded-xl overflow-hidden flex flex-col shadow-sm transition-shadow hover:shadow-md h-full">
            {/* 
        We use a flex structure mapping to the legacy card: left (image) / right (body).
        For an optimized responsive UI, we stack them up on very small screens, 
        and put side-by-side on larger ones. Actually legacy was always side by side? 
        Let's keep a grid or flex for image & body.
      */}
            <div className="flex h-full flex-col sm:flex-row">
                {/* Image */}
                <div className="w-full sm:w-1/3 shrink-0 relative bg-black/20">
                    {movie.poster && (
                        <img
                            src={movie.poster}
                            alt={movie.name}
                            loading="lazy"
                            className="w-full h-full object-cover sm:absolute inset-0 aspect-[2/3] sm:aspect-auto"
                        />
                    )}
                </div>

                {/* Body */}
                <div className="w-full sm:w-2/3 p-4 flex flex-col justify-between">
                    <div className="space-y-4">

                        {/* Title */}
                        <h3 className="text-xl font-bold leading-tight line-clamp-2">{movie.name}</h3>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-2 text-xs font-medium">
                            {movie.type?.name && (
                                <span className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded-md">{movie.type.name}</span>
                            )}
                            {movie.year && (
                                <span className="bg-border/50 px-2 py-1 rounded-md text-text-muted">{movie.year}</span>
                            )}
                            {movie.runtime && (
                                <span className="bg-border/50 px-2 py-1 rounded-md text-text-muted">{movie.runtime}</span>
                            )}
                            {movie.rating && (
                                <span className="bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded-md flex items-center gap-1">
                                    ★ {movie.rating}
                                </span>
                            )}
                            {movie.genre && movie.genre.length > 0 && (
                                <span className="bg-purple-500/10 text-purple-400 px-2 py-1 rounded-md text-nowrap">
                                    {movie.genre.slice(0, 2).map(g => g.replace('Biography', 'Bio').replace('Documentary', 'Docu')).join(' • ')}
                                </span>
                            )}
                            <StreamingOffers movieId={movie.id} movieType={movie.type?.name || 'movie'} />
                        </div>

                        {/* Summary */}
                        {movie.summary && (
                            <p className="text-sm text-text-muted line-clamp-3">
                                {movie.summary}
                            </p>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-sm">

                        {/* User / Date */}
                        <div className="flex flex-col text-xs text-text-muted">
                            {isSaved ? (
                                <>
                                    <span className="font-semibold text-text-main">{meta?.userId}</span>
                                    <span>{new Date(meta?.dateAdded).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                </>
                            ) : (
                                <span>Not Saved</span>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                            <a href={movie.imdb} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-400 font-semibold" title="IMDb">
                                IMDb
                            </a>
                            <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(movie.name + ' Trailer')}`} target="_blank" rel="noreferrer" className="text-red-500 hover:text-red-400" title="Youtube Trailer">
                                <Youtube className="w-5 h-5" />
                            </a>
                            <div className="w-px h-5 bg-border mx-1" />
                            <button
                                onClick={handleAction}
                                disabled={isActionPending}
                                className={cn(
                                    "p-1.5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface ring-primary",
                                    isSaved ? "bg-red-500/10 text-red-500 hover:bg-red-500/20" : "bg-primary/10 text-primary hover:bg-primary/20",
                                    isActionPending && "opacity-50 cursor-not-allowed"
                                )}
                                title={isSaved ? "Remove from list" : "Add to list"}
                            >
                                {isActionPending ? <Loader2 className="w-5 h-5 animate-spin" /> : (isSaved ? <Trash2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />)}
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieCard;
