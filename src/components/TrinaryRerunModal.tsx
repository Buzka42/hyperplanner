import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { useLanguage } from '../contexts/useTranslation';
import { RefreshCw, Play, Calendar } from 'lucide-react';

interface TrinaryRerunModalProps {
    open: boolean;
    onDeloadWeek: () => void;      // Option A: 1 week at 50% volume, -25% ME, -15% DE/RE
    onContinueNoDeload: () => void; // Option B: Progress without deload
    onRestDays: () => void;         // Option C: 4-5 days off
}

export const TrinaryRerunModal: React.FC<TrinaryRerunModalProps> = ({
    open,
    onDeloadWeek,
    onContinueNoDeload,
    onRestDays
}) => {
    const { t } = useLanguage();

    return (
        <Dialog open={open} onOpenChange={() => { /* Modal cannot be dismissed */ }}>
            <DialogContent className="max-w-lg bg-zinc-900 border-zinc-700 text-zinc-100" onPointerDownOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center text-zinc-100">
                        {t('trinary.rerunModal.title')}
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-400">
                        {t('trinary.rerunModal.description')}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Option A: Deload Week */}
                    <div className="bg-zinc-800/50 border border-green-600/50 rounded-lg p-4">
                        <h3 className="font-bold text-green-400 flex items-center gap-2">
                            <RefreshCw className="h-5 w-5" />
                            {t('trinary.rerunModal.optionATitle')}
                        </h3>
                        <p className="text-sm text-zinc-400 mt-2">
                            {t('trinary.rerunModal.optionADesc')}
                        </p>
                        <ul className="text-xs text-zinc-500 mt-2 space-y-1 ml-4 list-disc">
                            <li>{t('trinary.rerunModal.optionADetail1')}</li>
                            <li>{t('trinary.rerunModal.optionADetail2')}</li>
                            <li>{t('trinary.rerunModal.optionADetail3')}</li>
                        </ul>
                        <Button
                            onClick={onDeloadWeek}
                            className="w-full mt-3 bg-green-600 hover:bg-green-500 text-white"
                        >
                            {t('trinary.rerunModal.optionAButton')}
                        </Button>
                    </div>

                    {/* Option B: Continue Without Deload */}
                    <div className="bg-zinc-800/30 border border-zinc-600 rounded-lg p-4">
                        <h3 className="font-bold text-zinc-300 flex items-center gap-2">
                            <Play className="h-5 w-5" />
                            {t('trinary.rerunModal.optionBTitle')}
                        </h3>
                        <p className="text-sm text-zinc-500 mt-2">
                            {t('trinary.rerunModal.optionBDesc')}
                        </p>
                        <Button
                            onClick={onContinueNoDeload}
                            variant="outline"
                            className="w-full mt-3 border-zinc-600 text-zinc-300 hover:bg-zinc-800"
                        >
                            {t('trinary.rerunModal.optionBButton')}
                        </Button>
                    </div>

                    {/* Option C: Rest Days */}
                    <div className="bg-zinc-800/30 border border-orange-600/50 rounded-lg p-4">
                        <h3 className="font-bold text-orange-400 flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            {t('trinary.rerunModal.optionCTitle')}
                        </h3>
                        <p className="text-sm text-zinc-500 mt-2">
                            {t('trinary.rerunModal.optionCDesc')}
                        </p>
                        <Button
                            onClick={onRestDays}
                            variant="outline"
                            className="w-full mt-3 border-orange-600/50 text-orange-400 hover:bg-orange-900/20"
                        >
                            {t('trinary.rerunModal.optionCButton')}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
