import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { m, useReducedMotion, type HTMLMotionProps } from 'motion/react';
import { StudioMotionContext, studioEase, useStudioMotion } from './useStudioMotion';

export function StudioMotionProvider({ children }: { children: ReactNode }) {
    const reducedMotion = Boolean(useReducedMotion());
    const [finePointer, setFinePointer] = useState(() => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 960px)').matches);
    useEffect(() => {
        const media = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 960px)');
        const update = () => setFinePointer(media.matches);
        update();
        media.addEventListener('change', update);
        return () => media.removeEventListener('change', update);
    }, []);
    const preferences = useMemo(() => ({ reducedMotion, canHover: finePointer && !reducedMotion }), [finePointer, reducedMotion]);
    return <StudioMotionContext.Provider value={preferences}>{children}</StudioMotionContext.Provider>;
}

type RevealOptions = { delay?: number; direction?: 'up' | 'left' | 'right'; distance?: number; duration?: number };

export function scrollReveal(reducedMotion: boolean, { delay = 0, direction = 'up', distance = 28, duration = 0.75 }: RevealOptions = {}) {
    return {
        'data-studio-reveal': '',
        initial: reducedMotion ? false as const : { opacity: 0, x: direction === 'left' ? -distance : direction === 'right' ? distance : 0, y: direction === 'up' ? distance : 0 },
        whileInView: { opacity: 1, x: 0, y: 0 },
        viewport: { once: true, amount: 0.12 },
        transition: { duration: reducedMotion ? 0 : duration, delay: reducedMotion ? 0 : delay, ease: studioEase },
    };
}

export function Reveal({ delay = 0, direction = 'up', distance, ...props }: HTMLMotionProps<'div'> & RevealOptions) {
    const { reducedMotion, canHover } = useStudioMotion();
    return <m.div {...scrollReveal(reducedMotion, { delay, direction, distance: distance ?? (canHover ? 40 : 22), duration: canHover ? 0.8 : 0.6 })} {...props} />;
}

export function TextLines({ lines, onLoad = false }: { lines: { text: string; className?: string }[]; onLoad?: boolean }) {
    const { reducedMotion } = useStudioMotion();
    return <>{lines.map((line, index) => <span key={line.text} className="text-reveal-line">
        <m.span className={line.className} initial={reducedMotion ? false : { y: '100%', opacity: 0 }}
            animate={onLoad ? { y: 0, opacity: 1 } : undefined}
            whileInView={onLoad ? undefined : { y: 0, opacity: 1 }} viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: reducedMotion ? 0 : 0.95, delay: reducedMotion ? 0 : index * 0.13, ease: studioEase }}>{line.text}</m.span>
    </span>)}</>;
}

export function SectionRule() {
    const { reducedMotion } = useStudioMotion();
    return <m.span aria-hidden="true" className="section-rule" initial={reducedMotion ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: reducedMotion ? 0 : 0.8, ease: studioEase }} />;
}

function useActionMotion() {
    const { reducedMotion, canHover } = useStudioMotion();
    return {
        whileHover: canHover ? { y: -4, scale: 1.015 } : undefined,
        whileTap: reducedMotion ? undefined : { scale: 0.97 },
        transition: { duration: 0.25, ease: studioEase },
    };
}

export function ActionLink(props: HTMLMotionProps<'a'>) {
    return <m.a {...useActionMotion()} {...props} />;
}

export function ActionButton(props: HTMLMotionProps<'button'>) {
    return <m.button {...useActionMotion()} {...props} />;
}
