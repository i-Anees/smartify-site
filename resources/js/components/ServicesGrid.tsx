import { Link } from '@inertiajs/react';
import { m } from 'motion/react';
import { artworkFor, useSite } from '../content';
import { Arrow, ServiceIcon } from './Icons';
import { Reveal } from './StudioMotion';
import { studioEase, useStudioMotion } from './useStudioMotion';
import ScrollTransform from './ScrollTransform';

export default function ServicesGrid({ compact = false }: { compact?: boolean }) {
    const { serviceRoutes, siteRoutes, siteContent: { services } } = useSite();
    const { reducedMotion, canHover } = useStudioMotion();
    return <section id="services" className="services-section page-shell" aria-labelledby="services-heading">
        {compact && <div className="section-heading"><div><p className="eyebrow">WHAT WE DO</p><h2 id="services-heading">Ideas, designed.<br /><em>Possibilities, engineered.</em></h2></div><Link className="text-link" href={siteRoutes.services}>Explore all services <Arrow /></Link></div>}
        {!compact && <h2 id="services-heading" className="sr-only">Our services</h2>}
        <div className="services-grid">{services.map((service, index) => {
            const artwork = artworkFor(service);
            return <Reveal key={service.slug} delay={canHover ? index % 3 * 0.11 : 0}>
                <ScrollTransform>
                <m.div className="service-motion" initial="rest" animate="rest" whileHover={canHover ? 'engaged' : undefined}>
                    <m.div className="service-surface" variants={{ rest: { y: 0, rotateX: 0, rotateY: 0 }, engaged: { y: -10, rotateX: 3, rotateY: -3 } }} transition={{ duration: reducedMotion ? 0 : 0.45, ease: studioEase }}>
                    <Link className="service-card" href={serviceRoutes[service.slug]}>
                        <div className="service-artwork"><m.img src={artwork.image} srcSet={artwork.small ? `${artwork.small} 640w, ${artwork.image} ${artwork.width}w` : undefined} sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 959px) 48vw, 32vw" alt={artwork.alt} width={artwork.width} height={artwork.height} loading="lazy" decoding="async" variants={{ rest: { scale: 1 }, engaged: { scale: 1.08 } }} transition={{ duration: reducedMotion ? 0 : 0.65, ease: studioEase }} /><span className="service-card-index">0{index + 1} / EXPERTISE</span></div>
                        <div className="service-card-content"><span className="service-title-row"><ServiceIcon name={service.icon} /><h3>{service.title}</h3></span><p>{service.description}</p><span className="service-card-bottom"><span>Explore service</span><m.span variants={{ rest: { x: 0 }, engaged: { x: 4 } }} transition={{ duration: reducedMotion ? 0 : 0.2 }}><Arrow /></m.span></span></div>
                    </Link>
                    </m.div>
                </m.div>
                </ScrollTransform>
            </Reveal>;
        })}</div>
    </section>;
}
