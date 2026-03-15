import { Outlet } from 'react-router-dom';
import TopBar from './TopBar';

const Layout = () => {
    return (
        <div className="min-h-screen bg-background text-text-main relative flex flex-col font-sans selection:bg-primary selection:text-white">
            <div className="swiss-noise z-0"></div>
            <TopBar />
            <main className="flex-1 w-full max-w-screen-2xl mx-auto p-4 sm:p-6 lg:px-12 lg:py-8 xl:px-24 xl:py-12 relative z-10 transition-all duration-300">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
