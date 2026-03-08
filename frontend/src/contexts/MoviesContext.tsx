import React, { createContext, useContext, useState } from 'react';

interface MoviesContextType {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    sortValue: string;
    setSortValue: (val: string) => void;
    filterType: string;
    setFilterType: (val: string) => void;
    filterUser: string;
    setFilterUser: (val: string) => void;
}

const MoviesContext = createContext<MoviesContextType | undefined>(undefined);

export const MoviesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortValue, setSortValue] = useState('1'); // 1 = Date by default
    const [filterType, setFilterType] = useState('all');
    const [filterUser, setFilterUser] = useState('all');

    return (
        <MoviesContext.Provider value={{
            searchQuery, setSearchQuery,
            sortValue, setSortValue,
            filterType, setFilterType,
            filterUser, setFilterUser
        }}>
            {children}
        </MoviesContext.Provider>
    );
};

export const useMoviesContext = () => {
    const context = useContext(MoviesContext);
    if (!context) throw new Error('useMoviesContext must be within MoviesProvider');
    return context;
};
