import { useEffect, type ReactNode } from 'react';
import { animate, m, useMotionValue } from 'motion/react';
import { useStudioMotion } from './useStudioMotion';

export function AmbientFloat({ active, children }: { active: boolean; children: ReactNode }) {
    const { canHover, reducedMotion } = useStudioMotion();
    const y = useMotionValue(0);
    useEffect(() => {
        if (!active) return;
        const animation = animate(y, [y.get(), canHover ? -12 : -6, 0], { duration: 5, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' });
        return () => animation.stop();
    }, [active, canHover, y]);
    return <m.div className="robot-float" style={{ y: reducedMotion ? 0 : y }}>{children}</m.div>;
}

export default function HeroAtmosphere({ active }: { active: boolean }) {
    const { reducedMotion } = useStudioMotion();
    const rotation = useMotionValue(0);
    useEffect(() => {
        if (!active) return;
        const animation = animate(rotation, rotation.get() + 360, { duration: 48, ease: 'linear', repeat: Infinity });
        return () => animation.stop();
    }, [active, rotation]);
    return <div className="hero-atmosphere" aria-hidden="true">
        <m.svg className="orbit-traces" viewBox="0 0 600 760" fill="none" style={{ rotate: rotation }}>
            <m.ellipse cx="300" cy="380" rx="260" ry="285" stroke="#2563EB" strokeWidth=".7" strokeDasharray="3 11" initial={reducedMotion ? false : { pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.45 }} transition={{ duration: reducedMotion ? 0 : 1.8, delay: reducedMotion ? 0 : 0.3 }} />
            <m.ellipse cx="300" cy="380" rx="225" ry="250" stroke="#800B25" strokeWidth=".6" initial={reducedMotion ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: reducedMotion ? 0 : 1.5, delay: reducedMotion ? 0 : 0.4 }} opacity=".2" />
            {Array.from({ length: 10 }, (_, index) => {
                const angle = index / 10 * Math.PI * 2;
                return <m.circle key={index} cx={300 + Math.cos(angle) * 260} cy={380 + Math.sin(angle) * 285} r={index % 3 === 0 ? 4 : 2} fill={index % 3 === 0 ? '#800B25' : '#2563EB'} initial={reducedMotion ? false : { opacity: 0, scale: 0 }} animate={{ opacity: 0.7, scale: 1 }} transition={{ duration: reducedMotion ? 0 : 0.5, delay: reducedMotion ? 0 : 0.5 + index * 0.08 }} />;
            })}
        </m.svg>
        <svg className="circuit-traces" viewBox="0 0 600 760" fill="none">
            {['M35 270V175H140L180 135H310', 'M420 220H535V405L490 450V565', 'M40 550H150L200 600H350'].map((path, index) => <m.path key={path} d={path} stroke="#2563EB" strokeWidth="1" opacity=".4" initial={reducedMotion ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: reducedMotion ? 0 : 1.4, delay: reducedMotion ? 0 : 0.45 + index * 0.18 }} />)}
            <m.rect x="60" y="150" width="480" height="1.2" fill="#2563EB" animate={active ? { y: [0, 420], opacity: [0, 0.65, 0.65, 0] } : { opacity: 0 }} transition={active ? { duration: 3.4, ease: 'linear', repeat: Infinity, repeatDelay: 0.8 } : { duration: 0.15 }} />
        </svg>
    </div>;
}
