import { useSite, useCopy } from '../content';
import { useEffect, useState } from 'react';
import { AnimatePresence, m } from 'motion/react';
import Modal from './Modal';
import { ActionButton } from './StudioMotion';
import { useStudioMotion } from './useStudioMotion';

export default function Showreel({ open, onClose }: { open: boolean; onClose: () => void }) {
    const c = useCopy();
    const { siteContent: { reel: scenes } } = useSite();
    const { reducedMotion } = useStudioMotion();
    const [scene, setScene] = useState(0);
    const [playing, setPlaying] = useState(false);
    useEffect(() => { if (open) { setScene(0); setPlaying(!reducedMotion); } }, [open, reducedMotion]);
    useEffect(() => {
        if (!open || !playing || reducedMotion) return;
        const timer = window.setTimeout(() => { if (scene === scenes.length - 1) setPlaying(false); else setScene(scene + 1); }, 4000);
        return () => window.clearTimeout(timer);
    }, [open, playing, reducedMotion, scene, scenes.length]);
    if (!scenes.length) return null;
    const current = Math.min(scene, scenes.length - 1);
    return <Modal open={open} onClose={onClose} titleId="reel-title" className="reel-dialog"><p className="eyebrow">{c('reel.label')}</p><h2 id="reel-title" className="dialog-title">{c('reel.heading')}</h2><p className="reel-note">{c('reel.description')}</p>
        <div className="reel-stage"><AnimatePresence mode="wait"><m.div key={scene} initial={reducedMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.3 }}><img src={scenes[current].image} alt="" /><div className="reel-caption"><span>{scenes[current].label}</span><h3>{scenes[current].title}</h3></div></m.div></AnimatePresence></div>
        <div className="reel-controls"><ActionButton type="button" onClick={() => { setScene((scene + scenes.length - 1) % scenes.length); setPlaying(false); }}>Previous</ActionButton><span aria-live="polite">{scene + 1} / {scenes.length}</span>{!reducedMotion && <ActionButton type="button" onClick={() => { if (scene === scenes.length - 1 && !playing) setScene(0); setPlaying(!playing); }}>{playing ? 'Pause' : scene === scenes.length - 1 ? 'Replay' : 'Play'}</ActionButton>}<ActionButton type="button" onClick={() => { setScene((scene + 1) % scenes.length); setPlaying(false); }}>Next</ActionButton></div>
    </Modal>;
}
