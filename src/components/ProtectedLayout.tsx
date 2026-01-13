
import React, { useState } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useLanguage } from '../contexts/useTranslation';
import { Button } from './ui/button';
import { LayoutDashboard, Dumbbell, LogOut, Menu, X, Settings, History } from 'lucide-react';
import { cn } from '../lib/utils';
import { BADGES } from '../data/badges';
import { LanguageSwitcher } from './LanguageSwitcher';

export const ProtectedLayout: React.FC = () => {
    const { user, logout, notification, clearNotification } = useUser();
    const { t } = useLanguage();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [expandedBadgeId, setExpandedBadgeId] = useState<string | null>(null);

    if (!user) {
        return <Navigate to="/" replace />;
    }

    // Determine "Current Workout" link - default to persisted or 1/1
    const lastOpened = localStorage.getItem("lastOpenedPath") || "/app/workout/1/1";

    const navItems = [
        { label: t('sidebar.dashboard'), path: '/app/dashboard', icon: LayoutDashboard },
        { label: t('sidebar.currentWorkout'), path: lastOpened, icon: Dumbbell },
        { label: t('sidebar.history'), path: '/app/history', icon: History },
        { label: t('sidebar.settings'), path: '/app/settings', icon: Settings },
    ];

    const isPencilneck = user?.programId === 'pencilneck-eradication';
    const isSkeleton = user?.programId === 'skeleton-to-threat';
    const isPeachy = user?.programId === 'peachy-glute-plan';
    const isPainGlory = user?.programId === 'pain-and-glory';
    const isTrinary = user?.programId === 'trinary';

    let themeClass = "theme-bench-domination";
    if (isPencilneck) themeClass = "theme-pencilneck";
    if (isSkeleton) themeClass = "theme-skeleton";
    if (isPeachy) themeClass = "peachy-theme";
    if (isPainGlory) themeClass = "theme-pain-glory";
    if (isTrinary) themeClass = "theme-trinary";

    let logoSrc = "/benchdomination.png";
    if (isPencilneck) logoSrc = "/pencilneck.png";
    if (isSkeleton) logoSrc = "/SKELETON.png";
    if (isPeachy) logoSrc = "/peachy.png";
    if (isPainGlory) logoSrc = "/painglory.png";
    if (isTrinary) logoSrc = "/trinary.png";

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
                            <h4 className="text-[10px] uppercase font-bold text-muted-foreground mb-2 text-center">{t('sidebar.trophyCase')}</h4>
                            <div className="grid grid-cols-4 gap-2 justify-items-center">
                                {BADGES.map((badge) => {
                                    const isEarned = user.badges?.includes(badge.id);
                                    const isExpanded = expandedBadgeId === badge.id;
                                    const description = t(`badges.${badge.id}.description`);
                                    return (
                                        <div
                                            key={badge.id}
                                            className={`group relative transition-all duration-300 ${isExpanded ? 'col-span-4 w-full bg-secondary/50 p-2 rounded-lg border border-yellow-500/50 z-10' : ''}`}
                                            onClick={() => setExpandedBadgeId(isExpanded ? null : badge.id)}
                                        >
                                            {!isExpanded && (
                                                <div className="absolute bottom-full mb-2 -left-8 w-24 bg-black text-white text-[10px] p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 text-center">
                                                    <div className="font-bold">{badge.name}</div>
                                                    <div className="text-[8px] text-gray-300">{description}</div>
                                                </div>
                                            )}

                                            {isExpanded ? (
                                                <div className="flex flex-col items-center animate-in fade-in zoom-in duration-200">
                                                    <div className="text-sm font-bold text-primary mb-1 text-center">{badge.name}</div>
                                                    {badge.image ? (
                                                        <img src={badge.image} alt={badge.name} className="w-24 h-24 object-contain mb-2 filter drop-shadow-md" />
                                                    ) : (
                                                        <span className="text-4xl mb-2">{badge.icon}</span>
                                                    )}
                                                    <div className="text-[10px] text-muted-foreground text-center px-2">{description}</div>
                                                </div>
                                            ) : (
                                                <div className={`w-8 h-8 flex items-center justify-center transition-all duration-500 ${isEarned ? 'grayscale-0 opacity-100 scale-100' : 'grayscale opacity-20 scale-90'}`}>
                                                    {badge.image ? (
                                                        <img src={badge.image} alt={badge.name} className="w-full h-full object-contain filter drop-shadow-sm cursor-pointer" />
                                                    ) : (
                                                        <span className="text-xl filter drop-shadow-sm cursor-pointer">{badge.icon}</span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="border-t pt-2"></div>
                        <div className="px-4 py-2 mb-4 bg-muted/50 rounded text-sm">
                            <p className="text-muted-foreground">{t('sidebar.loggedInAs')}</p>
                            <p className="font-mono text-primary font-bold truncate">{user.codeword}</p>
                        </div>
                        <Button variant="outline" className="w-full" onClick={logout}>
                            <LogOut className="mr-2 h-4 w-4" /> {t('sidebar.logout')}
                        </Button>
                        <div className="mt-4 flex justify-center">
                            <LanguageSwitcher size="sm" />
                        </div>
                    </div>
                </div>
            </div>


            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full max-w-7xl mx-auto">
                <Outlet />
            </main>

            {/* Badge Unlock Notification Overlay */}
            {notification && notification.type === 'badge' && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 animate-in fade-in duration-300">
                    <style>{`
                        @keyframes confetti-fall {
                            0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
                            100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
                        }
                        .confetti-piece {
                            position: absolute;
                            top: -20px;
                            width: 10px;
                            height: 20px;
                            animation: confetti-fall 4s linear infinite;
                        }
                    `}</style>
                    {/* Confetti Effect */}
                    <div className="fixed inset-0 pointer-events-none z-[90] overflow-hidden">
                        {Array.from({ length: 50 }).map((_, i) => (
                            <div
                                key={i}
                                className="confetti-piece"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    animationDelay: `${Math.random() * 2}s`,
                                    backgroundColor: ['#ef4444', '#eab308', '#3b82f6', '#22c55e', '#a855f7'][Math.floor(Math.random() * 5)]
                                }}
                            />
                        ))}
                    </div>

                    <div className={cn(
                        "p-8 rounded-xl max-w-md w-full text-center relative border mx-4 backdrop-blur-sm",
                        isPeachy
                            ? "bg-white/90 border-rose-300 shadow-[0_0_50px_rgba(251,113,133,0.5)]"
                            : "bg-gradient-to-br from-yellow-900/90 to-black border-yellow-500/50 shadow-[0_0_50px_rgba(234,179,8,0.3)]"
                    )}>
                        <button onClick={clearNotification} className={cn("absolute top-2 right-2", isPeachy ? "text-rose-300 hover:text-rose-500" : "text-yellow-500/50 hover:text-yellow-500")}><X /></button>
                        <h2 className={cn("text-3xl font-black mb-2 tracking-widest uppercase animate-pulse", isPeachy ? "text-rose-500" : "text-yellow-500")}>Badge Unlocked!</h2>

                        {(() => {
                            const b = BADGES.find(x => x.id === notification.badgeId);
                            if (!b) return null;

                            // Try to fetch quote
                            // @ts-ignore
                            const quote = t(`quotes.painGloryBadges.${notification.badgeId}`);
                            const displayQuote = quote && !quote.includes('quotes.painGloryBadges.') ? quote : null;

                            return (
                                <div className="space-y-6">
                                    <div className={cn("text-8xl my-6 animate-bounce", isPeachy ? "filter drop-shadow-[0_0_15px_rgba(251,113,133,0.5)]" : "filter drop-shadow-[0_0_15px_rgba(234,179,8,0.8)]")}>
                                        {b.image ? <img src={b.image} alt={b.name} className="w-40 h-40 object-contain mx-auto" /> : b.icon}
                                    </div>
                                    <div>
                                        <h3 className={cn("text-2xl font-bold mb-1", isPeachy ? "text-gray-800" : "text-white")}>{b.name}</h3>
                                        <p className={cn("text-sm", isPeachy ? "text-rose-400" : "text-yellow-200/80")}>{b.description}</p>
                                    </div>

                                    {displayQuote && (
                                        <div className="py-4 border-t border-b border-white/10">
                                            <p className={cn("text-lg italic font-serif", isPeachy ? "text-rose-600" : "text-amber-100")}>
                                                "{displayQuote}"
                                            </p>
                                        </div>
                                    )}

                                    <Button size="lg" className={cn("w-full font-bold text-lg py-6 mt-4", isPeachy ? "bg-rose-500 hover:bg-rose-600 text-white" : "bg-yellow-600 hover:bg-yellow-700 text-white")} onClick={clearNotification}>
                                        CLAIM GLORY
                                    </Button>
                                </div>
                            )
                        })()}
                    </div>
                </div>
            )}
        </div>
    );
};
