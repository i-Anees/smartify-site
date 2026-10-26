import { useCopy, useSite } from '../content';
import ContentLines from './ContentLines';
import { useEffect, useRef, useState } from 'react';
import { Link } from '@inertiajs/react';
import { m, useInView, useScroll, useTransform } from 'motion/react';
import { Arrow, ServiceIcon } from './Icons';
import { ActionButton } from './StudioMotion';
import { studioEase, usePointerMotion, useStudioMotion } from './useStudioMotion';
import Showreel from './Showreel';
import ThreeHologram from './ThreeHologram';
import HeroAtmosphere, { AmbientFloat } from './HeroAtmosphere';



export default function Hero() {
    const c = useCopy();
    const headline = [{ text: c('hero.heading'), emphasis: '' }, { text: c('hero.lead'), emphasis: c('hero.emphasis') }];
    const { reducedMotion, canHover } = useStudioMotion();
    const { tiltStyle, handlers, values } = usePointerMotion(14);
    const { siteRoutes, serviceRoutes, siteContent: { reel } } = useSite();
    const [reelOpen, setReelOpen] = useState(false);
    const [effectsEnabled, setEffectsEnabled] = useState(true);
    const [tabVisible, setTabVisible] = useState(true);
    const heroRef = useRef<HTMLElement>(null);
    const inView = useInView(heroRef, { amount: 0.1 });
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
    const robotScroll = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const panelScroll = useTransform(scrollYProgress, [0, 1], [0, 85]);
    const visualRotate = useTransform(scrollYProgress, [0, 1], [0, -9]);
    const visualScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
    const copyScroll = useTransform(scrollYProgress, [0, 1], [0, -32]);
    const foregroundX = useTransform(values.x, [-14, 14], [18, -18]);
    const foregroundY = useTransform(values.y, [-14, 14], [14, -14]);
    const active = effectsEnabled && !reducedMotion && inView && tabVisible;
    const interactive = canHover && effectsEnabled;

    useEffect(() => {
        const update = () => setTabVisible(!document.hidden);
        update();
        document.addEventListener('visibilitychange', update);
        return () => document.removeEventListener('visibilitychange', update);
    }, []);

    useEffect(() => {
        if (!effectsEnabled) { values.x.jump(0); values.y.jump(0); }
    }, [effectsEnabled, values.x, values.y]);

    return <section ref={heroRef} className="hero hero-refined" aria-labelledby="hero-heading" data-effects={active ? 'running' : 'paused'}>
        <div className="hero-body page-shell">
            <m.div className="hero-copy" style={{ y: interactive ? copyScroll : 0 }}>
                <m.div className="hero-kicker" initial={reducedMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0 : 0.6, ease: studioEase }}><span className="hero-kicker-symbol" aria-hidden="true"><ServiceIcon name="spark" /></span><p>{c('hero.label')}</p></m.div>
                <h1 id="hero-heading" className="hero-title" aria-label={`${c('hero.heading')} ${c('hero.lead')} ${c('hero.emphasis')}`.replace(/\s+/g, ' ').trim()}>{headline.map((line, index) => <span key={line.text} className={`text-reveal-line ${index === 1 ? 'hero-impact-line' : ''}`}><m.span initial={reducedMotion ? false : { y: '115%', rotateX: -35, skewY: 3, opacity: 0 }} animate={{ y: 0, rotateX: 0, skewY: 0, opacity: 1 }} transition={{ duration: reducedMotion ? 0 : 0.95, delay: reducedMotion ? 0 : 0.12 + index * 0.13, ease: studioEase }}>{line.text}{line.emphasis && <> <span className="hero-highlight">{line.emphasis}</span></>}</m.span>{index === 1 && <svg className="hero-impact-stroke" viewBox="0 0 420 18" preserveAspectRatio="none" fill="none" aria-hidden="true"><m.path d="M3 11C106 1 264 2 416 9M70 16C189 9 301 10 367 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" initial={reducedMotion ? false : { pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: reducedMotion ? 0 : 0.85, delay: reducedMotion ? 0 : 0.75, ease: studioEase }} /></svg>}</span>)}</h1>
                <m.div initial={reducedMotion ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0 : 0.75, delay: reducedMotion ? 0 : 0.5, ease: studioEase }}>
                    <p className="hero-description"><ContentLines text={c('hero.description')} /></p>
                    <div className="hero-actions"><Link className="button-primary hero-primary" href={siteRoutes.services}><span>{c('hero.primary')}</span><span className="hero-button-arrow"><Arrow diagonal /></span></Link>{reel.length > 0 && <ActionButton className="hero-showreel" type="button" aria-label={c('hero.secondary')} aria-haspopup="dialog" onClick={() => setReelOpen(true)}><span className="hero-play" aria-hidden="true"><svg viewBox="0 0 16 16" fill="none"><path d="m6 4 6 4-6 4V4Z" fill="currentColor" /></svg></span><span>{c('hero.secondary')}<span className="hero-reel-caption">A glimpse of our thinking</span></span></ActionButton>}</div>
                    <div className="hero-disciplines"><span>STRATEGY</span><i aria-hidden="true" /><span>DESIGN</span><i aria-hidden="true" /><span>ENGINEERING</span></div>
                </m.div>
            </m.div>
            <m.div className="hero-visual" {...(interactive ? handlers : {})} initial={reducedMotion ? false : { opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0 : 1, delay: reducedMotion ? 0 : 0.18, ease: studioEase }}>
                <div className="hero-visual-surface" aria-hidden="true"><span className="hero-surface-grid" /><span className="hero-surface-disc" /></div>
                <div className="hero-art-heading" aria-hidden="true"><span>SMARTIFY / THE IDEA LAB</span><span>01 — EXPLORATION</span></div>
                <ThreeHologram enabled={effectsEnabled} /><HeroAtmosphere active={active} />
                <m.div className="robot-image-wrap" style={{ y: interactive ? robotScroll : 0, rotateY: interactive ? visualRotate : 0, scale: interactive ? visualScale : 1 }}>
                    <m.div className="robot-depth" style={interactive ? tiltStyle : { x: 0, y: 0, rotateX: 0, rotateY: 0 }}><AmbientFloat active={active}><img className="robot-image" src={c('hero.image')} srcSet={c('hero.image') === '/images/brand/ai-robot-1120.webp' ? '/images/brand/ai-robot-640.webp 640w, /images/brand/ai-robot-1120.webp 1120w' : undefined} sizes="(max-width: 767px) 94vw, (max-width: 959px) 48vw, 49vw" width="1120" height="1400" fetchPriority="high" alt={c('hero.image_alt')} /></AmbientFloat></m.div>
                </m.div>
                <m.div className="hero-foreground" style={interactive ? { x: foregroundX, y: foregroundY } : { x: 0, y: 0 }}>
                    <m.div className="hero-service-chip hero-service-chip-design" initial={reducedMotion ? false : { opacity: 0, y: 30, rotate: 8 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: reducedMotion ? 0 : 0.8, delay: reducedMotion ? 0 : 0.7, ease: studioEase }}><Link href={serviceRoutes['ui-ux-design'] || siteRoutes.services} aria-label="Explore UI / UX Design"><span className="hero-chip-icon"><ServiceIcon name="design" /></span><span><small>DESIGNED AROUND PEOPLE</small><strong>UI / UX Design</strong></span><Arrow diagonal /></Link></m.div>
                    <m.div className="hero-service-chip hero-service-chip-code" initial={reducedMotion ? false : { opacity: 0, x: -35, rotate: -8 }} animate={{ opacity: 1, x: 0, rotate: 0 }} transition={{ duration: reducedMotion ? 0 : 0.8, delay: reducedMotion ? 0 : 0.85, ease: studioEase }}><Link href={serviceRoutes['web-development'] || siteRoutes.services} aria-label="Explore Web Development"><span className="hero-chip-icon"><ServiceIcon name="code" /></span><span><small>BUILT WITH INTENTION</small><strong>Web Development</strong></span><Arrow diagonal /></Link></m.div>
                </m.div>
                <m.div className="hero-idea-note" style={{ y: interactive ? panelScroll : 0 }} initial={reducedMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reducedMotion ? 0 : 0.7, delay: reducedMotion ? 0 : 0.9 }} aria-hidden="true"><span className="hero-idea-signal"><i /><i /><i /><i /><i /></span><span>FROM WHAT IF.<br /><strong>TO WHAT’S NEXT.</strong></span></m.div>
                <span className="visual-coordinate" aria-hidden="true"><i /> HUMAN IDEAS. DIGITAL POSSIBILITIES.</span>
            </m.div>
        </div>
        <div className="hero-bottom page-shell"><p><span className="hero-bottom-index">01 /</span> {c('hero.closing')}</p><button type="button" className="hero-motion-toggle" disabled={reducedMotion} aria-label={reducedMotion ? 'Reduced-motion preference is enabled' : effectsEnabled ? 'Pause hero effects' : 'Resume hero effects'} aria-pressed={effectsEnabled && !reducedMotion} onClick={() => setEffectsEnabled(!effectsEnabled)}><span aria-hidden="true">{reducedMotion ? '—' : effectsEnabled ? 'Ⅱ' : '▷'}</span>{reducedMotion ? 'Reduced motion' : effectsEnabled ? 'Pause effects' : 'Resume effects'}</button><a href="#services" className="scroll-link">SCROLL TO EXPLORE <span aria-hidden="true">↓</span></a></div>
        <Showreel open={reelOpen} onClose={() => setReelOpen(false)} />
    </section>;
}
