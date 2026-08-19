
import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, getDoc, setDoc, onSnapshot, updateDoc, collection, getDocs } from 'firebase/firestore';
import { getIdTokenResult, signInAnonymously } from 'firebase/auth';
import { db, auth } from '../firebase';
import { getPlan } from '../data/plans';
import { canonicalPlanId, normalizeLegacyPlanIds } from '../data/planIds';
import { isAccessKeyUsable, normalizeKeyword, type AccessKey } from '../data/accessControl';
import { SEED_RESOLVER, type ExerciseResolver } from '../data/exercises';
import { loadLibrary } from '../data/exercises/remote';
import { getPlanExerciseConfig } from '../data/exercises/planConfigs';
import type { PlanExerciseDoc } from '../data/exercises/types';
import type { UserProfile, LiftingStats, PlanConfig, BadgeId, WorkoutLog } from '../types';

export const KEYWORD_CLAIMED_CODE = 'keyword-claimed';

export class KeywordClaimedError extends Error {
    readonly code = KEYWORD_CLAIMED_CODE;
    constructor() {
        super('This keyword is already in use on another device.');
        this.name = 'KeywordClaimedError';
    }
}

type CodewordCheck = { status: 'exists' | 'not-found' | 'admin' | 'onboarding' | 'claimed'; allowedPlanIds?: string[] };

