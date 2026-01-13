
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
        console.log('[REGISTER] Starting registration for:', codeword, 'program:', programId);

        const sanitized = codeword.trim().toLowerCase();
        const userRef = doc(db, 'users', sanitized);

        try {
            console.log('[REGISTER] Fetching existing user data...');
            const snap = await getDoc(userRef);
            const existingData = snap.exists() ? snap.data() as UserProfile : null;
            console.log('[REGISTER] Existing data:', existingData ? 'Found' : 'New user');

            const now = new Date().toISOString();
            const startDate = existingData?.startDate || now;

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
                programProgress: existingData?.programProgress || {},
                badges: existingData?.badges || [],
                gluteMeasurements: existingData?.gluteMeasurements || [],
                pencilneckBenchHistory: existingData?.pencilneckBenchHistory || [],
                ...(existingData?.benchDominationStatus && { benchDominationStatus: existingData.benchDominationStatus }),
                ...(existingData?.pencilneckStatus && { pencilneckStatus: existingData.pencilneckStatus }),
                ...(existingData?.skeletonStatus && { skeletonStatus: existingData.skeletonStatus })
            };

            // FORCE RESET progress for the new program
            if (!newUser.programProgress) newUser.programProgress = {};
            newUser.programProgress[programId] = {
                completedSessions: 0,
                startDate: now
            };

            console.log('[REGISTER] Writing to Firestore...', { id: sanitized, programId });

            // Write to Firestore
            await setDoc(userRef, newUser, { merge: true });

            console.log('[REGISTER] Write complete. Verifying server-side...');

            // CRITICAL: Force a server read to verify the write succeeded
            // This prevents Opera GX from running in offline mode
            const verifySnap = await getDoc(userRef);

            if (!verifySnap.exists()) {
                console.error('[REGISTER] VERIFICATION FAILED: Document does not exist after write!');
                throw new Error('Failed to create user in database. Please check your internet connection and try again.');
            }

            const verifiedData = verifySnap.data() as UserProfile;
            if (verifiedData.programId !== programId) {
                console.error('[REGISTER] VERIFICATION FAILED: Program ID mismatch!', {
                    expected: programId,
                    actual: verifiedData.programId
                });
                throw new Error('Database verification failed. Please try again.');
            }

            console.log('[REGISTER] ✓ Verification successful. User created in Firestore.');

            // Only set local state after server confirmation
            setListeningId(sanitized);
            localStorage.setItem('bench-domination-id', sanitized);

            console.log('[REGISTER] ✓ Registration complete');
        } catch (error: any) {
            console.error('[REGISTER] ERROR:', error);

            // Clear any partial state
            setListeningId(null);
            localStorage.removeItem('bench-domination-id');

            // Re-throw with user-friendly message
            if (error.code === 'unavailable' || error.message?.includes('network')) {
                throw new Error('Network error: Unable to connect to the server. Please check your internet connection and try again.');
            }

            throw error;
        }
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

        // Perfect Attendance: Awarded on completion of ANY program
        if (!currentBadges.has('perfect_attendance')) {
            const pCompleted = (user.benchDominationStatus?.completedWeeks ?? 0) >= 15 ||
                user.pencilneckStatus?.completed ||
                user.skeletonStatus?.completed ||
                (user.programProgress?.['peachy-glute-plan']?.completedSessions || 0) >= 48;

            if (pCompleted) newBadges.push('perfect_attendance');
        }

        // Basic Checks
        if (user.skeletonStatus?.completed && !currentBadges.has('certified_threat')) newBadges.push('certified_threat');
        if (user.pencilneckStatus?.completed && !currentBadges.has('certified_boulder')) newBadges.push('certified_boulder');
        if (user.completedSessions > 0 && !currentBadges.has('first_blood')) newBadges.push('first_blood');
        if (user.completedSessions >= 100 && !currentBadges.has('100_sessions')) newBadges.push('100_sessions');

        // Check Bench Gains (Domination OR Pencilneck)
        const benchSamples: number[] = [];
        if (user.benchHistory && user.benchHistory.length >= 2) {
            benchSamples.push(...user.benchHistory.map(h => h.weight || 0));
        }
        if (user.pencilneckBenchHistory && user.pencilneckBenchHistory.length >= 2) {
            // Merge or separate? User intent implies gaining "in one run".
            // If they switch programs, it's arguably separate runs.
            // But if they just do Pencilneck, we check that history separately.
            // Let's calculate max gain found in EITHER history.
            const pnWeights = user.pencilneckBenchHistory.map(h => h.weight || 0);
            const minPn = Math.min(...pnWeights);
            const maxPn = Math.max(...pnWeights);
            if ((maxPn - minPn) >= 20 && !currentBadges.has('bench_jump_20kg')) newBadges.push('bench_jump_20kg');
            if ((maxPn - minPn) >= 30 && !currentBadges.has('bench_jump_30kg')) newBadges.push('bench_jump_30kg');
        }

        if (benchSamples.length >= 2) {
            const minW = Math.min(...benchSamples);
            const maxW = Math.max(...benchSamples);
            const gain = maxW - minW;
            if (gain >= 20 && !currentBadges.has('bench_jump_20kg')) {
                if (!newBadges.includes('bench_jump_20kg')) newBadges.push('bench_jump_20kg');
            }
            if (gain >= 30 && !currentBadges.has('bench_jump_30kg')) {
                if (!newBadges.includes('bench_jump_30kg')) newBadges.push('bench_jump_30kg');
            }
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
            if ((last - first) >= 3 && !currentBadges.has('glute_gainz_queen')) {
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
                    const sqEx = log.exercises?.find(e => e.name === "Squats" || e.name === "Paused Squat");
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

            // Check 3D Delts (Lying Laterals 3x20 @ >= 20kg)
            if (!currentBadges.has('3d_delts')) {
                const has3d = logs.some(l => l.exercises?.some(e => {
                    if (e.name !== "Lying Lateral Raises") return false;
                    const validSets = e.setsData.filter(s => s.completed && parseInt(s.reps) >= 20 && parseFloat(s.weight) >= 20);
                    return validSets.length >= 3;
                }));
                if (has3d) newBadges.push('3d_delts');
            }

            // Check Rear Delt Reaper (Rope Pulls 4x30+)
            if (!currentBadges.has('rear_delt_reaper')) {
                const hasReaper = logs.some(l => l.exercises?.some(e => {
                    if (e.name !== "Rear-Delt Rope Pulls to Face") return false;
                    const validSets = e.setsData.filter(s => s.completed && parseInt(s.reps) >= 30);
                    return validSets.length >= 4;
                }));
                if (hasReaper) newBadges.push('rear_delt_reaper');
            }

            // Cannonball Delts (Both of above) - Override existing logic if mismatched, or keep "AND" logic?
            // Badge desc: "Both Reaper and 3D Delts badges"
            // The existing code checked Military Press for incorrect reasons likely.
            // Let's rely on badge ownership.
            if ((currentBadges.has('3d_delts') || newBadges.includes('3d_delts')) &&
                (currentBadges.has('rear_delt_reaper') || newBadges.includes('rear_delt_reaper')) &&
                !currentBadges.has('cannonball_delts')) {
                newBadges.push('cannonball_delts');
            }

            // ==========================================
            // PAIN & GLORY BADGES
            // ==========================================
            const pgLogs = logs.filter(l => l.programId === 'pain-and-glory');
            if (pgLogs.length > 0) {
                pgLogs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

                // 1. Pain Embracer: Complete Weeks 1-8
                if (!currentBadges.has('void_gazer')) {
                    const weeksCompleted = new Set(pgLogs.filter(l => (l.week || 0) <= 8).map(l => l.week || 0));
                    // Check if at least 6 unique weeks recorded or max week >= 8
                    // "Complete weeks 1-8" implies 8 weeks of work.
                    // Let's require at least 6 unique weeks to account for skips, and max week >= 8.
                    if (weeksCompleted.size >= 6 && Math.max(...Array.from(weeksCompleted)) >= 8) {
                        newBadges.push('void_gazer');
                    }
                }

                // 2. EMOM Executioner: Complete 6x5 E2MOM (Weeks 9-12)
                if (!currentBadges.has('emom_executioner')) {
                    const emomSuccess = pgLogs.some(l => {
                        const w = l.week || 0;
                        if (w < 9 || w > 12) return false;
                        const dl = l.exercises?.find(e => e.name.includes("Conventional Deadlift"));
                        // Look for 6 sets of >= 5 reps
                        if (!dl) return false;
                        const validSets = dl.setsData.filter(s => s.completed && parseInt(s.reps) >= 5);
                        return validSets.length >= 6;
                    });
                    if (emomSuccess) newBadges.push('emom_executioner');
                }

                // 3. Deficit Demon: +30 kg on Deficit Snatch Grip (Weeks 1-8)
                if (!currentBadges.has('deficit_demon')) {
                    const deficitWeights = pgLogs
                        .filter(l => (l.week || 0) <= 8)
                        .map(l => {
                            const ex = l.exercises?.find(e => e.name.includes("Deficit Snatch Grip"));
                            if (!ex) return 0;
                            return Math.max(...ex.setsData.map(s => parseFloat(s.weight) || 0));
                        })
                        .filter(w => w > 0);

                    if (deficitWeights.length >= 2) {
                        const first = deficitWeights[0];
                        const last = deficitWeights[deficitWeights.length - 1];
                        if (last - first >= 30) newBadges.push('deficit_demon');
                    }
                }

                // 4. Glory Achieved: Finish 16 wks + New PR
                if (!currentBadges.has('glory_achieved')) {
                    const week16Logs = pgLogs.filter(l => (l.week || 0) === 16);
                    if (week16Logs.length > 0) {
                        // Find Week 16 Max
                        let maxWeek16 = 0;
                        week16Logs.forEach(l => {
                            const dl = l.exercises?.find(e => e.name.includes("Deadlift") && !e.name.includes("Romanian") && !e.name.includes("Stiff"));
                            if (dl) {
                                const w = Math.max(...dl.setsData.map(s => parseFloat(s.weight) || 0));
                                if (w > maxWeek16) maxWeek16 = w;
                            }
                        });

                        // Find Previous Max (Weeks 1-15)
                        let maxPrev = 0;
                        pgLogs.forEach(l => {
                            const w = l.week || 0;
                            if (w < 16) {
                                const dl = l.exercises?.find(e => e.name.includes("Deadlift") && !e.name.includes("Romanian") && !e.name.includes("Stiff"));
                                if (dl) {
                                    const val = Math.max(...dl.setsData.map(s => parseFloat(s.weight) || 0));
                                    if (val > maxPrev) maxPrev = val;
                                }
                            }
                        });


                        if (maxWeek16 > maxPrev && maxWeek16 > 0 && maxPrev > 0) {
                            newBadges.push('glory_achieved');
                        }
                    }
                }

                // 5. Single Supreme: Week 16 Single @ >= 97% e1RM
                if (!currentBadges.has('single_supreme')) {
                    const e1rm = user.painGloryStatus?.estimatedE1RM || 0;
                    if (e1rm > 0) {
                        const week16Logs = pgLogs.filter(l => (l.week || 0) === 16);
                        let hit = false;
                        week16Logs.forEach(l => {
                            const dl = l.exercises?.find(e => e.name.includes("Deadlift") && !e.name.includes("Romanian"));
                            if (dl) {
                                dl.setsData.forEach(s => {
                                    if (parseFloat(s.weight) >= (e1rm * 0.97)) hit = true;
                                });
                            }
                        });
                        if (hit) newBadges.push('single_supreme');
                    }
                }

                // 6. 50 Tonne Club
                if (!currentBadges.has('50_tonne_club')) {
                    let totalGlory = 0;
                    pgLogs.forEach(l => {
                        l.exercises?.forEach(e => {
                            if (e.name && (e.name.includes('Deadlift') || e.name.includes('deadlift'))) {
                                e.setsData.forEach(s => {
                                    const weight = parseFloat(s.weight || '0');
                                    const reps = parseInt(s.reps || '0');
                                    if (weight > 0 && reps > 0) {
                                        totalGlory += weight * reps;
                                    }
                                });
                            }
                        });
                    });
                    if (totalGlory >= 50000) newBadges.push('50_tonne_club');
                }
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
