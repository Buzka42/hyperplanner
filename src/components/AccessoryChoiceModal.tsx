import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { useLanguage } from '../contexts/useTranslation';
import { Skull, Flame, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

interface AccessoryChoiceModalProps {
    open: boolean;
    onClose: () => void;
    onSelectType: (type: 'upper' | 'lower') => void;
}

export const AccessoryChoiceModal: React.FC<AccessoryChoiceModalProps> = ({
    open,
    onClose,
    onSelectType
}) => {
    const { t } = useLanguage();

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md bg-zinc-950 border-zinc-800 text-zinc-100 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
                <DialogHeader className="space-y-4">
                    <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-2 border border-red-500/20">
                        <Skull className="h-8 w-8 text-red-500 animate-pulse" />
                    </div>
                    <DialogTitle className="text-3xl font-black text-center text-zinc-100 tracking-tighter uppercase">
                        {t('trinary.accessoryModal.title')}
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-400 text-sm font-medium tracking-wide">
                        {t('trinary.accessoryModal.description')}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 gap-4 py-8">
                    <Button
                        onClick={() => onSelectType('upper')}
                        className={cn(
                            "group relative w-full h-28 bg-zinc-900 border border-zinc-800 hover:border-red-600/50 hover:bg-zinc-800/80 transition-all duration-300",
                            "flex flex-col items-center justify-center p-0 overflow-hidden"
                        )}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-red-600/0 via-red-600/5 to-red-600/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex flex-col items-center justify-center gap-1 z-10 w-full">
                            <Skull className="h-7 w-7 text-red-500 mb-1 group-hover:scale-125 transition-transform duration-500" />
                            <div className="text-center w-full px-4">
                                <div className="font-black text-xl uppercase tracking-tighter text-zinc-100">{t('trinary.accessoryModal.upperTitle')}</div>
                                <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-[0.2em] mt-0.5">{t('trinary.accessoryModal.upperDesc')}</div>
                            </div>
                        </div>
                    </Button>

                    <Button
                        onClick={() => onSelectType('lower')}
                        className={cn(
                            "group relative w-full h-28 bg-zinc-900 border border-zinc-800 hover:border-orange-500/50 hover:bg-zinc-800/80 transition-all duration-300",
                            "flex flex-col items-center justify-center p-0 overflow-hidden"
                        )}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex flex-col items-center justify-center gap-1 z-10 w-full">
                            <Flame className="h-7 w-7 text-orange-500 mb-1 group-hover:scale-125 transition-transform duration-500" />
                            <div className="text-center w-full px-4">
                                <div className="font-black text-xl uppercase tracking-tighter text-zinc-100">{t('trinary.accessoryModal.lowerTitle')}</div>
                                <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-[0.2em] mt-0.5">{t('trinary.accessoryModal.lowerDesc')}</div>
                            </div>
                        </div>
                    </Button>
                </div>

                <div className="text-[9px] text-zinc-700 text-center uppercase tracking-[0.3em] font-black pt-4 border-t border-zinc-900">
                    <span className="flex items-center justify-center gap-2">
                        <Zap className="h-3 w-3" />
                        Conjugate Protocol Optimized
                        <Zap className="h-3 w-3" />
                    </span>
                </div>
            </DialogContent>
        </Dialog>
    );
};
