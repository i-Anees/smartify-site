import { useCopy, useSite } from '../content';
import ContentLines from './ContentLines';
import { m } from 'motion/react';
import { useStudioMotion } from './useStudioMotion';
import { Link } from '@inertiajs/react';
import { Arrow, WaveLines } from './Icons';
import { Reveal, TextLines, scrollReveal } from './StudioMotion';

export type SocialLink = { name: string; url: string };

export default function Footer({ contactEmail, socialLinks }: { contactEmail: string | null; socialLinks: SocialLink[] }) {
    const c = useCopy();
    const { siteRoutes, serviceRoutes, siteContent: { services } } = useSite();
    const { reducedMotion } = useStudioMotion();
    return <footer id="contact" className="site-footer" aria-labelledby="footer-heading">
        <WaveLines className="footer-wave" />
        <div className="page-shell footer-invitation"><div><p className="eyebrow">{c('footer.label')}</p><h2 id="footer-heading" aria-label={`${c('footer.heading')} ${c('footer.emphasis')}`}><TextLines lines={[{ text: c('footer.heading') }, { text: c('footer.emphasis'), className: 'footer-highlight' }]} /></h2></div><Reveal className="footer-cta-block"><Link className="button-primary footer-contact-button" href={siteRoutes.contact}>{c('footer.cta')} <Arrow diagonal /></Link></Reveal></div>
        <div className="page-shell footer-main">
            <m.div className="footer-brand-column" {...scrollReveal(reducedMotion, { distance: 22 })}><Link href={siteRoutes.home} className="brand-link"><img src="/images/brand/smartify-logo.png" width="1447" height="1087" alt="" /><span className="brand-name">SMARTIFY<span>SOLUTIONS</span></span></Link><p><ContentLines text={c('footer.description')} /></p><span className="footer-brand-caption">CREATIVE TECHNOLOGY STUDIO</span></m.div>
            <m.nav {...scrollReveal(reducedMotion, { delay: 0.06, distance: 22 })} aria-label="Explore Smartify" className="footer-link-column"><h3>Explore</h3><Link href={siteRoutes.about}>About us</Link><Link href={siteRoutes.projects}>Our work</Link><Link href={siteRoutes.process}>Our process</Link><Link href={siteRoutes.testimonials}>Client stories</Link></m.nav>
            <m.nav {...scrollReveal(reducedMotion, { delay: 0.12, distance: 22 })} aria-label="Footer services" className="footer-link-column"><h3>Our expertise</h3>{services.map((service) => <Link key={service.slug} href={serviceRoutes[service.slug]}>{service.title}</Link>)}</m.nav>
            <m.div className="footer-connect footer-link-column" {...scrollReveal(reducedMotion, { delay: 0.18, distance: 22 })}><h3>Start a conversation</h3><p><ContentLines text={c('footer.invitation')} /></p>{contactEmail && <a className="footer-email" href={`mailto:${contactEmail}`}>{contactEmail}</a>}<Link href={siteRoutes.contact} className="footer-start-link">Start a project <Arrow diagonal /></Link>{socialLinks.length > 0 && <nav aria-label="Social profiles" className="footer-socials">{socialLinks.map((link) => <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer">{link.name}<Arrow diagonal /><span className="sr-only"> (opens in a new tab)</span></a>)}</nav>}</m.div>
        </div>
        <m.div className="page-shell footer-colophon" {...scrollReveal(reducedMotion, { distance: 12 })}><p>© {new Date().getFullYear()} Smartify Solutions.</p><p>{c('footer.colophon')}</p><a href="#top">Back to top <span aria-hidden="true">↑</span></a></m.div>
    </footer>;
}
