import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, ChevronUp, Film } from 'lucide-react';
import { useMoviesContext } from '@/contexts/MoviesContext';
import { useMovies } from '@/hooks/useMovies';
import { cn } from '@/lib/utils';

const TopBar = () => {
    const { data: allMovies } = useMovies();
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [isHeaderVisible, setIsHeaderVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Show header if scrolling up, or if at the very top of the page
            if (currentScrollY < lastScrollY || currentScrollY < 50) {
                setIsHeaderVisible(true);
            }
            // Hide header if scrolling down past a small threshold
            else if (currentScrollY > 50 && currentScrollY > lastScrollY) {
                setIsHeaderVisible(false);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    // Context for filtering
    const { searchQuery, setSearchQuery, sortValue, setSortValue, filterType, setFilterType, filterUser, setFilterUser } = useMoviesContext();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
    };

    // Extract unique users from loaded movies
    const uniqueUsers = Array.from(new Set((allMovies || []).map(m => m.meta?.userId).filter(Boolean)));

    return (
        <header className="sticky top-0 bg-surface border-b-4 border-border z-50 px-4 md:px-6 lg:px-12 py-6 transition-all duration-300 ease-in-out">
            <div className="swiss-grid-pattern z-0"></div>
            <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between w-full max-w-screen-2xl mx-auto relative z-10">
                {/* Logo */}
                <div className="w-full xl:w-auto flex justify-between items-center shrink-0">
                    <h1 className="flex items-center gap-3 md:gap-4 text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-text-main">
                        <Film className="w-[1em] h-[1em] text-primary" />
                        What To Watch
                    </h1>
                </div>

                {/* Filters & Search Grid */}
                <div className={cn(
                    "w-full xl:w-auto flex flex-col md:flex-row md:items-center overflow-hidden transition-all duration-300 ease-in-out origin-top",
                    isHeaderVisible ? "max-h-[500px] opacity-100 mt-5 lg:mt-6 xl:mt-0 gap-4" : "max-h-0 opacity-0 mt-0 gap-0"
                )}>
                    {/* Mobile Filters Toggle */}
                    <button
                        onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                        className={cn(
                            "group md:hidden flex items-center justify-between bg-surface border-2 border-border px-4 py-3 text-sm font-bold uppercase tracking-widest w-full transition-colors duration-150 hover:bg-text-main hover:text-surface",
                            isFiltersOpen ? "text-text-main" : "text-text-muted"
                        )}
                    >
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-text-main group-hover:text-surface transition-colors duration-150" />
                            <span>FILTERS</span>
                        </div>
                        {isFiltersOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {/* Filter Selects */}
                    <div className={cn(
                        "gap-2 w-full md:w-auto",
                        isFiltersOpen ? "flex flex-col" : "hidden md:flex flex-row"
                    )}>
                        <select
                            value={sortValue}
                            onChange={(e) => setSortValue(e.target.value)}
                            className="bg-surface text-text-main border-2 md:border-4 border-border rounded-none px-4 py-3 text-sm font-bold uppercase tracking-widest focus:outline-none focus:border-primary transition-colors duration-150 cursor-pointer shrink-0 snap-start"
                        >
                            <option value="1">SORT BY: DATE ADDED</option>
                            <option value="0">SORT BY: ALPHABETICAL</option>
                            <option value="2">SORT BY: RATING</option>
                        </select>

                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="bg-surface text-text-main border-2 md:border-4 border-border rounded-none px-4 py-3 text-sm font-bold uppercase tracking-widest focus:outline-none focus:border-primary transition-colors duration-150 cursor-pointer shrink-0 snap-start"
                        >
                            <option value="all">TYPE: ALL</option>
                            <option value="movie">TYPE: MOVIES</option>
                            <option value="show">TYPE: SHOWS</option>
                        </select>

                        <select
                            value={filterUser}
                            onChange={(e) => setFilterUser(e.target.value)}
                            className="bg-surface text-text-main border-2 md:border-4 border-border rounded-none px-4 py-3 text-sm font-bold uppercase tracking-widest focus:outline-none focus:border-primary transition-colors duration-150 cursor-pointer shrink-0 snap-start"
                        >
                            <option value="all">USER: ALL</option>
                            {uniqueUsers.map(u => (
                                <option key={u} value={u}>USER: {String(u).toUpperCase()}</option>
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
                            className="w-full bg-surface text-text-main border-none rounded-none pl-12 pr-4 py-3 md:py-2 text-sm font-bold uppercase tracking-widest focus:outline-none focus:ring-0 placeholder:text-text-muted"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-main group-focus-within:text-primary transition-colors duration-150" strokeWidth={3} />
                    </form>
                </div>
            </div>
        </header>
    );
};

export default TopBar;
