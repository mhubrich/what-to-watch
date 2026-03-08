import axios from 'axios';

// Change to process.env or import.meta.env for Vite
const HOST = "http://localhost:4001/"; // import.meta.env.VITE_API_HOST || "https://whattowatch.markushubrich.me/";

export const api = axios.create({
    baseURL: HOST,
    withCredentials: true, // Crucial for sessions/cookies
});

export interface MovieType {
    name: string;
}

export interface Movie {
    id: string;
    name: string;
    poster: string;
    year: string;
    runtime: string;
    rating: string;
    genre: string[];
    summary: string;
    imdb: string;
    type: MovieType;
}

export interface RecordMeta {
    id: string;
    userId: string;
    dateAdded: string;
}

export interface MovieRecord {
    movie: Movie;
    meta: RecordMeta;
}

export interface StreamingProvider {
    label: string;
    link: string;
    img: string;
}

// Interceptor to handle unauthenticated state (401)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            window.location.href = `${HOST}login`;
        }
        return Promise.reject(error);
    }
);

export const getMovies = async (): Promise<MovieRecord[]> => {
    const { data } = await api.get<MovieRecord[]>('movies');
    return data;
};

export const searchMovies = async (query: string): Promise<MovieRecord[]> => {
    const { data } = await api.get<MovieRecord[]>('search', {
        params: { q: query },
    });
    return data;
};

export const searchMovieById = async (id: string): Promise<MovieRecord> => {
    const { data } = await api.get<MovieRecord>(`search/${id}`);
    return data;
};

export const postRecord = async (record: MovieRecord): Promise<string> => {
    const { data } = await api.post<{ id: string }>('movies', record);
    return data.id;
};

export const deleteRecord = async (id: string): Promise<void> => {
    await api.delete(`movies/${id}`);
};

export const getStreamingProviders = async (
    id: string,
    type: string,
    sorted: boolean = true
): Promise<StreamingProvider[]> => {
    const { data } = await api.get<StreamingProvider[]>('streaming', {
        params: { id, type, sorted },
    });
    return data;
};

export const logout = async (): Promise<void> => {
    await api.get('logout');
};
