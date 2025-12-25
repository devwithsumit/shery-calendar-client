import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export const AppLayout = () => {
    const [sideBarCollapsed, setSideBarCollapsed] = useState(false);

    const handleMenuToggle = () => {
        setSideBarCollapsed(!sideBarCollapsed);
    };

    return (
        <div className="min-h-screen bg-linear-to-br 
        from-bg-light to-bg-light/30 dark:from-bg-dark dark:to-bg-dark/20">
            {/* Gradient overlay for brand feel */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute -top-[40%] left-1/2 w-96 h-96 bg-primary/25 rounded-full blur-3xl" />
                <div className="absolute -bottom-[45%] left-1/5 w-96 h-96 bg-primary/25 rounded-full blur-3xl" />
            </div>

            <div className="relative flex flex-col min-h-screen">
                <Header onMenuClick={handleMenuToggle} />
                <div className="flex flex-1 overflow-hidden">
                    <Sidebar collapsed={sideBarCollapsed} />
                    <main className="flex-1 overflow-auto">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
};
