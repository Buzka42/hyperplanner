
import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, getDoc, setDoc, onSnapshot, updateDoc, collection, getDocs } from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';
import { db, auth } from '../firebase';
import { getPlan } from '../data/plans';
import type { UserProfile, LiftingStats, PlanConfig, BadgeId, WorkoutLog } from '../types';

interface UserContextType {
    user: UserProfile | null;
    activePlanConfig: PlanConfig;
    loading: boolean;
    checkCodeword: (codeword: string) => Promise<'exists' | 'not-found' | 'admin'>;
    registerUser: (codeword: string, stats: LiftingStats, programId?: string, selectedDays?: number[], exercisePreferences?: Record<string, string>, benchDominationModules?: any) => Promise<void>;
    logout: () => void;
    isAdmin: boolean;
    updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
    switchProgram: (newProgramId: string) => Promise<void>;
    resetProgram: () => Promise<void>;
    checkBadges: () => Promise<void>;
    notification: { type: 'badge'; badgeId: BadgeId } | null;
    clearNotification: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [listeningId, setListeningId] = useState<string | null>(() => localStorage.getItem('bench-domination-id'));
    const [authReady, setAuthReady] = useState(false);
    const [notification, setNotification] = useState<{ type: 'badge'; badgeId: BadgeId } | null>(null);

    const activePlanConfig = React.useMemo(() => {
        const plan = getPlan(user?.programId);

        if (user?.selectedDays && user.selectedDays.length > 0) {
            // Remap training days to selected days
            const userDays = [...user.selectedDays].sort((a, b) => a - b);
            const newWeeks = plan.program.weeks.map(week => {
                const originalTrainingDays = week.days.filter(d => d.exercises && d.exercises.length > 0);
                const newDays = [];
                let trainIdx = 0;

                for (let d = 1; d <= 7; d++) {
                    if (userDays.includes(d)) {
                        if (trainIdx < originalTrainingDays.length) {
                            newDays.push({
                                ...originalTrainingDays[trainIdx],
                                dayOfWeek: d
                            });
                            trainIdx++;
                        } else {
                            newDays.push({ dayName: 'Rest', dayOfWeek: d, exercises: [] });
                        }
                    } else {
                        newDays.push({ dayName: 'Rest', dayOfWeek: d, exercises: [] });
                    }
                }
                return { ...week, days: newDays };
            });
            return {
                ...plan,
                program: {
                    ...plan.program,
                    weeks: newWeeks
                }
            };
        }

        return plan;
    }, [user?.programId, user?.selectedDays]);

    // 1. Initialize Auth
    useEffect(() => {
        const initAuth = async () => {
            try {
                await signInAnonymously(auth);
                setAuthReady(true);
            } catch (error) {
                console.error("Auth init failed", error);
                setLoading(false);
            }
        };
        initAuth();
    }, []);

