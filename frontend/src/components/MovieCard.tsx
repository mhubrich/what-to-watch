import React, { useState } from 'react';
import { searchMovieById, type MovieRecord } from '@/api/whatToWatchApi';
import { useAddMovie, useDeleteRecord, useMovies } from '@/hooks/useMovies';
import StreamingOffers from './StreamingOffers';
import { Plus, Trash2, Youtube, Loader2, Star } from 'lucide-react';
import { cn, unescapeHtml } from '@/lib/utils';

interface MovieCardProps {
    record: MovieRecord;
}

const MovieCard: React.FC<MovieCardProps> = ({ record }) => {
    const { movie, meta } = record;

    const { data: savedMovies } = useMovies();
    const savedRecord = savedMovies?.find(r => r.movie.id === movie.id);
    const isSaved = !!savedRecord || !!meta;
    const currentMeta = savedRecord?.meta || meta;

    const { mutate: addMovie, isPending: isAdding } = useAddMovie();
    const { mutate: deleteRecord, isPending: isDeleting } = useDeleteRecord();
    const [isFetching, setIsFetching] = useState(false);

    const handleAction = async () => {
        if (isSaved && currentMeta) {
            deleteRecord(currentMeta.id);
        } else {
            setIsFetching(true);
            try {
                // Search result only returns partial data, fetch full record before saving
                const fullRecord = await searchMovieById(record.movie.id);
                addMovie(fullRecord);
            } catch (error) {
                console.error("Failed to fetch full movie details", error);
            } finally {
                setIsFetching(false);
            }
        }
    };

    const isActionPending = isAdding || isDeleting || isFetching;

    return (
        <div className="bg-surface border-4 border-border rounded-none overflow-hidden flex flex-col transition-colors duration-150 group hover:border-primary h-full relative">
            {/* 
        We use a flex structure mapping to the legacy card: left (image) / right (body).
        For an optimized responsive UI, we stack them up on very small screens, 
        and put side-by-side on larger ones. Actually legacy was always side by side? 
        Let's keep a grid or flex for image & body.
      */}
            <div className="flex h-full flex-col sm:flex-row relative z-10">
                {/* Image */}
                <div className="w-full sm:w-1/3 shrink-0 relative bg-text-main border-b-4 sm:border-b-0 sm:border-r-4 border-border">
                    {movie.poster && (
                        <img
                            src={movie.poster}
                            alt={unescapeHtml(movie.name)}
                            loading="lazy"
                            className="w-full h-full object-cover sm:absolute inset-0 aspect-[2/3] sm:aspect-auto transition-all duration-300"
                        />
                    )}
                </div>

                {/* Body */}
                <div className="w-full sm:w-2/3 p-4 md:p-6 flex flex-col justify-between bg-surface relative">
                    <div className="swiss-dots z-0"></div>
                    <div className="space-y-4 relative z-10">
                        {/* Title */}
                        <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-none line-clamp-2">{unescapeHtml(movie.name)}</h3>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-widest">
                            {movie.type?.name && (
                                <span className="border-2 border-text-main text-surface bg-text-main px-2 py-1 rounded-none">{movie.type.name}</span>
                            )}
                            {movie.year && (
                                <span className="border-2 border-border text-text-main px-2 py-1 rounded-none bg-surface">{movie.year}</span>
                            )}
                            {movie.runtime && (
                                <span className="border-2 border-border text-text-main px-2 py-1 rounded-none bg-surface">{movie.runtime}</span>
                            )}
                            {movie.rating && String(movie.rating) !== '0' ? (
                                <span className="border-2 border-border text-text-main px-2 py-1 rounded-none bg-surface flex items-center gap-1">
                                    <Star className="w-2 h-2 fill-current" />
                                    {movie.rating}
                                </span>
                            ) : null}
                            {movie.genre && movie.genre.length > 0 && (
                                <span className="border-2 border-border text-text-main px-2 py-1 rounded-none bg-surface text-nowrap">
                                    {movie.genre.slice(0, 2).map(g => g.replace('Biography', 'Bio').replace('Documentary', 'Docu')).join(' • ')}
                                </span>
                            )}
                            <StreamingOffers movieId={movie.id} movieType={movie.type?.name || 'movie'} />
                        </div>

                        {/* Summary */}
                        {movie.summary && (
                            <p className="text-sm md:text-base font-medium text-text-muted line-clamp-4">
                                {unescapeHtml(movie.summary)}
                            </p>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="mt-6 pt-4 border-t-4 border-border flex flex-col xl:flex-row items-start xl:items-center justify-between text-sm gap-4 relative z-10">
                        {/* User / Date */}
                        <div className="flex flex-col text-xs font-bold uppercase tracking-widest text-text-muted">
                            {isSaved && currentMeta ? (
                                <>
                                    <span className="text-text-main text-sm">{currentMeta?.userId}</span>
                                    <span>{new Date(currentMeta?.dateAdded).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                </>
                            ) : (
                                <span>UNSAVED RECORD</span>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">
                            <a href={movie.imdb} target="_blank" rel="noreferrer" role="button" className="flex-1 text-center xl:flex-none border-2 border-border bg-surface px-3 py-1.5 font-bold uppercase tracking-widest hover:bg-text-main hover:text-surface transition-colors duration-150" title="IMDb">
                                IMDB
                            </a>
                            <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(unescapeHtml(movie.name) + ' Trailer')}`} target="_blank" rel="noreferrer" role="button" className="flex-1 xl:flex-none flex justify-center border-2 border-border bg-surface px-3 py-1.5 text-text-main hover:bg-primary hover:text-white hover:border-primary transition-colors duration-150" title="Youtube Trailer">
                                <Youtube className="w-5 h-5" />
                            </a>
                            <button
                                onClick={handleAction}
                                disabled={isActionPending}
                                className={cn(
                                    "flex-1 xl:flex-none flex justify-center border-2 border-border px-3 py-1.5 font-bold uppercase tracking-widest transition-colors duration-150 focus:outline-none focus:ring-0",
                                    isSaved ? "bg-text-main text-surface hover:bg-primary hover:border-primary hover:text-white" : "bg-surface text-text-main hover:bg-text-main hover:text-surface",
                                    isActionPending && "opacity-50 cursor-wait"
                                )}
                                title={isSaved ? "Remove from list" : "Add to list"}
                            >
                                {isActionPending ? <Loader2 className="w-5 h-5 animate-spin" /> : (isSaved ? <Trash2 className="w-5 h-5" /> : <Plus className="w-5 h-5 transition-transform duration-150 group-hover:rotate-90" />)}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieCard;
