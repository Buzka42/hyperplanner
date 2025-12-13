
import React, { useState } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { Button } from './ui/button';
import { LayoutDashboard, Dumbbell, LogOut, Menu, X, Settings } from 'lucide-react';
import { cn } from '../lib/utils';
import { BADGES } from '../data/badges';

export const ProtectedLayout: React.FC = () => {
    const { user, logout, notification, clearNotification } = useUser();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    if (!user) {
        return <Navigate to="/" replace />;
    }

    // Determine "Current Workout" link - default to persisted or 1/1
    const lastOpened = localStorage.getItem("lastOpenedPath") || "/app/workout/1/1";

    const navItems = [
        { label: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard },
        { label: 'Current Workout', path: lastOpened, icon: Dumbbell },
        { label: 'Settings', path: '/app/settings', icon: Settings },
    ];

    const isPencilneck = user?.programId === 'pencilneck-eradication';
    const isSkeleton = user?.programId === 'skeleton-to-threat';
    const isPeachy = user?.programId === 'peachy-glute-plan';

    let themeClass = "theme-bench-domination";
    if (isPencilneck) themeClass = "theme-pencilneck";
    if (isSkeleton) themeClass = "theme-skeleton";
    if (isPeachy) themeClass = "peachy-theme";

    let logoSrc = "/benchdomination.png";
    if (isPencilneck) logoSrc = "/pencilneck.png";
    if (isSkeleton) logoSrc = "/SKELETON.png";
    if (isPeachy) logoSrc = "/peachy.png";

    return (
        <div className={cn("min-h-screen bg-background flex flex-col md:flex-row", themeClass)}>
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-center p-4 border-b border-border bg-card relative">
                <img src={logoSrc} alt="Logo" className="h-72 w-auto object-contain rounded-lg" />
                <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="absolute right-4">
                    {mobileMenuOpen ? <X /> : <Menu />}
                </Button>
            </div>

            {/* Sidebar (Desktop) / Drawer (Mobile) */}
            <div className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border p-4 transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0",
                mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex flex-col h-full">
                    <div className="hidden md:flex flex-col items-center mb-6 text-center">
                        <img src={logoSrc} alt="Plan Logo" className="w-[calc(100%+2rem)] -ml-4 -mr-4 -mt-4 mb-4 max-w-none h-auto object-cover rounded-lg" />
                    </div>
                    <style>{`
                    .peachy-theme {
                        --background: 340 100% 97%; 
                        --foreground: 340 80% 15%;
                        --card: 340 100% 99%; 
                        --card-foreground: 340 80% 15%;
                        --popover: 340 100% 99%;
                        --popover-foreground: 340 80% 15%;
                        --primary: 340 100% 65%; 
                        --primary-foreground: 0 0% 100%;
                        --secondary: 340 60% 92%; 
                        --secondary-foreground: 340 100% 20%;
                        --muted: 340 30% 90%;
                        --muted-foreground: 340 60% 30%;
                        --accent: 340 60% 92%;
                        --accent-foreground: 340 100% 20%;
                        --destructive: 0 84.2% 60.2%;
                        --destructive-foreground: 210 40% 98%;
                        --border: 340 40% 85%;
                        --input: 340 40% 85%;
                        --ring: 340 100% 65%;
                    }
                    .peachy-theme .text-primary { color: hsl(340, 100%, 65%) !important; }
                    .peachy-theme .bg-primary { background-color: hsl(340, 100%, 65%) !important; }
                    
                    /* Force dark text for buttons and navigation in peachy theme */
                    .peachy-theme button { color: hsl(340, 80%, 15%) !important; }
                    .peachy-theme a { color: hsl(340, 80%, 15%) !important; }
                    .peachy-theme svg { color: hsl(340, 80%, 15%) !important; }
                    .peachy-theme h1, .peachy-theme h2, .peachy-theme h3, .peachy-theme h4, .peachy-theme h5, .peachy-theme h6 { 
                        color: hsl(340, 80%, 15%) !important; 
                    }
                    
                    /* Shimmer Effect for Text/Images */
                    .shimmer-active-froggy {
                        animation: shimmer-froggy 2.5s infinite linear;
                        background: linear-gradient(to right, #84cc16 0%, #facc15 50%, #84cc16 100%);
                        background-size: 200% auto;
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent; 
                    }
                    .shimmer-active-peachy {
                        animation: shimmer-peachy 2.5s infinite linear;
                        background: linear-gradient(to right, #facc15 0%, #fb923c 50%, #facc15 100%);
                        background-size: 200% auto;
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent; 
                    }

                    @keyframes shimmer-froggy {
                         to { background-position: 200% center; }
                    }
                    @keyframes shimmer-peachy {
                         to { background-position: 200% center; }
                    }

                    .shimmer-img {
                         filter: drop-shadow(0 0 10px rgba(132, 204, 22, 0.5));
                         animation: pulse-glow 2s infinite ease-in-out;
                    }
                    @keyframes pulse-glow {
                        0%, 100% { filter: drop-shadow(0 0 10px rgba(132, 204, 22, 0.5)); transform: scale(1); }
                        50% { filter: drop-shadow(0 0 20px rgba(250, 204, 21, 0.8)); transform: scale(1.05); }
                    }
                 `}</style>

                    <div className="space-y-2 flex-1">
                        {navItems.map((item) => {
                            // Simple active check: strictly matches start or special case for workout
                            const isActive = item.label === 'Current Workout'
                                ? location.pathname.includes('/workout/')
                                : location.pathname === item.path;

                            return (
                                <Link
                                    key={item.label}
                                    to={item.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <Button
                                        variant={isActive ? "secondary" : "ghost"}
                                        className="w-full justify-start text-lg h-12"
                                    >
                                        <item.icon className="mr-3 h-5 w-5" />
                                        {item.label}
                                    </Button>
                                </Link>
                            );
                        })}
                    </div>

                    <div className="border-t pt-4">
                        <div className="px-2 mb-4">
                            <h4 className="text-[10px] uppercase font-bold text-muted-foreground mb-2 text-center">Trophy Case</h4>
                            <div className="grid grid-cols-4 gap-2 justify-items-center">
                                {BADGES.map((badge) => {
                                    const isEarned = user.badges?.includes(badge.id);
                                    return (
                                        <div key={badge.id} className="group relative">
                                            <div className="absolute bottom-full mb-2 -left-8 w-24 bg-black text-white text-[10px] p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 text-center">
                                                <div className="font-bold">{badge.name}</div>
                                                <div className="text-[8px] text-gray-300">{badge.description}</div>
                                            </div>
                                            <div className={`w-8 h-8 flex items-center justify-center transition-all duration-500 ${isEarned ? 'grayscale-0 opacity-100 scale-100' : 'grayscale opacity-20 scale-90'}`}>
                                                {badge.image ? (
                                                    <img src={badge.image} alt={badge.name} className="w-full h-full object-contain filter drop-shadow-sm cursor-help" />
                                                ) : (
                                                    <span className="text-xl filter drop-shadow-sm cursor-help">{badge.icon}</span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="border-t pt-2"></div>
                        <div className="px-4 py-2 mb-4 bg-muted/50 rounded text-sm">
                            <p className="text-muted-foreground">Logged in as:</p>
                            <p className="font-mono text-primary font-bold truncate">{user.codeword}</p>
                        </div>
                        <Button variant="outline" className="w-full" onClick={logout}>
                            <LogOut className="mr-2 h-4 w-4" /> Logout
                        </Button>
                    </div>
                </div>
            </div>


            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full max-w-7xl mx-auto">
                <Outlet />
            </main>

            {/* Badge Unlock Notification Overlay */}
            {notification && notification.type === 'badge' && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 animate-in fade-in duration-300">
                    <div className="bg-gradient-to-br from-yellow-900/90 to-black border border-yellow-500/50 p-8 rounded-xl max-w-sm text-center shadow-[0_0_50px_rgba(234,179,8,0.3)] relative">
                        <button onClick={clearNotification} className="absolute top-2 right-2 text-yellow-500/50 hover:text-yellow-500"><X /></button>
                        <h2 className="text-2xl font-black text-yellow-500 mb-2 tracking-widest uppercase animate-pulse">Badge Unlocked!</h2>

                        {(() => {
                            const b = BADGES.find(x => x.id === notification.badgeId);
                            if (!b) return null;
                            return (
                                <div className="space-y-4">
                                    <div className="text-6xl my-4 animate-bounce filter drop-shadow-[0_0_15px_rgba(234,179,8,0.8)]">
                                        {b.image ? <img src={b.image} alt={b.name} className="w-32 h-32 object-contain mx-auto" /> : b.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-white">{b.name}</h3>
                                    <p className="text-yellow-200/80 text-sm">{b.description}</p>
                                    <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold mt-4" onClick={clearNotification}>
                                        CLAIM GLORY
                                    </Button>
                                </div>
                            )
                        })()}
                    </div>
                    {/* CSS Confetti would go here, simpler to just use CSS animations on elements */}
                </div>
            )}
        </div>
    );
};
