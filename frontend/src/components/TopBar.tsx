import { Search } from 'lucide-react';
import { useMoviesContext } from '@/contexts/MoviesContext';
import { useMovies } from '@/hooks/useMovies';

const TopBar = () => {
    const { data: allMovies } = useMovies();

    // Context for filtering
    const { searchQuery, setSearchQuery, sortValue, setSortValue, filterType, setFilterType, filterUser, setFilterUser } = useMoviesContext();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
    };

    // Extract unique users from loaded movies
    const uniqueUsers = Array.from(new Set((allMovies || []).map(m => m.meta?.userId).filter(Boolean)));

    return (
        <header className="sticky top-0 bg-surface border-b-4 border-border z-50 px-4 md:px-6 lg:px-12 py-6 relative">
            <div className="swiss-grid-pattern z-0"></div>
            <div className="flex flex-col xl:flex-row gap-6 lg:gap-8 items-start xl:items-center justify-between w-full max-w-screen-2xl mx-auto relative z-10">
                {/* Logo */}
                <div className="w-full xl:w-auto flex justify-between items-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-text-main">
                        What To Watch
                    </h1>
                </div>

                {/* Filters & Search Grid */}
                <div className="w-full xl:w-auto flex flex-col md:flex-row gap-4 md:items-center">
                    {/* Filter Selects */}
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto snap-x">
                        <select
                            value={sortValue}
                            onChange={(e) => setSortValue(e.target.value)}
                            className="bg-surface text-text-main border-2 md:border-4 border-border rounded-none px-4 py-3 text-sm font-bold uppercase tracking-widest focus:outline-none focus:border-primary transition-colors duration-150 cursor-pointer shrink-0 snap-start"
                        >
                            <option value="1">DATE ADDED</option>
                            <option value="0">ALPHABETICAL</option>
                            <option value="2">RATING</option>
                        </select>

                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="bg-surface text-text-main border-2 md:border-4 border-border rounded-none px-4 py-3 text-sm font-bold uppercase tracking-widest focus:outline-none focus:border-primary transition-colors duration-150 cursor-pointer shrink-0 snap-start"
                        >
                            <option value="all">ALL TYPES</option>
                            <option value="movie">MOVIES</option>
                            <option value="show">SHOWS</option>
                        </select>

                        <select
                            value={filterUser}
                            onChange={(e) => setFilterUser(e.target.value)}
                            className="bg-surface text-text-main border-2 md:border-4 border-border rounded-none px-4 py-3 text-sm font-bold uppercase tracking-widest focus:outline-none focus:border-primary transition-colors duration-150 cursor-pointer shrink-0 snap-start"
                        >
                            <option value="all">ALL USERS</option>
                            {uniqueUsers.map(u => (
                                <option key={u} value={u}>{String(u).toUpperCase()}</option>
                            ))}
                        </select>
                    </div>

                    {/* Search */}
                    <form onSubmit={handleSearch} className="relative w-full md:w-64 lg:w-80 shrink-0 border-2 md:border-4 border-border group focus-within:border-primary transition-colors duration-150">
                        <input
                            type="search"
                            placeholder="SEARCH..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-background text-text-main border-none rounded-none pl-12 pr-4 py-3 md:py-2 text-sm font-bold uppercase tracking-widest focus:outline-none focus:ring-0 placeholder:text-text-muted"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-main group-focus-within:text-primary transition-colors duration-150" strokeWidth={3} />
                    </form>
                </div>
            </div>
        </header>
    );
};

export default TopBar;
