import { Link } from '@inertiajs/react';
import { m } from 'motion/react';
import SiteLayout, { Breadcrumb } from '../components/SiteLayout';
import { Arrow, ServiceIcon, WaveLines } from '../components/Icons';
import { Reveal, scrollReveal } from '../components/StudioMotion';
import { useStudioMotion } from '../components/useStudioMotion';
import { artworkFor, useSite } from '../content';

export default function ServiceDetail() {
    const { serviceSlug, siteRoutes, serviceRoutes, siteContent: { services } } = useSite();
    const { reducedMotion } = useStudioMotion();
    const service = services.find((item) => item.slug === serviceSlug)!;
    const artwork = artworkFor(service);

    return <SiteLayout title={service.title}>
        <section className="service-detail-hero"><div className="page-shell">
            <Breadcrumb current={service.title} />
            <div className="service-detail-grid">
                <div>
                    <Reveal distance={28}><p className="eyebrow">{service.title.toUpperCase()}</p><h1>{service.heading}</h1><p className="intro-description">{service.description}</p></Reveal>
                    <ul className="feature-list">{service.features.map((feature, index) => <m.li key={feature} {...scrollReveal(reducedMotion, { delay: index * 0.06, distance: 18 })}><span><ServiceIcon name="check" /></span>{feature}</m.li>)}</ul>
                    <Reveal distance={18}><Link className="button-primary" href={siteRoutes.contact}>Let’s talk about your project <Arrow /></Link></Reveal>
                </div>
                <Reveal className="service-detail-image" direction="right" distance={30} delay={0.1}>
                    <img src={artwork.image} srcSet={artwork.small ? `${artwork.small} 640w, ${artwork.image} ${artwork.width}w` : undefined} sizes="(max-width: 767px) 100vw, 50vw" alt={artwork.alt} width={artwork.width} height={artwork.height} />
                    <div className="floating-tech"><ServiceIcon name={service.icon} /></div>
                </Reveal>
            </div>
        </div><WaveLines /></section>
        <section className="page-shell toolkit">
            <m.h2 {...scrollReveal(reducedMotion)}>{service.slug === 'web-development' ? 'Technologies we work with' : 'A considered toolkit'}</m.h2>
            <div>{service.tools.map((tool, index) => <m.span key={tool} {...scrollReveal(reducedMotion, { delay: index * 0.05, distance: 16 })}>{tool}</m.span>)}</div>
        </section>
        <section className="page-shell related-services">
            <div className="section-heading"><Reveal><p className="eyebrow">BETTER TOGETHER</p><h2>Connect the possibilities.</h2></Reveal><Reveal delay={0.1}><Link href={siteRoutes.services} className="text-link">All services <Arrow /></Link></Reveal></div>
            <div className="related-grid">{services.filter((item) => item.slug !== service.slug).slice(0, 3).map((item, index) => <Reveal key={item.slug} delay={index * 0.08} distance={26}><Link href={serviceRoutes[item.slug]}><ServiceIcon name={item.icon} /><h3>{item.title}</h3><p>{item.short}</p><Arrow /></Link></Reveal>)}</div>
        </section>
    </SiteLayout>;
}
