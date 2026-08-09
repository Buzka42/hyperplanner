
import React, { useState } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useLanguage } from '../contexts/useTranslation';
import { Button } from './ui/button';
import { LayoutDashboard, Dumbbell, LogOut, Menu, X, Settings, History, Library } from 'lucide-react';
import { cn } from '../lib/utils';
import { BADGES } from '../data/badges';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ADVENTURE_PLAN_ID } from '../data/adventure';
import { getPlanMeta } from '../data/planMeta';

const BrandWordmark = ({ compact = false }: { compact?: boolean }) => (
    <div className="brand-lockup flex items-center gap-2.5" aria-label="Hyperplanner">
        <img src="/brand/hyperplanner-logo.png" alt="" className={compact ? "h-8 w-8 object-contain" : "h-10 w-10 object-contain"} />
        <p className={cn("font-display uppercase tracking-[0.07em] leading-none", compact ? "text-lg font-semibold" : "text-2xl font-semibold")}>
            <span className="text-foreground">Hyper</span><span className="text-muted-foreground">Planner</span>
        </p>
    </div>
);

export const ProtectedLayout: React.FC = () => {
    const { user, logout, notification, clearNotification, activePlanConfig } = useUser();
    const { t } = useLanguage();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [expandedBadgeId, setExpandedBadgeId] = useState<string | null>(null);

    if (!user) {
        return <Navigate to="/" replace />;
    }

    // Determine "Current Workout" link - default to persisted or 1/1
    const lastOpened = user.programId === ADVENTURE_PLAN_ID ? '/app/adventure' : localStorage.getItem("lastOpenedPath") || "/app/workout/1/1";

    const navItems = [
        { label: t('sidebar.dashboard'), path: '/app/dashboard', icon: LayoutDashboard },
        { label: t('sidebar.currentWorkout'), path: lastOpened, icon: Dumbbell },
        { label: t('sidebar.history'), path: '/app/history', icon: History },
        { label: t('sidebar.exercises'), path: '/app/exercises', icon: Library },
        { label: t('sidebar.settings'), path: '/app/settings', icon: Settings },
    ];

    const planMeta = getPlanMeta(user?.programId);
    const themeClass = planMeta.themeClass;
    const logoSrc = planMeta.logo;
    const isPeachy = user?.programId === 'peachy-glute-plan';

    return (
        <div className={cn("instrument-shell min-h-screen bg-background flex flex-col md:flex-row", themeClass)}>
            {/* Mobile Header */}
            <header className="instrument-toprail md:hidden flex items-center px-4 h-16 border-b bg-card relative">
                <div className="min-w-0 pr-16">
                    <BrandWordmark compact />
                    <p className="text-[10px] uppercase tracking-[0.14em] text-primary truncate">{activePlanConfig.program.name}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="absolute right-4" aria-label="Toggle menu">
                    {mobileMenuOpen ? <X /> : <Menu />}
                </Button>
            </header>

            {/* Sidebar (Desktop) / Drawer (Mobile) */}
            <div className={cn(
                "instrument-sidebar fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border p-4 transform transition-transform duration-200 ease-out md:sticky md:top-0 md:h-screen md:translate-x-0",
                mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex flex-col h-full">
                    <div className="hidden md:flex flex-col mb-8 pt-2">
                        <BrandWordmark />
                        <div className="mt-5 flex items-center gap-3 border-y border-border/70 py-3">
                            <img src={logoSrc} alt="Plan Logo" className="h-12 w-16 object-contain" />
                            <div className="min-w-0"><p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Active protocol</p><p className="font-display text-sm font-bold uppercase text-primary truncate">{activePlanConfig.program.name}</p></div>
                        </div>
                    </div>

                    <div className="space-y-2 flex-1">
                        {navItems.map((item) => {
                            // Simple active check: strictly matches start or special case for workout
                            const isActive = item.label === t('sidebar.currentWorkout')
                                ? location.pathname.includes('/workout/') || location.pathname.includes('/adventure')
                                : location.pathname === item.path;

                            return (
                                <Link
                                    key={item.label}
                                    to={item.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <Button
                                        variant={isActive ? "secondary" : "ghost"}
                                        className="nav-control w-full justify-start h-12"
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
            <main className="instrument-main flex-1 p-4 md:p-8 lg:p-10 overflow-y-auto w-full max-w-[1500px] mx-auto pb-24 md:pb-10">
                <Outlet />
            </main>

            <nav className="mobile-command-dock md:hidden fixed bottom-0 inset-x-0 z-40 grid grid-cols-4 border-t bg-card/95" aria-label="Primary navigation">
                {navItems.map((item) => {
                    const isActive = item.path === lastOpened ? location.pathname.includes('/workout/') : location.pathname === item.path;
                    return <Link key={item.path} to={item.path} className={cn("flex min-h-16 flex-col items-center justify-center gap-1 px-1 text-center text-[9px] font-bold uppercase tracking-[0.06em]", isActive ? "text-primary bg-primary/10" : "text-muted-foreground")}><item.icon className="h-5 w-5"/><span className="line-clamp-1">{item.label}</span></Link>;
                })}
            </nav>

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
                        <h2 className={cn("text-3xl font-black mb-2 tracking-widest uppercase", isPeachy ? "text-rose-500" : "text-yellow-500")}>Badge Unlocked!</h2>

                        {(() => {
                            const b = BADGES.find(x => x.id === notification.badgeId);
                            if (!b) return null;

                            // Try to fetch quote
                            // @ts-ignore
                            const quote = t(`quotes.painGloryBadges.${notification.badgeId}`);
                            const displayQuote = quote && !quote.includes('quotes.painGloryBadges.') ? quote : null;

                            return (
                                <div className="space-y-6">
                                    <div className={cn("text-8xl my-6", isPeachy ? "filter drop-shadow-[0_0_15px_rgba(251,113,133,0.5)]" : "filter drop-shadow-[0_0_15px_rgba(234,179,8,0.8)]")}>
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
