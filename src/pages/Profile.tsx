import React, { useState } from 'react';
import { LogOut } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useLanguage } from '../contexts/useTranslation';
import { Button } from '../components/ui/button';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { BADGES } from '../data/badges';
import { getPlanMeta } from '../data/planMeta';
import { cn } from '../lib/utils';

/**
 * Identity, not preferences.
 *
 * The trophy case used to hang in the sidebar, where it was flavor living in
 * the chrome — against the brief. It moved here, and it brought company: the
 * mobile drawer was the only way to reach logout and the language switcher, so
 * deleting the drawer meant those needed a home too. What is left is one page
 * answering "who am I on this device, what have I earned, how do I leave".
 */
export const Profile: React.FC = () => {
    const { user, logout, activePlanConfig } = useUser();
    const { t } = useLanguage();
    const [openBadgeId, setOpenBadgeId] = useState<string | null>(null);

    if (!user) return null;

    const planMeta = getPlanMeta(user.programId);
    const earned = BADGES.filter(b => user.badges?.includes(b.id));

    return (
        <div className="instrument-page profile-sheet">
            <h1>{t('profile.title')}</h1>

            <dl className="spec-rows">
                <div>
                    <dt>{t('sidebar.loggedInAs')}</dt>
                    <dd className="font-mono">{user.codeword}</dd>
                </div>
                <div>
                    <dt>{t('profile.activeProtocol')}</dt>
                    <dd>{activePlanConfig.program.name}</dd>
                </div>
                <div>
                    <dt>{t('profile.badgesEarned')}</dt>
                    <dd className="tabular-nums">{earned.length} / {BADGES.length}</dd>
                </div>
            </dl>

            <section className="profile-section">
                <h2>{t('sidebar.trophyCase')}</h2>
                {/* Grayscale-first, colour on earned — the same treatment the
                    program artwork gets, for the same reason: the unearned
                    state has to read from across the room. */}
                <ul className="trophy-grid">
                    {BADGES.map(badge => {
                        const isEarned = !!user.badges?.includes(badge.id);
                        const isOpen = openBadgeId === badge.id;
                        return (
                            <li key={badge.id}>
                                <button
                                    type="button"
                                    onClick={() => setOpenBadgeId(isOpen ? null : badge.id)}
                                    aria-expanded={isOpen}
                                    className={cn('trophy-cell', isEarned ? 'is-earned' : 'is-locked')}
                                >
                                    {badge.image
                                        ? <img src={badge.image} alt="" />
                                        : <span aria-hidden="true" className="trophy-fallback">{badge.name.slice(0, 1)}</span>}
                                    <span className="trophy-name">{badge.name}</span>
                                    <span className="trophy-state">
                                        {isEarned ? t('profile.earned') : t('profile.locked')}
                                    </span>
                                </button>
                                {isOpen && (
                                    <p className="trophy-detail">{t(`badges.${badge.id}.description`)}</p>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </section>

            <section className="profile-section">
                <h2>{t('profile.language')}</h2>
                <LanguageSwitcher />
            </section>

            <section className="profile-section">
                <Button variant="outline" onClick={logout} className="w-full sm:w-auto">
                    <LogOut className="mr-2 h-4 w-4" /> {t('sidebar.logout')}
                </Button>
            </section>

            <img
                src={planMeta.logo}
                alt=""
                aria-hidden="true"
                className="profile-plan-mark"
            />
        </div>
    );
};
