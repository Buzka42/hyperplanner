
import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useUser } from '../contexts/UserContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Trash2, Shield, User, Trophy, Activity, Save } from 'lucide-react';
import { BADGES } from '../data/badges';
import type { BadgeId } from '../types';

export const AdminPanel: React.FC = () => {
    const { user: currentUser, isAdmin } = useUser();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passwordInput, setPasswordInput] = useState("");

    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Auto-auth if already logged in as judziek
    useEffect(() => {
        if (isAdmin || currentUser?.codeword.toLowerCase() === 'judziek') {
            setIsAuthenticated(true);
        }
    }, [currentUser, isAdmin]);

    const handleLogin = () => {
        if (passwordInput.toLowerCase() === 'judziek') {
            setIsAuthenticated(true);
        } else {
            alert("ACCESS DENIED");
        }
    };

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, "users"));
            const fetchedUsers = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsers(fetchedUsers);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchUsers();
        }
    }, [isAuthenticated]);

    const handleDeleteUser = async (userId: string) => {
        if (!window.confirm("Are you sure you want to delete this user plan? This cannot be undone.")) return;
        try {
            const workoutsRef = collection(db, "users", userId, "workouts");
            const snapshot = await getDocs(workoutsRef);
            const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
            await Promise.all(deletePromises);
            await deleteDoc(doc(db, "users", userId));
            setUsers(users.filter(u => u.id !== userId));
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Failed to delete user.");
        }
    };

    const handleSaveUser = async (updatedUser: any) => {
        try {
            await updateDoc(doc(db, "users", updatedUser.id), updatedUser);
            setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
            alert("User updated successfully.");
        } catch (e) {
            console.error("Update failed", e);
            alert("Update failed.");
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
                <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-red-500 text-center text-3xl font-black uppercase tracking-widest">
                            God Mode
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Input
                            type="password"
                            placeholder="Enter Codeword..."
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            className="bg-black border-zinc-700 text-white text-center text-lg tracking-widest"
                        />
                        <Button
                            className="w-full bg-red-600 hover:bg-red-700 font-bold"
                            onClick={handleLogin}
                        >
                            AUTHENTICATE
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (loading) return <div className="p-8 text-center text-white">Loading Subjects...</div>;

    return (
        <div className="min-h-screen bg-zinc-950 p-8 text-zinc-100">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-red-500 flex items-center gap-2">
                        <Shield className="w-8 h-8" /> GOD MODE
                    </h1>
                    <p className="text-zinc-500">Subject Management Interface</p>
                </div>
                <Button onClick={fetchUsers} variant="outline">Refresh Data</Button>
            </div>

            <div className="grid gap-4">
                {users.map((user) => (
                    <Card key={user.id} className="bg-zinc-900 border-zinc-800">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-xl text-zinc-500">
                                    {user.codeword?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <div className="font-bold text-lg text-white flex items-center gap-2">
                                        {user.codeword}
                                        <span className="text-xs bg-zinc-800 px-2 py-0.5 rounded text-zinc-400 font-normal">{user.programId}</span>
                                    </div>
                                    <div className="text-sm text-zinc-500">
                                        Week {user.benchDominationStatus?.completedWeeks ? user.benchDominationStatus.completedWeeks + 1 : '1'} •
                                        Badges: {user.badges?.length || 0} •
                                        Last Active: {user.gluteMeasurements?.length ? new Date(user.gluteMeasurements[user.gluteMeasurements.length - 1].date).toLocaleDateString() : 'Unknown'}
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="secondary">
                                            <User className="w-4 h-4 mr-2" /> Manage
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-zinc-900 border-zinc-800 text-zinc-100">
                                        <DialogHeader>
                                            <DialogTitle>Editing Subject: {user.codeword}</DialogTitle>
                                        </DialogHeader>
                                        <UserEditor user={user} onSave={handleSaveUser} />
                                    </DialogContent>
                                </Dialog>

                                <Button variant="destructive" size="icon" onClick={() => handleDeleteUser(user.id)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

const UserEditor = ({ user, onSave }: { user: any, onSave: (u: any) => void }) => {
    const [localUser, setLocalUser] = useState(user);

    // Ensure safe default objects
    if (!localUser.stats) localUser.stats = {};
    if (!localUser.badges) localUser.badges = [];

    const handleStatChange = (key: string, val: string) => {
        setLocalUser({
            ...localUser,
            stats: { ...localUser.stats, [key]: Number(val) }
        });
    };

    const toggleBadge = (id: BadgeId) => {
        const currentBadges = localUser.badges || [];
        if (currentBadges.includes(id)) {
            setLocalUser({ ...localUser, badges: currentBadges.filter((b: string) => b !== id) });
        } else {
            setLocalUser({ ...localUser, badges: [...currentBadges, id] });
        }
    };

    return (
        <div className="space-y-6 py-4">
            {/* Stats Section */}
            <section className="space-y-4 border-b border-zinc-800 pb-6">
                <h3 className="font-bold text-lg text-primary flex items-center gap-2"><Activity className="w-5 h-5" /> Physiology Override</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                        <Label>Paused Bench</Label>
                        <Input type="number" value={localUser.stats.pausedBench || 0} onChange={e => handleStatChange('pausedBench', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Squat</Label>
                        <Input type="number" value={localUser.stats.squat || 0} onChange={e => handleStatChange('squat', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Low Pin</Label>
                        <Input type="number" value={localUser.stats.lowPinPress || 0} onChange={e => handleStatChange('lowPinPress', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Spoto</Label>
                        <Input type="number" value={localUser.stats.spotoPress || 0} onChange={e => handleStatChange('spotoPress', e.target.value)} />
                    </div>
                </div>
            </section>

            {/* Program Section */}
            <section className="space-y-4 border-b border-zinc-800 pb-6">
                <h3 className="font-bold text-lg text-primary flex items-center gap-2"><Activity className="w-5 h-5" /> Program Manipulation</h3>
                <div className="flex gap-4">
                    <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-500/10" onClick={() => {
                        // Reset Logic
                        if (window.confirm("Reset entire program progress?")) {
                            setLocalUser({
                                ...localUser,
                                completedSessions: 0,
                                benchDominationStatus: null,
                                skeletonStatus: null,
                                pencilneckStatus: null,
                                gluteMeasurements: []
                            });
                        }
                    }}>Hard Reset Program</Button>

                    <Button variant="outline" className="border-yellow-500 text-yellow-500 hover:bg-yellow-500/10" onClick={() => {
                        // Force 12 weeks
                        setLocalUser({
                            ...localUser,
                            benchDominationStatus: {
                                ...localUser.benchDominationStatus,
                                completedWeeks: 12
                            }
                        });
                    }}>Skip To Week 13 (Peaking Choice)</Button>
                </div>
            </section>

            {/* Badges Section */}
            <section className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg text-primary flex items-center gap-2"><Trophy className="w-5 h-5" /> Badge Management</h3>
                    <div className="space-x-2">
                        <Button className="h-6 text-xs" variant="ghost" type="button" onClick={() => setLocalUser({ ...localUser, badges: BADGES.map(b => b.id) })}>Grant All</Button>
                        <Button className="h-6 text-xs" variant="ghost" type="button" onClick={() => setLocalUser({ ...localUser, badges: [] })}>Revoke All</Button>
                    </div>
                </div>
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                    {BADGES.map(badge => {
                        const hasBadge = localUser.badges?.includes(badge.id);
                        return (
                            <div
                                key={badge.id}
                                onClick={() => toggleBadge(badge.id)}
                                className={`cursor-pointer border rounded p-2 flex flex-col items-center justify-center text-center transition-all ${hasBadge ? 'bg-primary/20 border-primary' : 'bg-transparent border-zinc-800 opacity-50 hover:opacity-100'}`}
                            >
                                <span className="text-2xl mb-1">{badge.icon}</span>
                                <span className="text-[10px] leading-tight font-bold">{badge.name}</span>
                            </div>
                        )
                    })}
                </div>
            </section>

            <div className="pt-4 sticky bottom-0 bg-zinc-900 border-t border-zinc-800">
                <Button className="w-full" size="lg" onClick={() => onSave(localUser)}>
                    <Save className="w-4 h-4 mr-2" /> SAVE CHANGES
                </Button>
            </div>
        </div>
    )
}
