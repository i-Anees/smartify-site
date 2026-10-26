import { Head, Link } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { m, useScroll, useSpring } from 'motion/react';
import FloatingNav from './FloatingNav';
import Footer from './Footer';
import { useCopy, useSite } from '../content';
import { useStudioMotion } from './useStudioMotion';
import RippleCursor from './RippleCursor';

function ScrollProgress() {
    const { scrollYProgress } = useScroll();
    const progress = useSpring(scrollYProgress, { stiffness: 160, damping: 30 });
    const { reducedMotion } = useStudioMotion();
    return <m.div className="flow-progress" aria-hidden="true" style={{ scaleX: reducedMotion ? scrollYProgress : progress }} />;
}

export default function SiteLayout({ title, children }: { title: string; children: ReactNode }) {
    const c = useCopy();
    const { contactEmail, socialLinks } = useSite();
    return <>
        <Head title={title}><meta name="description" content={c('seo.description')} /></Head>
        <ScrollProgress />
        <RippleCursor />
        <a className="skip-link" href="#main">Skip to content</a>
        <div id="top"><FloatingNav /><main id="main" tabIndex={-1}>{children}</main><Footer contactEmail={contactEmail} socialLinks={socialLinks} /></div>
    </>;
}

export function Breadcrumb({ current }: { current: string }) {
    const { siteRoutes } = useSite();
    return <nav aria-label="Breadcrumb" className="breadcrumb"><Link href={siteRoutes.home}>Home</Link><span aria-hidden="true">›</span><Link href={siteRoutes.services}>Services</Link><span aria-hidden="true">›</span><span aria-current="page">{current}</span></nav>;
}

