import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
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
                <button className="text-xs font-bold uppercase tracking-widest border-2 border-border bg-surface px-2 py-1 rounded-none text-text-main hover:bg-text-main hover:text-surface transition-colors duration-150">
                    STREAMS
                </button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-text-main/20 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border-4 border-border bg-surface p-8 shadow-none duration-150 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 sm:rounded-none">
                    <div className="swiss-diagonal z-0"></div>
                    <div className="flex flex-col space-y-2 text-left relative z-10 border-b-4 border-border pb-4">
                        <Dialog.Title className="text-3xl font-black uppercase tracking-tighter leading-none text-text-main">
                            PROVIDERS
                        </Dialog.Title>
                        <Dialog.Description className="text-sm font-bold uppercase tracking-widest text-text-muted">
                            WHERE TO WATCH THIS TITLE ONLINE.
                        </Dialog.Description>
                    </div>

                    <div className="py-4 relative z-10 min-h-[100px]">
                        {isLoading && (
                            <div className="flex justify-center p-4">
                                <div className="text-lg font-black uppercase tracking-widest text-primary animate-pulse">
                                    LOADING...
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="text-primary font-bold uppercase tracking-widest text-sm border-2 border-primary p-2 text-center">
                                COMM ERROR.
                            </div>
                        )}

                        {providers && providers.length === 0 && (
                            <div className="text-sm font-bold uppercase tracking-widest text-text-muted border-2 border-border p-4 text-center">
                                NO STREAMING DATA
                            </div>
                        )}

                        {providers && providers.length > 0 && (
                            <div className="flex flex-wrap gap-4">
                                {providers.map((p: { link: string; img: string; label: string }, idx: number) => (
                                    <a key={idx} href={p.link} target="_blank" rel="noreferrer" className="flex items-center gap-3 group border-2 border-border p-2 bg-background hover:border-primary transition-colors duration-150">
                                        <img src={p.img} alt={p.label} className="w-8 h-8 rounded-none bg-border grayscale group-hover:grayscale-0 transition-all duration-150" />
                                        <span className="text-sm font-bold uppercase tracking-widest text-text-main group-hover:text-primary transition-colors duration-150 pr-2">{p.label}</span>
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                    <Dialog.Close asChild>
                        <button className="absolute right-6 top-6 rounded-none border-2 border-border p-1 bg-surface transition-colors duration-150 hover:bg-primary hover:text-white hover:border-primary focus:outline-none focus:ring-0 z-20">
                            <X className="h-5 w-5" strokeWidth={3} />
                            <span className="sr-only">Close</span>
                        </button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default StreamingOffers;
