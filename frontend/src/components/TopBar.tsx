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
        <header className="sticky top-0 bg-surface border-b border-border z-50 px-4 py-3 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Search Bar - Full row on Mobile, Right side on Desktop */}
            <div className="w-full md:w-auto md:max-w-md md:order-last flex-1">
                <form onSubmit={handleSearch} className="relative w-full">
                    <input
                        type="search"
                        placeholder="Search for new title..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-background border border-border rounded-full pl-10 pr-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                </form>
            </div>

            {/* Logo and Filters - Scroll horizontally on Mobile */}
            <div className="flex items-center gap-4 w-full md:w-auto overflow-hidden">
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent hidden lg:block min-w-max">
                    What To Watch
                </h1>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 w-full snap-x">
                    <select
                        value={sortValue}
                        onChange={(e) => setSortValue(e.target.value)}
                        className="bg-background border border-border text-sm rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary shrink-0 snap-start"
                    >
                        <option value="1">Date Added</option>
                        <option value="0">Alphabetical</option>
                        <option value="2">Rating</option>
                    </select>

                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="bg-background border border-border text-sm rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary shrink-0 snap-start"
                    >
                        <option value="all">All Types</option>
                        <option value="movie">Movies</option>
                        <option value="show">Shows</option>
                    </select>

                    <select
                        value={filterUser}
                        onChange={(e) => setFilterUser(e.target.value)}
                        className="bg-background border border-border text-sm rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary shrink-0 snap-start"
                    >
                        <option value="all">All Users</option>
                        {uniqueUsers.map(u => (
                            <option key={u} value={u}>{u}</option>
                        ))}
                    </select>
                </div>
            </div>
        </header>
    );
};

export default TopBar;
