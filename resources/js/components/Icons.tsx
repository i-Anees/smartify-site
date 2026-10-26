export function Arrow({ diagonal = false, className = '' }: { diagonal?: boolean; className?: string }) {
    return <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={diagonal ? 'M5 19 19 5M5 5h14v14' : 'M4 12h15m-6-6 6 6-6 6'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export function Close() {
    return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>;
}

export function ServiceIcon({ name, className = '' }: { name: string; className?: string }) {
    const paths: Record<string, string> = {
        code: 'M8 7 3 12l5 5m8-10 5 5-5 5m-3-13-2 16',
        mobile: 'M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm2 3h4m-3 14h2',
        design: 'm4 16-1 5 5-1L21 7l-4-4L4 16Zm10-10 4 4M4 16l4 4',
        brand: 'M12 3a9 9 0 1 0 0 18h2a2 2 0 0 0 1-3.7 1.8 1.8 0 0 1 1-3.3h2a3 3 0 0 0 3-3c0-4.4-4-8-9-8ZM7 9h.01M11 6h.01M16 7h.01M6 14h.01',
        growth: 'M4 20V13h4v7m2 0V9h4v11m2 0V4h4v16M4 8l6-4 4 1 6-4',
        settings: 'm9 3 1-1h4l1 3 3 1 3-1 2 4-2 2v3l2 2-2 4-3-1-3 1-1 3h-4l-1-3-3-1-3 1-2-4 2-2v-3L1 9l2-4 3 1 3-1V3Zm3 6a3 3 0 1 0 0 6 3 3 0 0 0 0-6',
        eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Zm10-3a3 3 0 1 0 0 6 3 3 0 0 0 0-6',
        spark: 'm12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2Z',
        mail: 'M3 5h18v14H3V5Zm0 1 9 7 9-7',
        check: 'm5 12 4 4L19 6',
    };
    return <svg className={className} width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name] ?? paths.spark} /></svg>;
}

export function WaveLines({ className = '' }: { className?: string }) {
    return <svg className={`wave-lines ${className}`} viewBox="0 0 1440 170" preserveAspectRatio="none" fill="none" aria-hidden="true">{Array.from({ length: 8 }, (_, i) => <path key={i} d={`M-30 ${100 + i * 6}C260 ${-75 + i * 13} 420 ${235 - i * 4} 760 ${100 + i * 4}S1200 ${20 + i * 7} 1480 ${95 + i * 4}`} stroke="currentColor" strokeWidth=".65" opacity={0.4 - i * 0.035} />)}</svg>;
}
