import { Outlet } from 'react-router-dom';
import TopBar from './TopBar';

const Layout = () => {
    return (
        <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
            {/* Flat Design Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-96 bg-primary/5 -z-10 rounded-b-[100px] sm:rounded-b-[200px]" />
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-secondary/5 rounded-full -z-10 blur-none" />
            <div className="absolute top-64 -left-16 w-64 h-64 bg-accent/5 rotate-45 -z-10 blur-none" />

            <TopBar />
            <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 z-0">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
