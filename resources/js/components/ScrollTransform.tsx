import { useRef, type ReactNode } from 'react';
import { m, useScroll, useSpring, useTransform } from 'motion/react';
import { useStudioMotion } from './useStudioMotion';

export default function ScrollTransform({ children, image = false }: { children: ReactNode; image?: boolean }) {
    const target = useRef<HTMLDivElement>(null);
    const { canHover } = useStudioMotion();
    const { scrollYProgress } = useScroll({ target, offset: ['start end', 'end start'] });
    const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
    const rotateX = useTransform(progress, [0, 0.5, 1], image ? [4, 0, -4] : [7, 0, -4]);
    const rotateZ = useTransform(progress, [0, 0.5, 1], image ? [-2, 0, 2] : [-1.2, 0, 1.2]);
    const scale = useTransform(progress, [0, 0.5, 1], image ? [1.13, 1.03, 1.12] : [0.94, 1, 0.985]);
    const y = useTransform(progress, [0, 0.5, 1], image ? [30, 0, -30] : [45, 0, -25]);
    return <div ref={target} className="scroll-transform">
        <m.div className="scroll-transform-content" style={canHover ? { rotateX, rotateZ, scale, y } : { rotateX: 0, rotateZ: 0, scale: 1, y: 0 }}>{children}</m.div>
    </div>;
}
