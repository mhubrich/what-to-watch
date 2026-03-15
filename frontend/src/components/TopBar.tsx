import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, ChevronDown, ChevronUp, Film, X } from 'lucide-react';
import { useMoviesContext } from '@/contexts/MoviesContext';
import { useMovies } from '@/hooks/useMovies';
import { cn } from '@/lib/utils';

const TopBar = () => {
    const { data: allMovies } = useMovies();
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [isHeaderVisible, setIsHeaderVisible] = useState(true);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollThreshold = 200;
            const minScrollY = 10;
            const currentScrollY = window.scrollY;

            // Show header if scrolling up at least a small amount, or if at the very top of the page
            if (lastScrollY.current - currentScrollY >= minScrollY || currentScrollY <= scrollThreshold) {
                setIsHeaderVisible(true);
            }
            // Hide header if scrolling down past a small threshold
            else if (currentScrollY > scrollThreshold && currentScrollY > lastScrollY.current) {
                setIsHeaderVisible(false);
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close filters accordion invisibly after top bar has vanished
    useEffect(() => {
        if (!isHeaderVisible) {
            const timer = setTimeout(() => {
                setIsFiltersOpen(false);
            }, 400); // 400ms matches the header's transition-transform duration
            return () => clearTimeout(timer);
        }
    }, [isHeaderVisible]);

    // Context for filtering
    const { searchQuery, setSearchQuery, sortValue, setSortValue, filterType, setFilterType, filterUser, setFilterUser } = useMoviesContext();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Blur the currently active element (which is likely the search input) 
        // to force the mobile keyboard to close
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
    };

    // Extract unique users from loaded movies
    const uniqueUsers = Array.from(new Set((allMovies || []).map(m => m.meta?.userId).filter(Boolean)));

    return (
        <header className={cn(
            "sticky top-0 bg-surface border-b-4 border-border z-50 px-4 md:px-6 lg:px-8 2xl:px-12 pb-6 pt-[max(1.5rem,env(safe-area-inset-top))] transition-transform duration-300 ease-in-out will-change-transform",
            isHeaderVisible ? "translate-y-0" : "-translate-y-full"
        )}>
            <div className="swiss-grid-pattern z-0"></div>
            <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between w-full max-w-screen-2xl mx-auto relative z-10 xl:gap-y-6">
                {/* Logo */}
                <div className="w-full xl:w-auto flex justify-between items-center shrink-0">
                    <h1 className="flex items-center gap-3 md:gap-4 text-4xl md:text-5xl lg:text-5xl 2xl:text-6xl font-black uppercase tracking-tighter text-text-main">
                        <Film className="w-[1em] h-[1em] text-primary" />
                        What To Watch
                    </h1>
                </div>

                {/* Filters & Search Grid */}
                <div className="w-full xl:w-auto flex flex-col md:flex-row flex-wrap md:items-center mt-5 lg:mt-6 xl:mt-0 gap-3 2xl:gap-4">
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
                        isFiltersOpen ? "flex flex-col" : "hidden md:flex flex-row md:flex-wrap lg:flex-nowrap"
                    )}>
                        <select
                            value={sortValue}
                            onChange={(e) => setSortValue(e.target.value)}
                            className="bg-surface text-text-main border-2 md:border-4 border-border rounded-none px-4 py-3 text-sm lg:px-3 lg:py-2 lg:text-xs 2xl:px-4 2xl:py-3 2xl:text-sm font-bold uppercase tracking-widest focus:outline-none focus:border-primary transition-colors duration-150 cursor-pointer shrink-0 snap-start"
                        >
                            <option value="1">SORT BY: DATE ADDED</option>
                            <option value="0">SORT BY: ALPHABETICAL</option>
                            <option value="2">SORT BY: RATING</option>
                        </select>

                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="bg-surface text-text-main border-2 md:border-4 border-border rounded-none px-4 py-3 text-sm lg:px-3 lg:py-2 lg:text-xs 2xl:px-4 2xl:py-3 2xl:text-sm font-bold uppercase tracking-widest focus:outline-none focus:border-primary transition-colors duration-150 cursor-pointer shrink-0 snap-start"
                        >
                            <option value="all">TYPE: ALL</option>
                            <option value="movie">TYPE: MOVIES</option>
                            <option value="show">TYPE: SHOWS</option>
                        </select>

                        <select
                            value={filterUser}
                            onChange={(e) => setFilterUser(e.target.value)}
                            className="bg-surface text-text-main border-2 md:border-4 border-border rounded-none px-4 py-3 text-sm lg:px-3 lg:py-2 lg:text-xs 2xl:px-4 2xl:py-3 2xl:text-sm font-bold uppercase tracking-widest focus:outline-none focus:border-primary transition-colors duration-150 cursor-pointer shrink-0 snap-start"
                        >
                            <option value="all">USER: ALL</option>
                            {uniqueUsers.map(u => (
                                <option key={u} value={u}>USER: {String(u).toUpperCase()}</option>
                            ))}
                        </select>
                    </div>

                    {/* Search */}
                    <form onSubmit={handleSearch} className="relative w-full xl:w-64 2xl:w-80 shrink-0 border-2 md:border-4 border-border group focus-within:border-primary transition-colors duration-150">
                        <input
                            type="search"
                            placeholder="SEARCH..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-surface text-text-main border-none rounded-none pl-12 pr-12 py-3 md:py-2 text-sm font-bold uppercase tracking-widest focus:outline-none focus:ring-0 placeholder:text-text-muted [&::-webkit-search-cancel-button]:hidden"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-main group-focus-within:text-primary transition-colors duration-150" strokeWidth={3} />
                        
                        {/* Custom X Button that only shows when there is text */}
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery('')}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-text-main hover:text-primary transition-colors duration-150"
                                aria-label="Clear search"
                            >
                                <X className="w-5 h-5" strokeWidth={3} />
                            </button>
                        )}
                    </form>
                </div>
            </div>
        </header>
    );
};

export default TopBar;
