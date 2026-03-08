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
                <button className="text-xs bg-surface border border-border px-2 py-1 rounded-md text-text-main hover:bg-border transition-colors">
                    Streaming Providers
                </button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-border bg-surface p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
                    <div className="flex flex-col space-y-1.5 text-center sm:text-left">
                        <Dialog.Title className="text-lg font-semibold leading-none tracking-tight">Available Providers</Dialog.Title>
                        <Dialog.Description className="text-sm text-text-muted">
                            Where to watch this title online.
                        </Dialog.Description>
                    </div>

                    <div className="py-4">
                        {isLoading && (
                            <div className="flex justify-center p-4">
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            </div>
                        )}

                        {error && (
                            <div className="text-red-500 text-sm">Failed to load offers.</div>
                        )}

                        {providers && providers.length === 0 && (
                            <div className="text-sm text-text-muted text-center py-4">No streaming offers found.</div>
                        )}

                        {providers && providers.length > 0 && (
                            <div className="flex flex-wrap gap-4">
                                {providers.map((p: any, idx: number) => (
                                    <a key={idx} href={p.link} target="_blank" rel="noreferrer" className="flex items-center gap-2 group">
                                        <img src={p.img} alt={p.label} className="w-8 h-8 rounded-md bg-border" />
                                        <span className="text-sm text-text-main group-hover:underline">{p.label}</span>
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                    <Dialog.Close asChild>
                        <button className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-text-muted">
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                        </button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default StreamingOffers;
