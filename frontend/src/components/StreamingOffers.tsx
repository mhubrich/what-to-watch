import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Loader2 } from 'lucide-react';
import { useStreamingProviders } from '@/hooks/useMovies';

interface StreamingOffersProps {
    movieId: string;
    movieType: string;
}

const StreamingOffers: React.FC<StreamingOffersProps> = ({ movieId, movieType }) => {
    const [open, setOpen] = React.useState(false);

    const { data: providers, isLoading, error } = useStreamingProviders(movieId, movieType, open);

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
                <button className="text-xs md:text-sm bg-surface border-2 border-border px-3 py-1.5 rounded-md font-bold text-text-main hover:bg-border/50 hover:border-text-muted transition-all duration-200">
                    Providers
                </button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-text-main/20 backdrop-blur-none z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border-[4px] border-border bg-surface p-6 sm:p-8 shadow-none duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-xl">
                    <div className="flex flex-col space-y-2 text-center sm:text-left border-b-[3px] border-border pb-4">
                        <Dialog.Title className="text-xl md:text-2xl font-extrabold uppercase tracking-tight text-text-main">Streaming Offers</Dialog.Title>
                        <Dialog.Description className="text-sm md:text-base font-medium text-text-muted">
                            Where to watch this title online.
                        </Dialog.Description>
                    </div>

                    <div className="py-4 min-h-[100px] flex flex-col justify-center">
                        {isLoading && (
                            <div className="flex justify-center p-4">
                                <Loader2 className="h-8 w-8 animate-spin text-primary stroke-[3px]" />
                            </div>
                        )}

                        {error && (
                            <div className="text-red-500 font-bold text-center bg-red-500/10 p-4 rounded-lg">Failed to load offers.</div>
                        )}

                        {providers && providers.length === 0 && (
                            <div className="text-base font-bold text-text-muted text-center py-4 uppercase tracking-wider">No offers found.</div>
                        )}

                        {providers && providers.length > 0 && (
                            <div className="flex flex-wrap gap-3 md:gap-4">
                                {providers.map((p: any, idx: number) => (
                                    <a key={idx} href={p.link} target="_blank" rel="noreferrer" className="flex items-center gap-3 group bg-background p-2 rounded-lg border-2 border-transparent hover:border-primary transition-colors flex-1 min-w-[140px]">
                                        <img src={p.img} alt={p.label} className="w-10 h-10 rounded-md bg-border shrink-0" />
                                        <span className="text-sm font-bold text-text-main group-hover:text-primary transition-colors leading-tight">{p.label}</span>
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                    <Dialog.Close asChild>
                        <button className="absolute right-4 top-4 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center bg-background border-2 border-border text-text-muted transition-all hover:bg-text-main hover:text-surface hover:scale-110 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                            <X className="h-5 w-5 md:h-6 md:w-6 stroke-[3px]" />
                            <span className="sr-only">Close</span>
                        </button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default StreamingOffers;
