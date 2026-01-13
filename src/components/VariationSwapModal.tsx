import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { BENCH_VARIATIONS, DEADLIFT_VARIATIONS, SQUAT_VARIATIONS } from '../data/trinary';

interface VariationSwapModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (variations: { bench: string, deadlift: string, squat: string }) => void;
    initialVariations: { bench: string, deadlift: string, squat: string };
    weakPoints: { bench: string, deadlift: string, squat: string };
    excludedVariations: string[];
}

export const VariationSwapModal: React.FC<VariationSwapModalProps> = ({
    open,
    onClose,
    onConfirm,
    initialVariations,
    weakPoints,
    excludedVariations
}) => {
    const [selectedVariations, setSelectedVariations] = useState(initialVariations);

    // Update state when initialVariations change (when modal opens)
    useEffect(() => {
        setSelectedVariations(initialVariations);
    }, [initialVariations]);

    const getAvailableVariations = (lift: 'bench' | 'deadlift' | 'squat', weakPoint: string) => {
        let allVars: string[] = [];
        if (lift === 'bench') {
            const key = weakPoint as keyof typeof BENCH_VARIATIONS;
            allVars = BENCH_VARIATIONS[key] || [];
        } else if (lift === 'deadlift') {
            const key = weakPoint as keyof typeof DEADLIFT_VARIATIONS;
            allVars = DEADLIFT_VARIATIONS[key] || [];
        } else {
            const key = weakPoint as keyof typeof SQUAT_VARIATIONS;
            allVars = SQUAT_VARIATIONS[key] || [];
        }

        // Filter exclusions
        const filtered = allVars.filter(v => !excludedVariations.includes(v));
        // If filtered is empty, return original list (fallback) or at least the current initial one
        if (filtered.length === 0) return allVars;
        return filtered;
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Confirm Block Variations</DialogTitle>
                    <DialogDescription>
                        Based on your weak points, these variations have been selected. You can swap them if needed.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 my-4">
                    {/* Bench */}
                    <div className="space-y-2">
                        <Label className="font-semibold text-primary">Bench Weak Point: <span className="text-foreground">{weakPoints.bench}</span></Label>
                        <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={selectedVariations.bench}
                            onChange={(e) => setSelectedVariations(prev => ({ ...prev, bench: e.target.value }))}
                        >
                            {getAvailableVariations('bench', weakPoints.bench).map(v => (
                                <option key={v} value={v}>{v}</option>
                            ))}
                        </select>
                    </div>

                    {/* Squat */}
                    <div className="space-y-2">
                        <Label className="font-semibold text-primary">Squat Weak Point: <span className="text-foreground">{weakPoints.squat}</span></Label>
                        <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={selectedVariations.squat}
                            onChange={(e) => setSelectedVariations(prev => ({ ...prev, squat: e.target.value }))}
                        >
                            {getAvailableVariations('squat', weakPoints.squat).map(v => (
                                <option key={v} value={v}>{v}</option>
                            ))}
                        </select>
                    </div>

                    {/* Deadlift */}
                    <div className="space-y-2">
                        <Label className="font-semibold text-primary">Deadlift Weak Point: <span className="text-foreground">{weakPoints.deadlift}</span></Label>
                        <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={selectedVariations.deadlift}
                            onChange={(e) => setSelectedVariations(prev => ({ ...prev, deadlift: e.target.value }))}
                        >
                            {getAvailableVariations('deadlift', weakPoints.deadlift).map(v => (
                                <option key={v} value={v}>{v}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={() => onConfirm(selectedVariations)}>Confirm Variations</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
