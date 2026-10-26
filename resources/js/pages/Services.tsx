import { useCopy, useSite } from '../content';
import ContentLines from '../components/ContentLines';
import { Link } from '@inertiajs/react';
import SiteLayout from '../components/SiteLayout';
import PageIntro from '../components/PageIntro';
import ExpertiseShowcase from '../components/ExpertiseShowcase';
import { Reveal } from '../components/StudioMotion';
import { Arrow } from '../components/Icons';

export default function Services() {
    const c = useCopy();
    const { siteRoutes } = useSite();
    return <SiteLayout title="Our Services"><PageIntro label={c('services.label')} title={<><ContentLines text={c('services.heading')} /><br /><em>{c('services.emphasis')}</em></>} description={c('services.description')} image="laptop" /><ExpertiseShowcase fullPage /><section className="page-shell closing-note"><Reveal><p className="eyebrow">{c('services.closing_label')}</p><h2>{c('services.closing_heading')}<br /><em>{c('services.closing_emphasis')}</em></h2></Reveal><Reveal delay={0.1}><Link className="button-primary" href={siteRoutes.contact}>Let’s find the right direction <Arrow /></Link></Reveal></section></SiteLayout>;
}
