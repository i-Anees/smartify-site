import { useCopy, artworkFor, useSite } from '../content';
import ContentLines from './ContentLines';
import { useRef, useState } from 'react';
import { Link } from '@inertiajs/react';
import { AnimatePresence, m, useMotionValueEvent, useScroll, useTransform, type MotionValue } from 'motion/react';
import { Arrow } from './Icons';
import { Reveal } from './StudioMotion';
import { studioEase, usePointerMotion, useStudioMotion } from './useStudioMotion';

const treatments = [
    { name: 'THE DIGITAL FOLD', x: -110, y: 35, rx: 8, ry: -38, rz: -7, scale: 0.74 },
    { name: 'THE DEVICE LIFT', x: 25, y: 150, rx: 38, ry: -12, rz: 13, scale: 0.82 },
    { name: 'THE EXPERIENCE APERTURE', x: 90, y: 0, rx: 0, ry: 32, rz: 0, scale: 1.12 },
    { name: 'THE IDENTITY TURN', x: -35, y: 30, rx: 12, ry: -25, rz: -18, scale: 0.72 },
    { name: 'THE CAMPAIGN ZOOM', x: 0, y: -70, rx: -24, ry: 8, rz: 7, scale: 1.42 },
    { name: 'THE SYSTEM ASSEMBLY', x: 80, y: 80, rx: 25, ry: -32, rz: -9, scale: 0.66 },
];

function ServiceScene({ index, progress }: { index: number; progress: MotionValue<number> }) {
    const { siteContent: { services } } = useSite();
    const service = services[index];
    const artwork = artworkFor(service);
    const treatment = treatments[index % treatments.length];
    const center = (index + 0.5) / services.length;
    const radius = 0.7 / services.length;
    const range = [center - radius, center, center + radius];
    const opacity = useTransform(progress, [center - radius, center - radius * 0.38, center + radius * 0.38, center + radius], [index === 0 ? 1 : 0, 1, 1, index === services.length - 1 ? 1 : 0]);
    const x = useTransform(progress, range, [treatment.x, 0, -treatment.x * 0.5]);
    const y = useTransform(progress, range, [treatment.y, 0, -treatment.y * 0.6]);
    const rotateX = useTransform(progress, range, [treatment.rx, 0, -treatment.rx * 0.6]);
    const rotateY = useTransform(progress, range, [treatment.ry, 0, -treatment.ry * 0.6]);
    const rotateZ = useTransform(progress, range, [treatment.rz, 0, -treatment.rz * 0.6]);
    const scale = useTransform(progress, range, [treatment.scale, 1, 0.94]);
    const aperture = useTransform(progress, [center - radius, center - radius * 0.15, center + radius], ['circle(0% at 50% 50%)', 'circle(75% at 50% 50%)', 'circle(75% at 50% 50%)']);
    const shutter = useTransform(progress, [center - radius, center - radius * 0.15, center + radius], ['inset(45% 0% 45% 0%)', 'inset(0% 0% 0% 0%)', 'inset(0% 0% 0% 0%)']);
    const depth = useTransform(progress, range, [80, 0, -50]);

    return <m.div className={`service-scene service-scene-${index}`} style={{ opacity, zIndex: index + 1 }}>
        <m.div className="service-scene-object" style={{ x, y, rotateX, rotateY, rotateZ, scale, transformPerspective: 1100, clipPath: index === 2 ? aperture : index === 5 ? shutter : undefined }}>
            <span className="service-scene-backplate" />
            <img src={artwork.image} srcSet={artwork.small ? `${artwork.small} 640w, ${artwork.image} ${artwork.width}w` : undefined} sizes="55vw" width={artwork.width} height={artwork.height} alt="" loading="lazy" decoding="async" />
            <m.span className="service-depth-label" style={{ y: depth }}>0{index + 1}<span>{service.title.toUpperCase()}</span></m.span>
        </m.div>
    </m.div>;
}

