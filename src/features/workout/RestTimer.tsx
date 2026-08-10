import React, { useEffect, useRef, useState } from 'react';
import { Pause, Play, Plus, X } from 'lucide-react';

import { formatRest } from './formatRest';

/**
 * Rest countdown for the set just logged.
 *
 * Timing is derived from a wall-clock deadline rather than by decrementing a
 * counter each tick: background tabs throttle timers heavily, so a decrementing
 * counter silently runs slow — the athlete would return to a timer claiming 40
 * seconds left when two minutes had passed.
 *
 * The deadline lives in a ref rather than state. It is a value the interval
 * reads, not something the UI renders, and keeping it out of state avoids
 * setting state synchronously from an effect on mount.
 *
 * Mounted keyed per rest period, so it always starts fresh.
 */
export const RestTimer: React.FC<{
    seconds: number;
    label?: string;
    autoStart?: boolean;
    onDismiss: () => void;
}> = ({ seconds, label, autoStart = true, onDismiss }) => {
    const [remaining, setRemaining] = useState(seconds);
    const [running, setRunning] = useState(autoStart);

    const deadlineRef = useRef<number | null>(null);
    const notifiedRef = useRef(false);

    useEffect(() => {
        if (!running) return;

        // Established here, on the first tick of a running timer, so the clock
        // is never read during render.
        if (deadlineRef.current === null) {
            deadlineRef.current = Date.now() + remaining * 1000;
        }

        const id = window.setInterval(() => {
            const deadline = deadlineRef.current;
            if (deadline === null) return;
            const left = Math.max(0, Math.round((deadline - Date.now()) / 1000));
            setRemaining(left);
            if (left === 0 && !notifiedRef.current) {
                notifiedRef.current = true;
                // A short vibration where supported; never audio, which would be
                // hostile in a gym with headphones in.
                navigator.vibrate?.([120, 60, 120]);
            }
        }, 250);

        // Re-sync the moment the tab is foregrounded rather than up to 250ms later.
        const onVisible = () => {
            const deadline = deadlineRef.current;
            if (document.hidden || deadline === null) return;
            setRemaining(Math.max(0, Math.round((deadline - Date.now()) / 1000)));
        };
        document.addEventListener('visibilitychange', onVisible);

        return () => {
            window.clearInterval(id);
            document.removeEventListener('visibilitychange', onVisible);
        };
    }, [running, remaining]);

    const toggle = () => {
        if (running) {
            deadlineRef.current = null;   // freeze at the current `remaining`
            setRunning(false);
        } else {
            deadlineRef.current = Date.now() + remaining * 1000;
            setRunning(true);
        }
    };

    /**
     * Extending is what an athlete actually reaches for mid-rest. It replaces
     * the restart control, which nobody uses at a rack and which cost a fourth
     * target in a bar where each one has to stay fat-finger-proof.
     */
    const extend = () => {
        notifiedRef.current = false;
        setRemaining(current => {
            const next = current + 30;
            if (running) deadlineRef.current = Date.now() + next * 1000;
            return next;
        });
    };

    const done = remaining === 0;
    const progress = seconds > 0 ? 1 - remaining / seconds : 1;

    return (
        <div className={done ? 'rest-timer is-done' : 'rest-timer'} role="timer" aria-live="off">
            <div className="rest-timer-bar" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />
            <div className="rest-timer-body">
                <div className="rest-timer-read">
                    <span className="rest-timer-value">{done ? '0:00' : formatRest(remaining)}</span>
                    {label && <span className="rest-timer-label">{label}</span>}
                </div>
                <div className="rest-timer-actions">
                    <button type="button" onClick={extend} aria-label="Add 30 seconds">
                        <Plus className="h-4 w-4" aria-hidden="true" /><span>30s</span>
                    </button>
                    <button type="button" onClick={toggle} aria-label={running ? 'Pause rest timer' : 'Resume rest timer'}>
                        {running ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
                    </button>
                    <button type="button" onClick={onDismiss} aria-label="Skip rest" className="is-skip">
                        <X className="h-4 w-4" aria-hidden="true" /><span>Skip</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