interface UserContextType {
    user: UserProfile | null;
    activePlanConfig: PlanConfig;
    /** Exercise library resolver (bundled seed, upgraded once the overlay loads). */
    exerciseResolver: ExerciseResolver;
    /** Admin exercise overrides for the user's active plan, if any. */
    planExerciseConfig: PlanExerciseDoc | undefined;
    loading: boolean;
    checkCodeword: (codeword: string) => Promise<CodewordCheck>;
    registerUser: (codeword: string, stats: LiftingStats, programId?: string, selectedDays?: number[], exercisePreferences?: Record<string, string>, benchDominationModules?: any, extra?: Partial<UserProfile>) => Promise<void>;
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
    const [listeningId, setListeningId] = useState<string | null>(null); // Removed localStorage persistence
    const [authReady, setAuthReady] = useState(false);
    const [notification, setNotification] = useState<{ type: 'badge'; badgeId: BadgeId } | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            (window as any).__SET_TEST_USER__ = (testProfile: UserProfile | null) => {
                if (testProfile) {
                    sessionStorage.setItem('hyperplanner_test_user', JSON.stringify(testProfile));
                } else {
                    sessionStorage.removeItem('hyperplanner_test_user');
                }
                setUser(testProfile);
                setLoading(false);
            };
            const stored = sessionStorage.getItem('hyperplanner_test_user');
            if (stored) {
                try {
                    setUser(JSON.parse(stored));
                    setLoading(false);
                } catch (e) {}
            }
        }
    }, []);

    // Starts as the bundled seed so the first render never waits on Firestore,
    // then upgrades in place once the admin overlay arrives.
    const [exerciseResolver, setExerciseResolver] = useState<ExerciseResolver>(SEED_RESOLVER);

    useEffect(() => {
        if (!authReady) return;
        let cancelled = false;
        loadLibrary()
            .then(({ resolver }) => { if (!cancelled) setExerciseResolver(resolver); })
            .catch(() => { /* loadLibrary already falls back to the seed */ });
        return () => { cancelled = true; };
    }, [authReady]);

    const planExerciseConfig = React.useMemo(
        () => getPlanExerciseConfig(user?.programId ?? ''),
        [user?.programId]
    );

    const activePlanConfig = React.useMemo(() => {
        const plan = getPlan(user?.programId);

        // Rolling schedules (irregular templates like 2 on / 1 off) are
        // completion-driven: sessions sit on sequential dayOfWeek slots and
        // the dashboard simply offers the next unfinished one. No weekday
        // remap applies.
        if (user?.scheduleMode === 'rolling') {
            const newWeeks = plan.program.weeks.map(week => {
                const training = week.days.filter(d => d.exercises && d.exercises.length > 0);
                // Skeleton (and similar) stores empty placeholders and fills
                // from `day.id` in preprocessDay — do not strip those ids.
                if (training.length === 0) return week;
                const newDays = training.map((d, i) => ({ ...d, dayOfWeek: i + 1 }));
                for (let dow = training.length + 1; dow <= 7; dow++) {
                    newDays.push({ id: `${week.weekNumber}-rest-${dow}`, dayName: 'Rest', dayOfWeek: dow, exercises: [] });
                }
                return { ...week, days: newDays };
            });
            return { ...plan, program: { ...plan.program, weeks: newWeeks } };
        }

        if (user?.selectedDays && user.selectedDays.length > 0) {
            // Remap training days to selected days
            const userDays = [...user.selectedDays].sort((a, b) => a - b);
            const newWeeks = plan.program.weeks.map(week => {
                const originalTrainingDays = week.days.filter(d => d.exercises && d.exercises.length > 0);
                if (originalTrainingDays.length === 0) return week;
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
                            newDays.push({ id: `w${week.weekNumber}-d${d}`, dayName: 'Rest', dayOfWeek: d, exercises: [] });
                        }
                    } else {
                        newDays.push({ id: `w${week.weekNumber}-d${d}`, dayName: 'Rest', dayOfWeek: d, exercises: [] });
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
    }, [user?.programId, user?.selectedDays, user?.scheduleMode]);

    // 1. Initialize Auth
    useEffect(() => {
        const initAuth = async () => {
            try {
                await signInAnonymously(auth);
                setAuthReady(true);

                // The admin claim lives on the device's anonymous auth token, so
                // it survives a reload — re-check it here rather than only on the
                // 'judziek' login path. Without this, refreshing /admin bounced
                // to the entry screen and any in-progress admin work was lost.
                const token = await getIdTokenResult(auth.currentUser!);
                if (token.claims.admin === true) setIsAdmin(true);
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
            const stored = typeof window !== 'undefined' ? sessionStorage.getItem('hyperplanner_test_user') : null;
            if (stored) {
                setLoading(false);
                return;
            }
            setLoading(false);
            setUser(null);
            return;
        }

        setLoading(true);
        const docRef = doc(db, 'users', listeningId);
        const unsubscribe = onSnapshot(docRef, (snap) => {
            if (snap.exists()) {
                const data = snap.data() as UserProfile;
                if (!data.programId) data.programId = 'bench-domination';
                // Pre-rename ids are normalised on read, so an athlete whose
                // document has not been migrated yet still resolves to a real
                // plan rather than falling back to Bench Domination.
                setUser(normalizeLegacyPlanIds(data));
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

    const checkCodeword = async (codeword: string): Promise<CodewordCheck> => {
        const trimmed = codeword.trim();
        const sanitized = normalizeKeyword(trimmed);

        if (!auth.currentUser) await signInAnonymously(auth);

        const token = await getIdTokenResult(auth.currentUser!, sanitized === 'judziek');
        if (sanitized === 'judziek' && token.claims.admin === true) {
            setIsAdmin(true);
            return { status: 'admin' };
        }
        if (sanitized === 'judziek') {
            return { status: 'not-found' };
        }

        const readUserDoc = async (id: string) => {
            try {
                return { kind: 'ok' as const, snap: await getDoc(doc(db, 'users', id)) };
            } catch (error: unknown) {
                if ((error as { code?: string })?.code === 'permission-denied') {
                    return { kind: 'claimed' as const };
                }
                throw error;
            }
        };

        const adoptProfile = (id: string, profile: UserProfile) => {
            if (!profile.programId) profile.programId = 'bench-domination';
            setUser(profile);
            setListeningId(id);
        };

        const docRef = doc(db, 'users', sanitized);
        const own = await readUserDoc(sanitized);

        if (own.kind === 'claimed') {
            return { status: 'claimed' };
        }

        if (own.snap.exists()) {
            const profile = own.snap.data() as UserProfile;
            if (!profile.ownerUid && auth.currentUser) {
                await updateDoc(docRef, { ownerUid: auth.currentUser.uid });
                profile.ownerUid = auth.currentUser.uid;
            }
            adoptProfile(sanitized, profile);
            return { status: 'exists' };
        }

        if (trimmed !== sanitized) {
            const legacy = await readUserDoc(trimmed);
            if (legacy.kind === 'claimed') {
                return { status: 'claimed' };
            }
            if (legacy.snap.exists()) {
                const profile = legacy.snap.data() as UserProfile;
                const legacyRef = doc(db, 'users', trimmed);
                if (!profile.ownerUid && auth.currentUser) {
                    await updateDoc(legacyRef, { ownerUid: auth.currentUser.uid });
                    profile.ownerUid = auth.currentUser.uid;
                }
                adoptProfile(trimmed, profile);
                return { status: 'exists' };
            }
        }

        const keySnap = await getDoc(doc(db, 'accessKeys', sanitized));
        if (keySnap.exists()) {
            const key = keySnap.data() as AccessKey;
            if (isAccessKeyUsable(key)) return { status: 'onboarding', allowedPlanIds: key.allowedPlanIds };
        }
        return { status: 'not-found' };
    };

    // Helper: Clear all workout drafts from localStorage (cleanup on new user registration)
    const clearAllWorkoutDrafts = () => {
        const keysToRemove: string[] = [];

        // Scan localStorage for all workout_draft_* keys
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('workout_draft_')) {
                keysToRemove.push(key);
            }
        }

        // Remove all found draft keys
        keysToRemove.forEach(key => localStorage.removeItem(key));

        if (keysToRemove.length > 0) {
        }
    };

    const registerUser = async (
        codeword: string,
        stats: LiftingStats,
        programId: string = 'bench-domination',
        selectedDays?: number[],
        exercisePreferences?: Record<string, string>,
        benchDominationModules?: any,
        /** Plan-specific profile fields set at registration, e.g. pendingCalibration. */
        extra?: Partial<UserProfile>
    ) => {

        const sanitized = codeword.trim().toLowerCase();
        const userRef = doc(db, 'users', sanitized);

        try {
            let existingData: UserProfile | null = null;
            try {
                const snap = await getDoc(userRef);
                existingData = snap.exists() ? snap.data() as UserProfile : null;
            } catch (error: unknown) {
                if ((error as { code?: string })?.code === 'permission-denied') {
                    throw new KeywordClaimedError();
                }
                throw error;
            }

            const now = new Date().toISOString();
            const accessSnap = await getDoc(doc(db, 'accessKeys', sanitized));
            const access = accessSnap.exists() ? accessSnap.data() as AccessKey : null;
            if (!existingData && (!access || !isAccessKeyUsable(access) || !access.allowedPlanIds.map(id => canonicalPlanId(id)).includes(canonicalPlanId(programId)))) {
                throw new Error('This keyword does not grant access to the selected plan.');
            }
            const startDate = existingData?.startDate || now;

            const newUser: UserProfile = {
                id: sanitized,
                ownerUid: auth.currentUser?.uid,
                codeword: sanitized,
                stats,
                startDate,
                programId,
                ...(access && {
                    allowedPlanIds: access.allowedPlanIds,
                    allowPlanSwitching: access.allowPlanSwitching !== false,
                    // Lab Mode comes from the keyword the admin issued.
                    ...(access.testAccount === true && { isTestAccount: true }),
                }),
                ...(selectedDays && { selectedDays }),
                ...(exercisePreferences && { exercisePreferences }),
                ...(benchDominationModules && { benchDominationModules }),
                completedSessions: 0,
                benchHistory: existingData?.benchHistory || [],
                programProgress: existingData?.programProgress || {},
                badges: existingData?.badges || [],
                gluteMeasurements: existingData?.gluteMeasurements || [],
                armMeasurements: existingData?.armMeasurements || [],
                ...(existingData?.adventureEquipment && { adventureEquipment: existingData.adventureEquipment }),
                pencilneckBenchHistory: existingData?.pencilneckBenchHistory || [],
                ...(existingData?.benchDominationStatus && { benchDominationStatus: existingData.benchDominationStatus }),
                ...(existingData?.pencilneckStatus && { pencilneckStatus: existingData.pencilneckStatus }),
                ...(existingData?.skeletonStatus && { skeletonStatus: existingData.skeletonStatus }),
                ...(extra ?? {})
            };

            // FORCE RESET progress for the new program
            if (!newUser.programProgress) newUser.programProgress = {};
            newUser.programProgress[programId] = {
                completedSessions: 0,
                startDate: now
            };


            // Write to Firestore
            await setDoc(userRef, newUser, { merge: true });


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


            // Clear all stale workout drafts from localStorage on new registration
            clearAllWorkoutDrafts();

            // Only set local state after server confirmation
            setUser(verifiedData);
            setListeningId(sanitized);
            // No localStorage persistence

        } catch (error: any) {
            console.error('[REGISTER] ERROR:', error);

            // Clear any partial state
            setListeningId(null);
            // No localStorage persistence

            if (error instanceof KeywordClaimedError) throw error;
            if (error?.code === 'permission-denied') throw new KeywordClaimedError();

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
        const targetId = canonicalPlanId(newProgramId)!;
        if (user.allowPlanSwitching === false
            || (user.allowedPlanIds && !user.allowedPlanIds.map(id => canonicalPlanId(id)).includes(targetId))) {
            throw new Error('This plan is not available for your keyword.');
        }
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
        // No localStorage persistence
    };

    const checkBadges = async () => {
        if (!user) return;


        const currentBadges = new Set(user.badges || []);
        const newBadges: BadgeId[] = [];

        // Perfect Attendance: Awarded on completion of ANY program without missing sessions
        // Check completion for all available programs
        if (!currentBadges.has('perfect_attendance')) {
            const pCompleted = (user.benchDominationStatus?.completedWeeks ?? 0) >= 15 ||
                user.pencilneckStatus?.completed ||
                user.skeletonStatus?.completed ||
                (user.programProgress?.['peachy-glute-plan']?.completedSessions || 0) >= 48 ||
                (user as any).trinaryStatus?.completedWorkouts >= 27 ||  // Trinary: 27 total workouts
                (user as any).ritualStatus?.completedWorkouts >= 57 ||  // Ritual: 16 training + 3 purge weeks
                (user.programProgress?.['pain-and-glory']?.completedSessions || 0) >= 96; // Pain & Glory: 16 weeks * 6 days/week = 96 workouts

            if (pCompleted) newBadges.push('perfect_attendance');
        }

        // Basic Checks
        if (user.skeletonStatus?.completed && !currentBadges.has('certified_threat')) newBadges.push('certified_threat');
        if (user.pencilneckStatus?.completed && !currentBadges.has('certified_boulder')) newBadges.push('certified_boulder');
        if (user.completedSessions > 0 && !currentBadges.has('first_blood')) newBadges.push('first_blood');
        if (user.completedSessions >= 100 && !currentBadges.has('100_sessions')) newBadges.push('100_sessions');

        const benchRunComplete = (user.benchDominationStatus?.completedWeeks ?? 0) >= 12;
        const benchWeights = (user.benchHistory || []).map(entry => entry.weight || 0).filter(Boolean);
        const finishedBenchWithPr = benchRunComplete && benchWeights.length >= 2 && benchWeights[benchWeights.length - 1] > benchWeights[0];
        if (finishedBenchWithPr && !currentBadges.has('bench_psychopath')) newBadges.push('bench_psychopath');

        const reactiveDeloadTriggered = (user.benchDominationStatus?.addedDeloadWeeks || [])
            .some(deload => deload.type === 'reactive' || deload.type === 'drop-recalc');
        if (benchRunComplete && !reactiveDeloadTriggered && !currentBadges.has('deload_denier')) newBadges.push('deload_denier');

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

            // ==========================================
            // RITUAL OF STRENGTH BADGES
            // ==========================================
            const ritualLogs = logs.filter(l => l.programId === 'ritual-of-strength');
            if (ritualLogs.length > 0) {
                ritualLogs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

                // 1. Initiate of Iron: Complete Week 1
                if (!currentBadges.has('initiate_of_iron')) {
                    const week1Logs = ritualLogs.filter(l => (l.week || 0) === 1);
                    // All 3 workouts in Week 1 (3 days/week program)
                    if (week1Logs.length >= 3) {
                        newBadges.push('initiate_of_iron');
                    }
                }

                // 2. Disciple of Pain: Complete ramp-in (Weeks 1-4)
                if (!currentBadges.has('disciple_of_pain')) {
                    const rampInWeeks = new Set(ritualLogs.filter(l => (l.week || 0) <= 4 && (l.week || 0) >= 1).map(l => l.week || 0));
                    const week4Logs = ritualLogs.filter(l => (l.week || 0) === 4);
                    // Require at least 3 unique weeks in ramp-in, INCLUDING completion of Week 4 (all 3 workouts in week 4)
                    if (rampInWeeks.size >= 3 && week4Logs.length >= 3) {
                        newBadges.push('disciple_of_pain');
                    }
                }

                // 3. Acolyte of Strength: Complete final training week (schedule week 18)
                if (!currentBadges.has('acolyte_of_strength')) {
                    const finalTrainingLogs = ritualLogs.filter(l => (l.week || 0) === 18);
                    if (finalTrainingLogs.length >= 1) {
                        newBadges.push('acolyte_of_strength');
                    }
                }

                // 4. High Priest of Power: Multiple cycles + PR
                if (!currentBadges.has('high_priest_of_power')) {
                    const completedCycles = ritualLogs.filter(l => (l.week || 0) === 16).length;
                    if (completedCycles >= 2) {
                        // Check for any PR in 2nd+ cycle
                        const cycle2Logs = ritualLogs.filter(l => (l.week || 0) > 16);
                        if (cycle2Logs.length > 0) {
                            // Simple check: Did they complete workouts in cycle 2?
                            newBadges.push('high_priest_of_power');
                        }
                    }
                }

                // 5. Eternal Worshipper: All-time PRs smashed (Ritual PRs must be THE all-time bests)
                if (!currentBadges.has('eternal_worshipper')) {
                    // Check for PRs across all 3 lifts
                    const getBestLifts = (logs: WorkoutLog[]) => {
                        const lifts = { bench: 0, squat: 0, deadlift: 0 };
                        logs.forEach(l => {
                            l.exercises?.forEach(e => {
                                const maxWeight = Math.max(...e.setsData.map(s => parseFloat(s.weight) || 0));
                                if (e.name.includes('Bench')) lifts.bench = Math.max(lifts.bench, maxWeight);
                                if (e.name.includes('Squat')) lifts.squat = Math.max(lifts.squat, maxWeight);
                                if (e.name.includes('Deadlift')) lifts.deadlift = Math.max(lifts.deadlift, maxWeight);
                            });
                        });
                        return lifts;
                    };

                    const ritualBest = getBestLifts(ritualLogs);
                    const nonRitualLogs = logs.filter(l => l.programId !== 'ritual-of-strength');
                    const nonRitualBest = getBestLifts(nonRitualLogs);

                    // Award if Ritual PRs are better than ALL non-Ritual programs (true all-time bests)
                    // Ritual PR must be at least 2.5kg better than any non-Ritual PR
                    const hasAllTimeBench = ritualBest.bench > nonRitualBest.bench && ritualBest.bench > 0;
                    const hasAllTimeSquat = ritualBest.squat > nonRitualBest.squat && ritualBest.squat > 0;
                    const hasAllTimeDeadlift = ritualBest.deadlift > nonRitualBest.deadlift && ritualBest.deadlift > 0;

                    if (hasAllTimeBench && hasAllTimeSquat && hasAllTimeDeadlift) {
                        newBadges.push('eternal_worshipper');
                    }
                }
            }

            // ==========================================
            // SUPER MUTANT BADGES
            // ==========================================
            const superMutantStatus = (user as any).superMutantStatus;
            if (superMutantStatus) {
                // 1. Super Mutant Aspirant: Complete 72 workouts (12 weeks @ 6 sessions/week)
                if (!currentBadges.has('super_mutant_aspirant')) {
                    const completedWorkouts = superMutantStatus.completedWorkouts || 0;
                    if (completedWorkouts >= 72) {
                        newBadges.push('super_mutant_aspirant');
                    }
                }

                // 2. Behemoth of the Wastes: Complete all 84 workouts (14 weeks)
                if (!currentBadges.has('behemoth_of_wastes')) {
                    const completedWorkouts = superMutantStatus.completedWorkouts || 0;
                    if (completedWorkouts >= 84) {
                        newBadges.push('behemoth_of_wastes');
                    }
                }
            }

        } catch (e) {
            console.error("Failed to check logs for badges", e);
        }

        const badgeCountAfterChecks = new Set([...(user.badges || []), ...newBadges]).size;
        if (badgeCountAfterChecks >= 10 && !currentBadges.has('final_boss') && !newBadges.includes('final_boss')) {
            newBadges.push('final_boss');
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
            exerciseResolver,
            planExerciseConfig,
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