    // 2. Setup Real-time Listener
    useEffect(() => {
        if (!authReady) return;

        if (!listeningId) {
            setLoading(false);
            setUser(null);
            return;
        }

        if (listeningId === 'judziek') {
            setIsAdmin(true);
            setUser(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        const docRef = doc(db, 'users', listeningId);
        const unsubscribe = onSnapshot(docRef, (snap) => {
            if (snap.exists()) {
                const data = snap.data() as UserProfile;
                if (!data.programId) data.programId = 'bench-domination';
                setUser(data);
            } else {
                console.warn("User document not found for ID:", listeningId);
            }
            setLoading(false);
        }, (err) => {
            console.error("Snapshot error:", err);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [authReady, listeningId]);

    const checkCodeword = async (codeword: string): Promise<'exists' | 'not-found' | 'admin'> => {
        const trimmed = codeword.trim();
        const sanitized = trimmed.toLowerCase();

        if (sanitized === 'judziek') {
            setIsAdmin(true);
            setListeningId('judziek');
            localStorage.setItem('bench-domination-id', 'judziek');
            return 'admin';
        }

        if (!auth.currentUser) await signInAnonymously(auth);

        const docRef = doc(db, 'users', sanitized);
        const snap = await getDoc(docRef);

        if (snap.exists()) {
            setListeningId(sanitized);
            localStorage.setItem('bench-domination-id', sanitized);
            return 'exists';
        }

        if (trimmed !== sanitized) {
            const legacyRef = doc(db, 'users', trimmed);
            const legacySnap = await getDoc(legacyRef);

            if (legacySnap.exists()) {
                setListeningId(trimmed);
                localStorage.setItem('bench-domination-id', trimmed);
                return 'exists';
            }
        }

        return 'not-found';
    };

    const registerUser = async (
        codeword: string,
        stats: LiftingStats,
        programId: string = 'bench-domination',
        selectedDays?: number[],
        exercisePreferences?: Record<string, string>,
        benchDominationModules?: any
    ) => {
        const sanitized = codeword.trim().toLowerCase();
        const userRef = doc(db, 'users', sanitized);
        const snap = await getDoc(userRef);
        const existingData = snap.exists() ? snap.data() as UserProfile : null;

        const startDate = existingData?.startDate || new Date().toISOString();

        const newUser: UserProfile = {
            id: sanitized,
            codeword: sanitized,
            stats,
            startDate,
            programId,
            ...(selectedDays && { selectedDays }),
            ...(exercisePreferences && { exercisePreferences }),
            ...(benchDominationModules && { benchDominationModules }),
            completedSessions: 0,
            benchHistory: existingData?.benchHistory || [],
            programProgress: existingData?.programProgress || {
                [programId]: { completedSessions: 0, startDate: new Date().toISOString() }
            },
            ...(existingData?.benchDominationStatus && { benchDominationStatus: existingData.benchDominationStatus }),
            ...(existingData?.pencilneckStatus && { pencilneckStatus: existingData.pencilneckStatus }),
            ...(existingData?.skeletonStatus && { skeletonStatus: existingData.skeletonStatus })
        };

        const progress = newUser.programProgress || {};
        if (!progress[programId]) {
            progress[programId] = {
                completedSessions: 0,
                startDate: new Date().toISOString()
            };
        }
        newUser.programProgress = progress;

        await setDoc(userRef, newUser, { merge: true });

        setListeningId(sanitized);
        localStorage.setItem('bench-domination-id', sanitized);
    };

    const updateUserProfile = async (updates: Partial<UserProfile>) => {
        if (!user) return;
        await updateDoc(doc(db, 'users', user.id), updates);
    };

    const switchProgram = async (newProgramId: string) => {
        if (!user) return;
        const currentId = user.programId;
        const updatedProgress = { ...(user.programProgress || {}) };

        updatedProgress[currentId] = {
            completedSessions: user.completedSessions,
            startDate: user.startDate
        };
        const targetProgress = updatedProgress[newProgramId] || { completedSessions: 0, startDate: new Date().toISOString() };

        await updateDoc(doc(db, 'users', user.id), {
            programId: newProgramId,
            programProgress: updatedProgress,
            completedSessions: targetProgress.completedSessions,
            startDate: targetProgress.startDate
        });
    };

    const resetProgram = async () => {
        if (!user) return;
        const currentId = user.programId;
        const updatedProgress = { ...(user.programProgress || {}) };
        updatedProgress[currentId] = {
            completedSessions: 0,
            startDate: new Date().toISOString()
        };

        const statusUpdates: any = {};
        if (currentId === 'bench-domination') statusUpdates.benchDominationStatus = null;
        if (currentId === 'pencilneck-eradication') statusUpdates.pencilneckStatus = null;
        if (currentId === 'skeleton-to-threat') statusUpdates.skeletonStatus = null;

        await updateDoc(doc(db, 'users', user.id), {
            completedSessions: 0,
            startDate: new Date().toISOString(),
            programProgress: updatedProgress,
            ...statusUpdates
        });
    };

    const logout = () => {
        setUser(null);
        setIsAdmin(false);
        setListeningId(null);
        localStorage.removeItem('bench-domination-id');
    };

    const checkBadges = async () => {
        if (!user) return;

        const currentBadges = new Set(user.badges || []);
        const newBadges: BadgeId[] = [];

        // Basic Checks
        if (user.skeletonStatus?.completed && !currentBadges.has('certified_threat')) newBadges.push('certified_threat');
        if (user.pencilneckStatus?.completed && !currentBadges.has('certified_boulder')) newBadges.push('certified_boulder');
        if (user.completedSessions > 0 && !currentBadges.has('first_blood')) newBadges.push('first_blood');
        if (user.completedSessions >= 100 && !currentBadges.has('100_sessions')) newBadges.push('100_sessions');

        if (user.benchHistory && user.benchHistory.length >= 2) {
            const weights = user.benchHistory.map(h => h.actualWeight || h.weight);
            const minW = Math.min(...weights);
            const maxW = Math.max(...weights);
            const gain = maxW - minW;
            if (gain >= 22.5 && !currentBadges.has('bench_jump_50')) newBadges.push('bench_jump_50');
            if (gain >= 45 && !currentBadges.has('bench_jump_100')) newBadges.push('bench_jump_100');
        }

        const hasBench = user.benchDominationStatus && (user.benchDominationStatus.completedWeeks ?? 0) >= 12;
        const hasPencil = user.pencilneckStatus?.completed;
        const hasSkeleton = user.skeletonStatus?.completed;
        const hasPeachy = (user.programProgress?.['peachy-glute-plan']?.completedSessions || 0) >= 48;

        if (hasBench && hasPencil && hasSkeleton && hasPeachy && !currentBadges.has('immortal')) newBadges.push('immortal');
        if (hasPeachy && !currentBadges.has('peachy_perfection')) newBadges.push('peachy_perfection');

        // Glute Gainz Check
        if (user.gluteMeasurements && user.gluteMeasurements.length >= 2) {
            const first = user.gluteMeasurements[0].sizeCm;
            const last = user.gluteMeasurements[user.gluteMeasurements.length - 1].sizeCm;
            if ((last - first) >= 5 && !currentBadges.has('glute_gainz_queen')) {
                newBadges.push('glute_gainz_queen');
            }
        }

        try {
            const logsRef = collection(db, 'users', user.id, 'workouts');
            const logsSnap = await getDocs(logsRef);
            const logs = logsSnap.docs.map(d => d.data() as WorkoutLog);

            // Check Squat Growth
            const squatLogs = logs.filter(l => l.exercises?.some(e => e.name.toLowerCase().includes('squat') && e.name !== "Hack Squat Calf Raises"));
            if (squatLogs.length > 0) {
                squatLogs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

                const getMaxSquat = (log: WorkoutLog) => {
                    const sqEx = log.exercises?.find(e => e.name.toLowerCase().includes('squat'));
                    if (!sqEx) return 0;
                    return Math.max(...sqEx.setsData.map(s => parseFloat(s.weight) || 0));
                };

                const firstSquat = getMaxSquat(squatLogs[0]);
                const lastSquat = getMaxSquat(squatLogs[squatLogs.length - 1]);

                if ((lastSquat - firstSquat) >= 30 && !currentBadges.has('squat_30kg')) newBadges.push('squat_30kg');
            }

            // Check Kas Glute Bridge 100kg
            if (!currentBadges.has('kas_glute_bridge_100')) {
                const heavyBridge = logs.some(l => l.exercises?.some(e =>
                    e.name === "Kas Glute Bridge" &&
                    e.setsData.some(s => parseFloat(s.weight) >= 100 && s.completed)
                ));
                if (heavyBridge) newBadges.push('kas_glute_bridge_100');
            }

            // Cannonball Delts (Military Press >= 60kg)
            if (!currentBadges.has('cannonball_delts')) {
                const heavyPress = logs.some(l => l.exercises?.some(e =>
                    e.name === "Standing Military Press" &&
                    e.setsData.some(s => parseFloat(s.weight) >= 60 && s.completed)
                ));
                if (heavyPress) newBadges.push('cannonball_delts');
            }

        } catch (e) {
            console.error("Failed to check logs for badges", e);
        }

        if (newBadges.length > 0) {
            const updatedBadges = [...(user.badges || []), ...newBadges];
            await updateDoc(doc(db, 'users', user.id), { badges: updatedBadges });

            // Only notify if NOT program completion badges (which have their own modals)
            const badgesToNotify = newBadges.filter(b => b !== 'certified_boulder' && b !== 'certified_threat');
            if (badgesToNotify.length > 0) {
                setNotification({ type: 'badge', badgeId: badgesToNotify[0] });
            }
        }
    };

    const clearNotification = () => setNotification(null);

    useEffect(() => {
        if (user && !loading) {
            checkBadges();
        }
    }, [user?.completedSessions, user?.id]);

    return (
        <UserContext.Provider value={{
            user,
            activePlanConfig,
            loading,
            checkCodeword,
            registerUser,
            logout,
            isAdmin,
            updateUserProfile,
            switchProgram,
            resetProgram,
            checkBadges,
            notification,
            clearNotification
        }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error('useUser must be used within UserProvider');
    return context;
};
