import { useEffect, useRef } from 'react';
import { useStudioMotion } from './useStudioMotion';

type Ripple = { x: number; y: number; born: number; lifetime: number; radius: number; blue: boolean };

export default function RippleCursor() {
    const ref = useRef<HTMLCanvasElement>(null);
    const { canHover } = useStudioMotion();

    useEffect(() => {
        const canvas = ref.current;
        const context = canvas?.getContext('2d');
        if (!canvas || !context || !canHover) return;
        let frame = 0;
        let width = window.innerWidth;
        let height = window.innerHeight;
        let ripples: Ripple[] = [];
        let pointerPresent = false;
        let x = 0;
        let y = 0;
        let targetX = 0;
        let targetY = 0;
        let radius = 7;
        let interactive = false;
        let previousX = 0;
        let previousY = 0;
        let lastRipple = 0;

        function requestFrame() {
            if (!frame && !document.hidden) frame = requestAnimationFrame(draw);
        }
        function draw(time: number) {
            frame = 0;
            if (document.hidden) return;
            context!.clearRect(0, 0, width, height);
            x += (targetX - x) * 0.2;
            y += (targetY - y) * 0.2;
            const desiredRadius = interactive ? 18 : 7;
            radius += (desiredRadius - radius) * 0.18;
            ripples = ripples.filter((ripple) => time - ripple.born < ripple.lifetime);
            for (const ripple of ripples) {
                const progress = (time - ripple.born) / ripple.lifetime;
                const expansion = 1 - Math.pow(1 - progress, 3);
                context!.beginPath();
                context!.arc(ripple.x, ripple.y, 3 + ripple.radius * expansion, 0, Math.PI * 2);
                context!.strokeStyle = ripple.blue ? `rgba(37,99,235,${0.45 * (1 - progress)})` : `rgba(128,11,37,${0.3 * (1 - progress)})`;
                context!.lineWidth = ripple.blue ? 1.6 : 1;
                context!.stroke();
            }
            if (pointerPresent) {
                context!.beginPath();
                context!.arc(x, y, radius, 0, Math.PI * 2);
                context!.fillStyle = interactive ? 'rgba(128,11,37,0.04)' : 'rgba(128,11,37,0.025)';
                context!.fill();
                context!.strokeStyle = interactive ? 'rgba(128,11,37,0.42)' : 'rgba(128,11,37,0.25)';
                context!.lineWidth = 1;
                context!.stroke();
            }
            const settling = pointerPresent && (Math.abs(targetX - x) + Math.abs(targetY - y) > 0.2 || Math.abs(desiredRadius - radius) > 0.1);
            if (ripples.length || settling) requestFrame();
        }
        function move(event: PointerEvent) {
            if (event.pointerType !== 'mouse') return;
            targetX = event.clientX;
            targetY = event.clientY;
            if (!pointerPresent) { x = targetX; y = targetY; previousX = x; previousY = y; }
            pointerPresent = true;
            interactive = event.target instanceof Element && Boolean(event.target.closest('a, button, input, textarea, select, [role="button"]'));
            const now = performance.now();
            if (Math.hypot(targetX - previousX, targetY - previousY) > 28 && now - lastRipple > 45) {
                ripples.push({ x: targetX, y: targetY, born: now, lifetime: 650, radius: interactive ? 28 : 22, blue: false });
                previousX = targetX; previousY = targetY; lastRipple = now;
                ripples = ripples.slice(-18);
            }
            requestFrame();
        }
        function click(event: PointerEvent) {
            if (event.pointerType !== 'mouse') return;
            const born = performance.now();
            ripples.push({ x: event.clientX, y: event.clientY, born, lifetime: 850, radius: 60, blue: true });
            ripples.push({ x: event.clientX, y: event.clientY, born, lifetime: 600, radius: 42, blue: false });
            ripples = ripples.slice(-18);
            requestFrame();
        }
        function clear() {
            cancelAnimationFrame(frame); frame = 0;
            pointerPresent = false; ripples = [];
            context!.clearRect(0, 0, width, height);
        }
        function leave(event: PointerEvent) { if (!event.relatedTarget) clear(); }
        function resize() {
            width = window.innerWidth; height = window.innerHeight;
            const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
            canvas!.width = Math.round(width * ratio);
            canvas!.height = Math.round(height * ratio);
            context!.setTransform(ratio, 0, 0, ratio, 0, 0);
            requestFrame();
        }
        function visibilityChanged() { if (document.hidden) clear(); }
        resize();
        window.addEventListener('pointermove', move, { passive: true });
        window.addEventListener('pointerdown', click, { passive: true });
        window.addEventListener('pointerout', leave);
        window.addEventListener('blur', clear);
        window.addEventListener('resize', resize);
        document.addEventListener('visibilitychange', visibilityChanged);
        return () => {
            clear();
            window.removeEventListener('pointermove', move);
            window.removeEventListener('pointerdown', click);
            window.removeEventListener('pointerout', leave);
            window.removeEventListener('blur', clear);
            window.removeEventListener('resize', resize);
            document.removeEventListener('visibilitychange', visibilityChanged);
        };
    }, [canHover]);

    return canHover ? <canvas ref={ref} className="ripple-cursor" aria-hidden="true" /> : null;
}
