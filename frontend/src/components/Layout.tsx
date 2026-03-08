import { Outlet } from 'react-router-dom';
import TopBar from './TopBar';

const Layout = () => {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <TopBar />
            <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