export default function ExpertiseShowcase({ fullPage = false }: { fullPage?: boolean }) {
    const c = useCopy();
    const track = useRef<HTMLDivElement>(null);
    const [active, setActive] = useState(0);
    const activeIndex = useRef(0);
    const { serviceRoutes, siteRoutes, siteContent: { services } } = useSite();
    const { reducedMotion, canHover } = useStudioMotion();
    const { tiltStyle, handlers } = usePointerMotion(10);
    const { scrollYProgress } = useScroll({ target: track, offset: ['start center', 'end center'] });
    const rotation = useTransform(scrollYProgress, [0, 1], [-45, 135]);
    const counterRotation = useTransform(scrollYProgress, [0, 1], [30, -90]);
    useMotionValueEvent(scrollYProgress, 'change', (value) => {
        const next = Math.min(services.length - 1, Math.max(0, Math.floor(value * services.length)));
        if (activeIndex.current !== next) {
            activeIndex.current = next;
            setActive(next);
        }
    });

    return <section id="services" className="service-experience page-shell" aria-labelledby="expertise-heading">
        <div className="section-heading"><Reveal><p className="eyebrow">{fullPage ? 'THE CONNECTED EXPERTISE' : c('expertise.label')}</p><h2 id="expertise-heading">{c('expertise.heading')}<br /><em>{c('expertise.emphasis')}</em></h2></Reveal><Reveal delay={0.1}><Link href={fullPage ? siteRoutes.contact : siteRoutes.services} className="text-link">{fullPage ? 'Find your starting point' : 'Explore our services'} <Arrow /></Link></Reveal></div>
        <div ref={track} className={`service-story ${canHover ? 'is-scroll' : 'is-static'}`}>
            <div className="service-copy-track">{services.map((service, index) => {
                const artwork = artworkFor(service);
                return <article id={`expertise-${service.slug}`} className="service-chapter" key={service.slug}>
                    {!canHover && <m.div className="service-chapter-image" data-studio-reveal="" initial={reducedMotion ? false : { opacity: 0, y: 32, rotateY: index % 2 ? -14 : 14, scale: 0.94 }} whileInView={{ opacity: 1, y: 0, rotateY: 0, scale: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: reducedMotion ? 0 : 0.75, ease: studioEase }} style={{ transformPerspective: 850 }}><img src={artwork.small || artwork.image} width="640" height={Math.round(640 * artwork.height / artwork.width)} alt={artwork.alt} loading="lazy" /></m.div>}
                    <Reveal distance={canHover ? 55 : 20}>
                        <span className="service-chapter-number">0{index + 1}<span> / {treatments[index % treatments.length].name}</span></span>
                        <m.h3 initial={reducedMotion ? false : 'hidden'} whileInView="visible" viewport={{ once: true, amount: 0.6 }} aria-label={service.title}>{service.title.split(' ').map((word, wordIndex) => <span className="kinetic-word-mask" key={`${word}-${wordIndex}`}><m.span aria-hidden="true" variants={{ hidden: { y: '110%', rotateX: -70 }, visible: { y: 0, rotateX: 0 } }} transition={{ duration: reducedMotion ? 0 : 0.7, delay: reducedMotion ? 0 : wordIndex * 0.055, ease: studioEase }}>{word}&nbsp;</m.span></span>)}</m.h3>
                        <p>{service.description}</p>
                        <ul className="service-chapter-features">{service.features.slice(0, 3).map((feature) => <li key={feature}>{feature}</li>)}</ul>
                        <Link href={serviceRoutes[service.slug]} className="text-link">Explore {service.title} <Arrow diagonal /></Link>
                    </Reveal>
                </article>;
            })}</div>
            {canHover && services.length > 0 && <aside className="service-sticky-stage" aria-hidden="true">
                <div className="service-stage-topline"><span>SMARTIFY / EXPERTISE IN MOTION</span><span>{String(active + 1).padStart(2, '0')} — {String(services.length).padStart(2, '0')}</span></div>
                <m.div className="service-stage-perspective" {...handlers} style={tiltStyle}>
                    <m.span className="service-orbit service-orbit-one" style={{ rotate: rotation }} /><m.span className="service-orbit service-orbit-two" style={{ rotate: counterRotation }} />
                    {services.map((service, index) => <ServiceScene key={service.slug} index={index} progress={scrollYProgress} />)}
                    <span className="service-stage-cross cross-a">+</span><span className="service-stage-cross cross-b">+</span>
                </m.div>
                <div className="service-stage-caption"><AnimatePresence mode="wait" initial={false}><m.p key={active} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} transition={{ duration: 0.2 }}>{services[Math.min(active, services.length - 1)]?.short}</m.p></AnimatePresence><span>SCROLL TO TRANSFORM ↓</span></div>
                <div className="service-stage-progress"><m.span style={{ scaleX: scrollYProgress }} /></div>
            </aside>}
        </div>
    </section>;
}
