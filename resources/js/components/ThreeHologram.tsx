import { useEffect, useRef } from 'react';
import { useStudioMotion } from './useStudioMotion';

const THREE_MODULE_URL = 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.min.js';

export default function ThreeHologram({ enabled = true }: { enabled?: boolean }) {
    const hostRef = useRef<HTMLDivElement>(null);
    const { canHover } = useStudioMotion();

    useEffect(() => {
        const host = hostRef.current;
        const stage = host?.parentElement;
        if (!host || !stage || !canHover || !enabled) return;
        let cancelled = false;
        let started = false;
        let visible = false;
        let frame = 0;
        let timer = 0;
        let invalidate = () => {};
        let dispose: (() => void) | undefined;
        host.dataset.webgl = 'waiting';

        async function start() {
            if (started || cancelled || !visible || document.hidden) return;
            started = true;
            try {
                const THREE = await import(/* @vite-ignore */ THREE_MODULE_URL);
                if (cancelled) return;
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('webgl2', { alpha: true, antialias: false, powerPreference: 'low-power' });
                if (!context) { host!.dataset.webgl = 'fallback'; return; }
                const renderer = new THREE.WebGLRenderer({ canvas, context, alpha: true, antialias: false, powerPreference: 'low-power' });
                const resources: { dispose: () => void }[] = [];
                const cleanups: (() => void)[] = [];
                dispose = () => {
                    cancelAnimationFrame(frame);
                    frame = 0;
                    cleanups.forEach((cleanup) => cleanup());
                    resources.forEach((resource) => resource.dispose());
                    renderer.dispose();
                    renderer.forceContextLoss();
                    canvas.remove();
                };
                renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
                renderer.setClearColor(0x000000, 0);
                const scene = new THREE.Scene();
                const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 30);
                camera.position.z = 7;
                const group = new THREE.Group();
                group.position.set(0.25, -0.35, 0);
                scene.add(group);
                for (let index = 0; index < 3; index++) {
                    const geometry = new THREE.TorusGeometry(1.9 + index * 0.19, 0.005, 4, 112);
                    const material = new THREE.MeshBasicMaterial({ color: index === 1 ? 0x800b25 : 0x2563eb, transparent: true, opacity: index === 1 ? 0.16 : 0.3, depthWrite: false });
                    const ring = new THREE.Mesh(geometry, material);
                    ring.rotation.set(0.55 + index * 0.24, -0.2 + index * 0.13, index * 0.16);
                    group.add(ring);
                    resources.push(geometry, material);
                }
                const coordinates: number[] = [];
                const connections: number[] = [];
                for (let index = 0; index < 36; index++) {
                    const angle = index * 2.399963;
                    const vertical = 1 - (index / 35) * 2;
                    const radius = Math.sqrt(1 - vertical * vertical);
                    coordinates.push(Math.cos(angle) * radius * 2.3, vertical * 2.3, Math.sin(angle) * radius * 2.3);
                }
                for (let index = 0; index < 36; index += 3) {
                    const next = (index + 7) % 36;
                    connections.push(...coordinates.slice(index * 3, index * 3 + 3), ...coordinates.slice(next * 3, next * 3 + 3));
                }
                const pointsGeometry = new THREE.BufferGeometry();
                pointsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(coordinates, 3));
                const pointsMaterial = new THREE.PointsMaterial({ color: 0x2563eb, size: 0.045, transparent: true, opacity: 0.65, depthWrite: false });
                group.add(new THREE.Points(pointsGeometry, pointsMaterial));
                const linesGeometry = new THREE.BufferGeometry();
                linesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(connections, 3));
                const linesMaterial = new THREE.LineBasicMaterial({ color: 0x2563eb, transparent: true, opacity: 0.12, depthWrite: false });
                group.add(new THREE.LineSegments(linesGeometry, linesMaterial));
                resources.push(pointsGeometry, pointsMaterial, linesGeometry, linesMaterial);
                let targetX = 0;
                let targetY = 0;
                let contextAvailable = true;
                let bounds: DOMRect | null = null;
                const entranceStarted = performance.now();
                let previousTime = entranceStarted;

                function requestFrame() {
                    if (!frame && !cancelled && contextAvailable && visible && !document.hidden) frame = requestAnimationFrame(draw);
                }
                function draw(time: number) {
                    frame = 0;
                    if (cancelled || !contextAvailable || !visible || document.hidden) return;
                    const delta = Math.min((time - previousTime) / 1000, 0.05);
                    previousTime = time;
                    const blend = 1 - Math.exp(-9 * delta);
                    group.rotation.x += (targetY - group.rotation.x) * blend;
                    group.rotation.y += (targetX - group.rotation.y) * blend;
                    const progress = Math.min((time - entranceStarted) / 800, 1);
                    group.scale.setScalar(0.96 + 0.04 * (1 - Math.pow(1 - progress, 3)));
                    renderer.render(scene, camera);
                    if (progress < 1 || Math.abs(targetX - group.rotation.y) + Math.abs(targetY - group.rotation.x) > 0.0005) requestFrame();
                }
                function move(event: PointerEvent) {
                    if (event.pointerType !== 'mouse') return;
                    bounds ??= stage!.getBoundingClientRect();
                    targetX = Math.max(-0.22, Math.min(0.22, ((event.clientX - bounds.left) / bounds.width - 0.5) * 0.44));
                    targetY = Math.max(-0.16, Math.min(0.16, ((event.clientY - bounds.top) / bounds.height - 0.5) * 0.32));
                    requestFrame();
                }
                function reset() { bounds = null; targetX = 0; targetY = 0; requestFrame(); }
                function resize() {
                    bounds = null;
                    const width = host!.clientWidth;
                    const height = host!.clientHeight;
                    if (!width || !height) return;
                    renderer.setSize(width, height, false);
                    camera.aspect = width / height;
                    camera.updateProjectionMatrix();
                    requestFrame();
                }
                function contextLost(event: Event) {
                    event.preventDefault();
                    contextAvailable = false;
                    cancelAnimationFrame(frame);
                    frame = 0;
                    canvas.hidden = true;
                    host!.dataset.webgl = 'fallback';
                    invalidate = () => {};
                }
                canvas.addEventListener('webglcontextlost', contextLost);
                stage!.addEventListener('pointermove', move, { passive: true });
                stage!.addEventListener('pointerleave', reset);
                window.addEventListener('scroll', reset, { passive: true });
                const sizeObserver = new ResizeObserver(resize);
                sizeObserver.observe(host!);
                cleanups.push(() => {
                    sizeObserver.disconnect();
                    canvas.removeEventListener('webglcontextlost', contextLost);
                    stage!.removeEventListener('pointermove', move);
                    stage!.removeEventListener('pointerleave', reset);
                    window.removeEventListener('scroll', reset);
                });
                invalidate = () => { previousTime = performance.now(); requestFrame(); };
                host!.appendChild(canvas);
                host!.dataset.webgl = 'ready';
                resize();
            } catch {
                dispose?.();
                dispose = undefined;
                if (!cancelled) host!.dataset.webgl = 'fallback';
            }
        }
        function visibilityChanged() {
            if (document.hidden || !visible) { cancelAnimationFrame(frame); frame = 0; }
            else if (started) invalidate();
            else { window.clearTimeout(timer); timer = window.setTimeout(start, 600); }
        }
        const observer = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            visibilityChanged();
        });
        observer.observe(host);
        document.addEventListener('visibilitychange', visibilityChanged);
        return () => {
            cancelled = true;
            window.clearTimeout(timer);
            cancelAnimationFrame(frame);
            observer.disconnect();
            document.removeEventListener('visibilitychange', visibilityChanged);
            dispose?.();
            invalidate = () => {};
            host.dataset.webgl = 'disabled';
        };
    }, [canHover, enabled]);

    return <div ref={hostRef} className="hero-webgl" data-webgl="disabled" aria-hidden="true" />;
}
