
import React from 'react';
import { Outlet, Navigate, Link, NavLink, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useLanguage } from '../contexts/useTranslation';
import { Button } from './ui/button';
import { LayoutDashboard, Dumbbell, Settings, History, Library, UserRound, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { BADGES } from '../data/badges';
import { ADVENTURE_PLAN_ID } from '../data/adventure';
import { getPlanMeta } from '../data/planMeta';

/**
 * Mark plus wordmark, tracked caps, split two-tone across the two halves of the
 * name — the same white/grey relationship the logo itself uses, so the lockup
 * and the mark read as one object rather than two.
 */
const BrandWordmark = ({ compact = false }: { compact?: boolean }) => (
    <p className={cn('brand-lockup', compact && 'is-compact')}>
        <img src="/brand/hyperplanner-logo.png" alt="" aria-hidden="true" className="brand-lockup-mark" />
        <span><strong>Hyper</strong><em>planner</em></span>
    </p>
);

export const ProtectedLayout: React.FC = () => {
    const { user, notification, clearNotification, activePlanConfig } = useUser();
    const { t } = useLanguage();
    const location = useLocation();

    if (!user) {
        return <Navigate to="/" replace />;
    }

    // Determine "Current Workout" link - default to persisted or 1/1
    const lastOpened = user.programId === ADVENTURE_PLAN_ID ? '/app/adventure' : localStorage.getItem("lastOpenedPath") || "/app/workout/1/1";

    const isWorkoutRoute = location.pathname.includes('/workout/') || location.pathname.includes('/adventure');

    const navItems = [
        { key: 'dashboard', label: t('sidebar.dashboard'), path: '/app/dashboard', icon: LayoutDashboard },
        { key: 'workout', label: t('sidebar.currentWorkout'), path: lastOpened, icon: Dumbbell },
        { key: 'history', label: t('sidebar.history'), path: '/app/history', icon: History },
        { key: 'exercises', label: t('sidebar.exercises'), path: '/app/exercises', icon: Library },
        { key: 'settings', label: t('sidebar.settings'), path: '/app/settings', icon: Settings },
    ];

    // "Current workout" points at a remembered path, so it can't be matched by
    // equality the way the fixed routes can.
    const isNavActive = (key: string, path: string) =>
        key === 'workout' ? isWorkoutRoute : location.pathname === path;

    const planMeta = getPlanMeta(user?.programId);
    const themeClass = planMeta.themeClass;
    const logoSrc = planMeta.logo;
    const isPeachy = user?.programId === 'peachy-glute-plan';

    return (
        <div className={cn("instrument-shell min-h-screen bg-background flex flex-col md:flex-row", themeClass)}>
            {/* Mobile masthead. It used to exist to hold a hamburger; with the
                drawer gone its job is orientation plus the one route the dock
                has no slot for. */}
            <header className="instrument-toprail flex md:hidden">
                <div className="instrument-toprail-id">
                    <BrandWordmark compact />
                    <p className="instrument-toprail-plan">{activePlanConfig.program.name}</p>
                </div>
                <NavLink
                    to="/app/profile"
                    className={({ isActive }) => cn('instrument-toprail-profile flex', isActive && 'is-active')}
                    aria-label={t('sidebar.profile')}
                >
                    <UserRound className="h-5 w-5" />
                </NavLink>
            </header>

            {/* Desktop sidebar. Labelled, flat, hairline-ruled — no drawer
                counterpart any more, so it is desktop-only. */}
            <div className="instrument-sidebar hidden md:flex md:sticky md:top-0 md:h-screen">
                <div className="flex flex-col h-full w-full">
                    <div className="instrument-sidebar-head">
                        <BrandWordmark />
                        {/* The artwork slot: grayscale at rest, full colour when
                            its own route is active, so "colour on active" is a
                            navigation state rather than a hover trick. */}
                        <NavLink
                            to="/app/dashboard"
                            className={({ isActive }) => cn('plan-plate', isActive && 'is-active')}
                        >
                            <img src={logoSrc} alt="" />
                            <span>
                                <em>{t('profile.activeProtocol')}</em>
                                <strong>{activePlanConfig.program.name}</strong>
                            </span>
                        </NavLink>
                    </div>

                    <nav className="instrument-nav flex flex-col" aria-label="Primary">
                        {navItems.map((item) => (
                            <Link
                                key={item.key}
                                to={item.path}
                                className={cn('nav-control flex', isNavActive(item.key, item.path) && 'is-active')}
                                aria-current={isNavActive(item.key, item.path) ? 'page' : undefined}
                            >
                                <item.icon className="h-5 w-5" />
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </nav>

                    {/* The thing you tap to see who you are is the thing that
                        says who you are. */}
                    <div className="instrument-sidebar-foot">
                        <NavLink
                            to="/app/profile"
                            className={({ isActive }) => cn('identity-row flex', isActive && 'is-active')}
                        >
                            <span>
                                <em>{t('sidebar.loggedInAs')}</em>
                                <strong>{user.codeword}</strong>
                            </span>
                            <UserRound className="h-4 w-4" />
                        </NavLink>
                    </div>
                </div>
            </div>


            {/* Main Content */}
            <main className="instrument-main flex-1 p-4 md:p-8 lg:p-10 overflow-y-auto w-full max-w-[1500px] mx-auto pb-24 md:pb-10">
                <Outlet />
            </main>

            <nav className="mobile-command-dock fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 md:hidden" aria-label="Primary navigation">
                {navItems.map((item) => {
                    const active = isNavActive(item.key, item.path);
                    return (
                        <Link
                            key={item.key}
                            to={item.path}
                            className={cn('dock-item flex flex-col', active && 'is-active')}
                            aria-current={active ? 'page' : undefined}
                        >
                            <item.icon className="h-5 w-5" />
                            <span>{item.label}</span>
                        </Link>
                    );
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
