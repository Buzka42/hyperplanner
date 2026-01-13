import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { useLanguage } from '../contexts/useTranslation';
import { BENCH_VARIATIONS, DEADLIFT_VARIATIONS, SQUAT_VARIATIONS } from '../data/trinary';

interface WeakPointModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (weakPoints: {
        bench: 'off-chest' | 'mid-range' | 'lockout';
        deadlift: 'lift-off' | 'over-knees' | 'lockout';
        squat: 'bottom' | 'mid-range' | 'lockout';
    }) => void;
    currentWeakPoints?: {
        bench?: string;
        deadlift?: string;
        squat?: string;
    };
}

export const WeakPointModal: React.FC<WeakPointModalProps> = ({
    open,
    onClose,
    onSubmit,
    currentWeakPoints
}) => {
    const { t } = useLanguage();

    const [benchWeak, setBenchWeak] = useState<'off-chest' | 'mid-range' | 'lockout'>(
        (currentWeakPoints?.bench as any) || 'mid-range'
    );
    const [deadliftWeak, setDeadliftWeak] = useState<'lift-off' | 'over-knees' | 'lockout'>(
        (currentWeakPoints?.deadlift as any) || 'over-knees'
    );
    const [squatWeak, setSquatWeak] = useState<'bottom' | 'mid-range' | 'lockout'>(
        (currentWeakPoints?.squat as any) || 'bottom'
    );

    const handleSubmit = () => {
        onSubmit({
            bench: benchWeak,
            deadlift: deadliftWeak,
            squat: squatWeak
        });
        onClose();
    };

    // Get variation examples for display
    const getBenchVariations = (weakPoint: string) => BENCH_VARIATIONS[weakPoint as keyof typeof BENCH_VARIATIONS]?.join(', ') || '';
    const getDeadliftVariations = (weakPoint: string) => DEADLIFT_VARIATIONS[weakPoint as keyof typeof DEADLIFT_VARIATIONS]?.join(', ') || '';
    const getSquatVariations = (weakPoint: string) => SQUAT_VARIATIONS[weakPoint as keyof typeof SQUAT_VARIATIONS]?.join(', ') || '';

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="max-w-lg bg-zinc-900 border-zinc-700 text-zinc-100">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-zinc-100">
                        {t('trinary.weakPointModal.title')}
                    </DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        {t('trinary.weakPointModal.description')}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Tip */}
                    <div className="bg-zinc-800/50 border border-zinc-700 rounded p-3 text-sm text-zinc-300">
                        <strong className="text-zinc-200">💡 {t('trinary.weakPointModal.tipTitle')}</strong><br />
                        {t('trinary.weakPointModal.tipText')}
                    </div>

                    {/* Bench Press */}
                    <div className="space-y-3">
                        <h3 className="font-bold text-zinc-200">{t('trinary.weakPointModal.benchTitle')}</h3>
                        <RadioGroup value={benchWeak} onValueChange={(v) => setBenchWeak(v as any)}>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="off-chest" id="bench-off-chest" />
                                    <Label htmlFor="bench-off-chest" className="text-zinc-300 cursor-pointer">
                                        {t('trinary.weakPointModal.benchOffChest')}
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="mid-range" id="bench-mid-range" />
                                    <Label htmlFor="bench-mid-range" className="text-zinc-300 cursor-pointer">
                                        {t('trinary.weakPointModal.benchMidRange')}
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="lockout" id="bench-lockout" />
                                    <Label htmlFor="bench-lockout" className="text-zinc-300 cursor-pointer">
                                        {t('trinary.weakPointModal.benchLockout')}
                                    </Label>
                                </div>
                            </div>
                        </RadioGroup>
                        <p className="text-xs text-zinc-500">
                            {t('trinary.weakPointModal.variations')}: {getBenchVariations(benchWeak)}
                        </p>
                    </div>

                    {/* Deadlift */}
                    <div className="space-y-3">
                        <h3 className="font-bold text-zinc-200">{t('trinary.weakPointModal.deadliftTitle')}</h3>
                        <RadioGroup value={deadliftWeak} onValueChange={(v) => setDeadliftWeak(v as any)}>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="lift-off" id="deadlift-lift-off" />
                                    <Label htmlFor="deadlift-lift-off" className="text-zinc-300 cursor-pointer">
                                        {t('trinary.weakPointModal.deadliftLiftOff')}
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="over-knees" id="deadlift-over-knees" />
                                    <Label htmlFor="deadlift-over-knees" className="text-zinc-300 cursor-pointer">
                                        {t('trinary.weakPointModal.deadliftOverKnees')}
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="lockout" id="deadlift-lockout" />
                                    <Label htmlFor="deadlift-lockout" className="text-zinc-300 cursor-pointer">
                                        {t('trinary.weakPointModal.deadliftLockout')}
                                    </Label>
                                </div>
                            </div>
                        </RadioGroup>
                        <p className="text-xs text-zinc-500">
                            {t('trinary.weakPointModal.variations')}: {getDeadliftVariations(deadliftWeak)}
                        </p>
                    </div>

                    {/* Squat */}
                    <div className="space-y-3">
                        <h3 className="font-bold text-zinc-200">{t('trinary.weakPointModal.squatTitle')}</h3>
                        <RadioGroup value={squatWeak} onValueChange={(v) => setSquatWeak(v as any)}>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="bottom" id="squat-bottom" />
                                    <Label htmlFor="squat-bottom" className="text-zinc-300 cursor-pointer">
                                        {t('trinary.weakPointModal.squatBottom')}
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="mid-range" id="squat-mid-range" />
                                    <Label htmlFor="squat-mid-range" className="text-zinc-300 cursor-pointer">
                                        {t('trinary.weakPointModal.squatMidRange')}
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="lockout" id="squat-lockout" />
                                    <Label htmlFor="squat-lockout" className="text-zinc-300 cursor-pointer">
                                        {t('trinary.weakPointModal.squatLockout')}
                                    </Label>
                                </div>
                            </div>
                        </RadioGroup>
                        <p className="text-xs text-zinc-500">
                            {t('trinary.weakPointModal.variations')}: {getSquatVariations(squatWeak)}
                        </p>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button variant="outline" onClick={onClose} className="border-zinc-600 text-zinc-300">
                        {t('common.cancel')}
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        className="bg-zinc-600 hover:bg-zinc-500 text-zinc-100"
                    >
                        {t('trinary.weakPointModal.submit')}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
