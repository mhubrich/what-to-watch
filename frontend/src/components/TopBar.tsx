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
        <header className="sticky top-0 bg-surface border-b-[3px] border-border z-50 px-4 py-4 md:py-6 flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Logo - Moved to top left, visible always */}
            <div className="w-full md:w-auto flex items-center justify-between">
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-text-main uppercase">
                    <span className="text-primary">WhatTo</span>Watch
                </h1>
            </div>

            {/* Search Bar */}
            <div className="w-full md:w-auto md:max-w-md flex-1">
                <form onSubmit={handleSearch} className="relative w-full group">
                    <input
                        type="search"
                        placeholder="Search for new title..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-background border-2 border-transparent rounded-lg pl-12 pr-4 py-3 md:py-4 text-base md:text-lg font-medium text-text-main transition-all focus:outline-none focus:bg-surface focus:border-primary placeholder:text-text-muted"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-focus-within:bg-primary group-focus-within:text-white transition-colors">
                        <Search className="w-4 h-4 md:w-5 md:h-5 stroke-[2.5px]" />
                    </div>
                </form>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto snap-x hide-scrollbar">
                <select
                    value={sortValue}
                    onChange={(e) => setSortValue(e.target.value)}
                    className="bg-accent/10 hover:bg-accent/20 text-accent font-semibold border-2 border-transparent focus:border-accent text-sm md:text-base rounded-lg px-4 py-2 focus:outline-none shrink-0 snap-start transition-colors cursor-pointer appearance-none"
                    style={{ backgroundImage: 'none' }} // Removing default browser arrow for cleaner look, relies on color chunking
                >
                    <option value="1">Sort: Date</option>
                    <option value="0">Sort: A-Z</option>
                    <option value="2">Sort: Rating</option>
                </select>

                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="bg-secondary/10 hover:bg-secondary/20 text-secondary font-semibold border-2 border-transparent focus:border-secondary text-sm md:text-base rounded-lg px-4 py-2 focus:outline-none shrink-0 snap-start transition-colors cursor-pointer appearance-none"
                    style={{ backgroundImage: 'none' }}
                >
                    <option value="all">Type: All</option>
                    <option value="movie">Type: Movies</option>
                    <option value="show">Type: Shows</option>
                </select>

                <select
                    value={filterUser}
                    onChange={(e) => setFilterUser(e.target.value)}
                    className="bg-border hover:bg-border/80 text-text-main font-semibold border-2 border-transparent focus:border-primary text-sm md:text-base rounded-lg px-4 py-2 focus:outline-none shrink-0 snap-start transition-colors cursor-pointer appearance-none"
                    style={{ backgroundImage: 'none' }}
                >
                    <option value="all">User: All</option>
                    {uniqueUsers.map(u => (
                        <option key={u} value={u}>User: {u}</option>
                    ))}
                </select>
            </div>
        </header>
    );
};

export default TopBar;
