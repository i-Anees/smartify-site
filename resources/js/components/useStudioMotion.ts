import { createContext, useContext, useEffect, useRef, type PointerEvent } from 'react';
import { useSpring, useTransform } from 'motion/react';

export const studioEase = [0.22, 1, 0.36, 1] as const;
export const StudioMotionContext = createContext({ reducedMotion: true, canHover: false });

export function useStudioMotion() {
    return useContext(StudioMotionContext);
}

export function usePointerMotion(distance = 4) {
    const { reducedMotion, canHover } = useStudioMotion();
    const bounds = useRef<DOMRect | null>(null);
    const x = useSpring(0, { stiffness: 125, damping: 26, mass: 0.6 });
    const y = useSpring(0, { stiffness: 125, damping: 26, mass: 0.6 });
    const rotateX = useTransform(y, [-distance, distance], [3.5, -3.5]);
    const rotateY = useTransform(x, [-distance, distance], [-3.5, 3.5]);

    useEffect(() => {
        bounds.current = null;
        x.jump(0);
        y.jump(0);
        if (!canHover) return;
        const reset = () => {
            bounds.current = null;
            x.set(0);
            y.set(0);
        };
        window.addEventListener('scroll', reset, { passive: true });
        window.addEventListener('resize', reset);
        document.addEventListener('visibilitychange', reset);
        return () => {
            window.removeEventListener('scroll', reset);
            window.removeEventListener('resize', reset);
            document.removeEventListener('visibilitychange', reset);
        };
    }, [canHover, x, y]);

    function move(event: PointerEvent<HTMLDivElement>) {
        if (!canHover || event.pointerType !== 'mouse') return;
        const rect = bounds.current ??= event.currentTarget.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const clamp = (value: number) => Math.max(-distance, Math.min(distance, value));
        x.set(clamp(((event.clientX - rect.left) / rect.width - 0.5) * distance * 2));
        y.set(clamp(((event.clientY - rect.top) / rect.height - 0.5) * distance * 2));
    }

    return {
        reducedMotion,
        canHover,
        values: { x, y },
        style: { x: canHover ? x : 0, y: canHover ? y : 0 },
        tiltStyle: { x: canHover ? x : 0, y: canHover ? y : 0, rotateX: canHover ? rotateX : 0, rotateY: canHover ? rotateY : 0, transformPerspective: 1000 },
        handlers: {
            onPointerEnter: move,
            onPointerMove: move,
            onPointerLeave: () => { bounds.current = null; x.set(0); y.set(0); },
        },
    };
}
