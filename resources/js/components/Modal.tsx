import { useEffect, useRef, useState, type ReactNode } from 'react';
import { m } from 'motion/react';
import { Close } from './Icons';
import { ActionButton } from './StudioMotion';
import { studioEase, useStudioMotion } from './useStudioMotion';

export default function Modal({ open, onClose, titleId, children, className = '' }: {
    open: boolean; onClose: () => void; titleId: string; children: ReactNode; className?: string;
}) {
    const ref = useRef<HTMLDialogElement>(null);
    const { reducedMotion } = useStudioMotion();
    const [closing, setClosing] = useState(false);

    function requestClose() {
        if (reducedMotion) onClose();
        else setClosing(true);
    }

    useEffect(() => {
        const dialog = ref.current;
        if (!dialog || !open) return;
        setClosing(false);
        const previousOverflow = document.body.style.overflow;
        dialog.showModal();
        document.body.style.overflow = 'hidden';
        return () => {
            dialog.close();
            document.body.style.overflow = previousOverflow;
        };
    }, [open]);

    return (
        <dialog ref={ref} aria-labelledby={titleId} className={`studio-dialog ${className}`}
            onCancel={(event) => { event.preventDefault(); requestClose(); }}
            onClick={(event) => { if (event.target === event.currentTarget) requestClose(); }}>
            {open && <m.div initial={reducedMotion ? false : { opacity: 0, y: 12 }} animate={closing ? { opacity: 0, y: reducedMotion ? 0 : 8 } : { opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0 : closing ? 0.16 : 0.28, ease: studioEase }} onAnimationComplete={() => { if (closing) onClose(); }} className="dialog-content">
                <ActionButton type="button" onClick={requestClose} className="dialog-close" aria-label="Close dialog" autoFocus><Close /></ActionButton>
                {children}
            </m.div>}
        </dialog>
    );
}
