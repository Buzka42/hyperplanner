import React, { useEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw, Timer, X } from 'lucide-react';

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

    const reset = () => {
        notifiedRef.current = false;
        deadlineRef.current = running ? Date.now() + seconds * 1000 : null;
        setRemaining(seconds);
    };

    const done = remaining === 0;
    const progress = seconds > 0 ? 1 - remaining / seconds : 1;

    return (
        <div className={done ? 'rest-timer is-done' : 'rest-timer'} role="timer" aria-live="off">
            <div className="rest-timer-bar" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />
            <div className="rest-timer-body">
                <Timer className="h-4 w-4 shrink-0" />
                <span className="rest-timer-value">{done ? 'Rest complete' : formatRest(remaining)}</span>
                {label && <span className="rest-timer-label">{label}</span>}
                <div className="rest-timer-actions">
                    <button onClick={toggle} aria-label={running ? 'Pause rest timer' : 'Resume rest timer'}>
                        {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </button>
                    <button onClick={reset} aria-label="Restart rest timer"><RotateCcw className="h-4 w-4" /></button>
                    <button onClick={onDismiss} aria-label="Dismiss rest timer"><X className="h-4 w-4" /></button>
                </div>
            </div>
        </div>
    );
};
