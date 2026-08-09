import React, { useState } from 'react';
import { KeyRound, Library, ShieldCheck } from 'lucide-react';

import { AdminPanel } from '../AdminPanel';
import { LibraryTab } from './LibraryTab';

type TabId = 'access' | 'library';

const TABS: { id: TabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'access', label: 'Access control', icon: KeyRound },
    { id: 'library', label: 'Exercise library', icon: Library },
];

/**
 * Admin console shell.
 *
 * The access-control panel is the original AdminPanel, moved under a tab
 * unchanged. New tabs (exercise library, and later the plan composer, volume
 * analysis and version history) hang off the same shell and reuse the
 * `admin-*` styles already in index.css.
 */
export const AdminShell: React.FC = () => {
    const [tab, setTab] = useState<TabId>('access');

    return (
        <div className="admin-console-root">
            <nav className="admin-tabs" aria-label="Admin sections">
                <div className="admin-tabs-brand">
                    <ShieldCheck />
                    <span>Hyperplanner admin</span>
                </div>
                <div className="admin-tabs-list" role="tablist">
                    {TABS.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            role="tab"
                            aria-selected={tab === id}
                            className={tab === id ? 'admin-tab is-active' : 'admin-tab'}
                            onClick={() => setTab(id)}
                        >
                            <Icon className="h-4 w-4" />
                            {label}
                        </button>
                    ))}
                </div>
            </nav>

            {tab === 'access' && <AdminPanel />}
            {tab === 'library' && <LibraryTab />}
        </div>
    );
};
