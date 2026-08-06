import React, { useEffect, useMemo, useState } from 'react';
import { collection, deleteDoc, doc, getDocs, onSnapshot, setDoc } from 'firebase/firestore';
import { Copy, KeyRound, RefreshCw, Save, ShieldCheck, Trash2, Users } from 'lucide-react';
import { db, auth } from '../firebase';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { DEFAULT_ONBOARDING_CONFIG, normalizeKeyword, PLAN_OPTIONS, type AccessKey, type OnboardingConfig } from '../data/accessControl';

const PlanChecklist = ({ value, available, onChange }: { value: string[]; available?: string[]; onChange: (v: string[]) => void }) => (
    <div className="admin-plan-grid">
        {PLAN_OPTIONS.filter(p => !available || available.includes(p.id)).map(plan => <label className="admin-plan-option" key={plan.id}>
            <input type="checkbox" checked={value.includes(plan.id)} onChange={() => onChange(value.includes(plan.id) ? value.filter(id => id !== plan.id) : [...value, plan.id])} />
            <span>{plan.name}</span>
        </label>)}
    </div>
);

export const AdminPanel: React.FC = () => {
    const [config, setConfig] = useState<OnboardingConfig>(DEFAULT_ONBOARDING_CONFIG);
    const [keys, setKeys] = useState<AccessKey[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [keyword, setKeyword] = useState('');
    const [label, setLabel] = useState('');
    const [plans, setPlans] = useState<string[]>([]);
    const [expiresAt, setExpiresAt] = useState('');
    const [allowSwitching, setAllowSwitching] = useState(true);
    const [query, setQuery] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const stopConfig = onSnapshot(doc(db, 'appConfig', 'onboarding'), snap => {
            if (snap.exists()) setConfig({ ...DEFAULT_ONBOARDING_CONFIG, ...snap.data() } as OnboardingConfig);
        });
        const stopKeys = onSnapshot(collection(db, 'accessKeys'), snap => setKeys(snap.docs.map(item => item.data() as AccessKey)));
        getDocs(collection(db, 'users')).then(s => setUsers(s.docs.map(d => d.data())));
        return () => { stopConfig(); stopKeys(); };
    }, []);

    const visibleKeys = useMemo(() => keys.filter(key => `${key.keyword} ${key.label || ''}`.toLowerCase().includes(query.toLowerCase())), [keys, query]);
    const saveConfig = async () => {
        await setDoc(doc(db, 'appConfig', 'onboarding'), { ...config, updatedAt: new Date().toISOString() }, { merge: true });
        setMessage('Onboarding policy saved.');
    };
    const createKey = async (e: React.FormEvent) => {
        e.preventDefault();
        const id = normalizeKeyword(keyword);
        if (id.length < config.keywordMinLength || id.length > config.keywordMaxLength || !plans.length) {
            setMessage('Enter a valid keyword and select at least one plan.'); return;
        }
        await setDoc(doc(db, 'accessKeys', id), {
            keyword: id, label: label.trim(), allowedPlanIds: plans, active: true, source: 'admin', allowPlanSwitching: allowSwitching,
            expiresAt: expiresAt ? new Date(`${expiresAt}T23:59:59`).toISOString() : null,
            createdAt: new Date().toISOString(), createdBy: auth.currentUser?.uid || ''
        } satisfies AccessKey);
        setKeyword(''); setLabel(''); setPlans([]); setExpiresAt(''); setMessage(`Keyword “${id}” created.`);
    };
    const updateKey = (key: AccessKey, updates: Partial<AccessKey>) => setDoc(doc(db, 'accessKeys', key.keyword), { ...key, ...updates }, { merge: true });

    return <main className="admin-console min-h-screen bg-background text-foreground">
        <header className="admin-command-bar">
            <div><h1><ShieldCheck /> Access control</h1><p>Manage onboarding inventory, keyword permissions, and account access.</p></div>
            <div className="admin-live"><span /> LIVE · {keys.length} keywords · {users.length} users</div>
        </header>
        {message && <div className="admin-notice" role="status">{message}<button onClick={() => setMessage('')}>Dismiss</button></div>}
        <div className="admin-layout">
            <section className="admin-sector">
                <div className="admin-sector-heading"><div><h2>New keyword</h2><p>Issue plan access before a new athlete enters onboarding.</p></div><KeyRound /></div>
                <form onSubmit={createKey} className="admin-form">
                    <Label htmlFor="new-keyword">Keyword</Label><Input id="new-keyword" value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="athlete-keyword" />
                    <Label htmlFor="key-label">Admin label</Label><Input id="key-label" value={label} onChange={e => setLabel(e.target.value)} placeholder="Optional: athlete or campaign" />
                    <Label>Available plans</Label><PlanChecklist value={plans} onChange={setPlans} />
                    <div className="admin-inline"><label><input type="checkbox" checked={allowSwitching} onChange={e => setAllowSwitching(e.target.checked)} /> Allow plan switching</label><div><Label htmlFor="expiry">Expires</Label><Input id="expiry" type="date" value={expiresAt} onChange={e => setExpiresAt(e.target.value)} /></div></div>
                    <Button type="submit"><KeyRound className="mr-2 h-4 w-4" />Create keyword</Button>
                </form>
            </section>

            <section className="admin-sector">
                <div className="admin-sector-heading"><div><h2>Public keyword policy</h2><p>Controls what anyone can create from the login screen.</p></div><Save /></div>
                <div className="admin-form">
                    <label className="admin-toggle"><input type="checkbox" checked={config.allowPublicKeywordCreation} onChange={e => setConfig({ ...config, allowPublicKeywordCreation: e.target.checked })} /><span><strong>Public creation</strong><small>Show “Create a new keyword” on login.</small></span></label>
                    <Label>Generally available plans</Label><PlanChecklist value={config.generalPlanIds} onChange={generalPlanIds => setConfig({ ...config, generalPlanIds })} />
                    <div className="admin-numbers"><div><Label>Minimum length</Label><Input type="number" min={3} max={32} value={config.keywordMinLength} onChange={e => setConfig({ ...config, keywordMinLength: +e.target.value })} /></div><div><Label>Maximum length</Label><Input type="number" min={4} max={64} value={config.keywordMaxLength} onChange={e => setConfig({ ...config, keywordMaxLength: +e.target.value })} /></div><div><Label>Default expiry (days)</Label><Input type="number" min={0} value={config.defaultExpiryDays} onChange={e => setConfig({ ...config, defaultExpiryDays: +e.target.value })} /></div></div>
                    <Button onClick={saveConfig}><Save className="mr-2 h-4 w-4" />Save policy</Button>
                </div>
            </section>
        </div>

        <section className="admin-ledger">
            <div className="admin-ledger-tools"><div><h2>Keyword ledger</h2><p>Disable, edit plan inventory, copy, or revoke issued access.</p></div><Input aria-label="Search keywords" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search keyword or label" /></div>
            {!visibleKeys.length ? <div className="admin-empty"><KeyRound /><h3>No matching keywords</h3><p>Create the first keyword above or clear the search.</p></div> : visibleKeys.map(key => <article className="admin-key-row" key={key.keyword}>
                <div className="admin-key-identity"><strong>{key.keyword}</strong><span>{key.label || key.source} · {key.expiresAt ? `expires ${new Date(key.expiresAt).toLocaleDateString()}` : 'no expiry'}</span></div>
                <PlanChecklist value={key.allowedPlanIds} onChange={allowedPlanIds => updateKey(key, { allowedPlanIds })} />
                <label className="admin-status"><input type="checkbox" checked={key.active} onChange={e => updateKey(key, { active: e.target.checked })} /> {key.active ? 'Active' : 'Disabled'}</label>
                <div className="admin-row-actions"><Button variant="ghost" size="icon" aria-label={`Copy ${key.keyword}`} onClick={() => navigator.clipboard.writeText(key.keyword)}><Copy /></Button><Button variant="destructive" size="icon" aria-label={`Delete ${key.keyword}`} onClick={() => window.confirm(`Delete “${key.keyword}”?`) && deleteDoc(doc(db, 'accessKeys', key.keyword))}><Trash2 /></Button></div>
            </article>)}
        </section>
        <footer className="admin-footer"><Users /> {users.length} registered profiles <RefreshCw /> Changes sync immediately</footer>
    </main>;
};
