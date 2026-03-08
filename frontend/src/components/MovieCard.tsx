import React from 'react';
import type { MovieRecord } from '@/api/whatToWatchApi';
import { useAddMovie, useDeleteRecord } from '@/hooks/useMovies';
import StreamingOffers from './StreamingOffers';
import { Plus, Trash2, Youtube, Loader2, ArrowUpRight } from 'lucide-react';
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
            addMovie(record);
        }
    };

    const isActionPending = isAdding || isDeleting;

    return (
        <div className="group bg-surface rounded-xl overflow-hidden flex flex-col shadow-none transition-all duration-300 hover:scale-[1.02] hover:bg-surface/90 h-full">
            <div className="flex xl:flex-col h-full flex-col sm:flex-row">
                {/* Image */}
                <div className="w-full xl:w-full sm:w-2/5 shrink-0 relative bg-black/5 aspect-[2/3] sm:aspect-auto xl:aspect-[2/3] overflow-hidden">
                    {movie.poster ? (
                        <img
                            src={movie.poster}
                            alt={movie.name}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-text-muted font-bold tracking-widest uppercase">
                            No Image
                        </div>
                    )}
                </div>

                {/* Body */}
                <div className="w-full xl:w-full sm:w-3/5 p-5 md:p-6 flex flex-col justify-between flex-1">
                    <div className="space-y-4">
                        {/* Title */}
                        <h3 className="text-xl md:text-2xl font-bold leading-tight line-clamp-2 text-text-main group-hover:text-primary transition-colors">
                            {movie.name}
                        </h3>

                        {/* Badges - Solid colors, no borders */}
                        <div className="flex flex-wrap gap-2 text-xs md:text-sm font-bold tracking-wide uppercase">
                            {movie.type?.name && (
                                <span className="bg-primary hover:bg-primary-hover text-white px-3 py-1 rounded-md transition-colors">
                                    {movie.type.name}
                                </span>
                            )}
                            <span className="bg-border text-text-main px-3 py-1 rounded-md">
                                {movie.year || 'N/A'}
                            </span>
                            <span className="bg-border text-text-main px-3 py-1 rounded-md">
                                {movie.runtime || 'N/A'}
                            </span>
                            {movie.rating && (
                                <span className="bg-accent hover:bg-yellow-400 text-black px-3 py-1 rounded-md flex items-center gap-1 transition-colors">
                                    ★ {movie.rating}
                                </span>
                            )}
                        </div>

                        {/* Genres */}
                        {movie.genre && movie.genre.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                {movie.genre.map(g => (
                                    <span key={g} className="text-xs font-semibold text-text-muted">
                                        #{g.replace(' ', '')}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="pt-2">
                            <StreamingOffers movieId={movie.id} movieType={movie.type?.name || 'movie'} />
                        </div>

                        {/* Summary */}
                        {movie.summary && (
                            <p className="text-sm md:text-base text-text-muted line-clamp-3 font-medium leading-relaxed">
                                {movie.summary}
                            </p>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="mt-6 pt-5 bg-background -mx-5 -mb-5 px-5 py-4 border-t-[3px] border-border flex items-center justify-between transition-colors group-hover:bg-border/30">
                        {/* User / Date */}
                        <div className="flex flex-col text-xs md:text-sm">
                            {isSaved ? (
                                <>
                                    <span className="font-extrabold text-text-main uppercase tracking-wider">{meta?.userId}</span>
                                    <span className="text-text-muted font-medium">{new Date(meta?.dateAdded).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                </>
                            ) : (
                                <span className="font-bold text-text-muted uppercase tracking-wider">Not Saved</span>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                            <a href={movie.imdb} target="_blank" rel="noreferrer" className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-border flex items-center justify-center text-text-main hover:bg-black hover:text-white transition-all hover:scale-110" title="IMDb">
                                <span className="sr-only">IMDb</span>
                                <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 stroke-[2.5px]" />
                            </a>
                            <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(movie.name + ' Trailer')}`} target="_blank" rel="noreferrer" className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-border flex items-center justify-center text-text-main hover:bg-red-500 hover:text-white transition-all hover:scale-110" title="Youtube Trailer">
                                <Youtube className="w-5 h-5 md:w-6 md:h-6 stroke-[2.5px]" />
                            </a>
                            <button
                                onClick={handleAction}
                                disabled={isActionPending}
                                className={cn(
                                    "w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all hover:scale-110 focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-primary",
                                    isSaved
                                        ? "bg-red-500 text-white hover:bg-red-600"
                                        : "bg-primary text-white hover:bg-primary-hover",
                                    isActionPending && "opacity-50 cursor-not-allowed hover:scale-100"
                                )}
                                title={isSaved ? "Remove from list" : "Add to list"}
                            >
                                {isActionPending ? <Loader2 className="w-6 h-6 animate-spin" /> : (isSaved ? <Trash2 className="w-6 h-6 stroke-[2.5px]" /> : <Plus className="w-6 h-6 stroke-[2.5px]" />)}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieCard;
