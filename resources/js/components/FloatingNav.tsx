import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { m, useMotionValueEvent, useScroll } from 'motion/react';
import Modal from './Modal';
import { Arrow } from './Icons';
import { ActionButton } from './StudioMotion';
import { studioEase, useStudioMotion } from './useStudioMotion';
import { useSite, useCopy } from '../content';

export default function FloatingNav() {
    const c = useCopy();
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { scrollY } = useScroll();
    const { reducedMotion } = useStudioMotion();
    const { siteRoutes } = useSite();
    const currentPath = usePage().url.split('?')[0];
    const links = ['home', 'about', 'services', 'projects', 'contact'].map((key) => [c(`navigation.${key}`), key]);
    useMotionValueEvent(scrollY, 'change', (value) => setScrolled((previous) => previous ? value > 16 : value > 48));
    function active(key: string) { return key === 'home' ? currentPath === siteRoutes.home : currentPath.startsWith(siteRoutes[key]); }

    return <>
        <m.header initial={reducedMotion ? false : { y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: reducedMotion ? 0 : 0.4, ease: studioEase }} className={`floating-nav ${scrolled ? 'is-scrolled' : ''}`}>
            <Link href={siteRoutes.home} className="brand-link" aria-label="Smartify Solutions home"><img src="/images/brand/smartify-logo.png" width="1447" height="1087" alt="" /><span className="brand-name">SMARTIFY<span>SOLUTIONS</span></span></Link>
            <nav aria-label="Main navigation" className="desktop-nav">{links.map(([label, key]) => <Link key={key} className="nav-link" href={siteRoutes[key]} aria-current={active(key) ? 'page' : undefined}>{label}</Link>)}</nav>
            <Link className="nav-contact" href={siteRoutes.contact}>{c('navigation.cta')} <Arrow diagonal /></Link>
            <ActionButton type="button" className="menu-toggle" aria-label="Open navigation" aria-haspopup="dialog" aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(true)}><span>Menu</span><span className="menu-lines" aria-hidden="true"><i /><i /></span></ActionButton>
        </m.header>
        <Modal open={menuOpen} onClose={() => setMenuOpen(false)} titleId="mobile-menu-title" className="mobile-menu"><div id="mobile-navigation"><p id="mobile-menu-title" className="eyebrow">SMARTIFY SOLUTIONS / EXPLORE</p>
            <m.nav aria-label="Mobile navigation" className="mobile-menu-links" initial={reducedMotion ? false : 'hidden'} animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: reducedMotion ? 0 : 0.035 } } }}>{links.map(([label, key], index) => <m.div key={key} variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: reducedMotion ? 0 : 0.25 }}><Link href={siteRoutes[key]} onClick={() => setMenuOpen(false)} aria-current={active(key) ? 'page' : undefined}><span className="mobile-menu-number">0{index + 1}</span>{label}<Arrow diagonal /></Link></m.div>)}</m.nav>
            <p className="text-muted text-sm">Ideas with intelligence. Experiences with impact.</p>
        </div></Modal>
    </>;
}
