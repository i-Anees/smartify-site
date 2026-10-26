import { useCopy, useSite } from '../content';
import ContentLines from '../components/ContentLines';
import { Link } from '@inertiajs/react';
import SiteLayout from '../components/SiteLayout';
import Hero from '../components/Hero';
import SelectedWork from '../components/SelectedWork';
import StudioTeam from '../components/StudioTeam';
import ClientStories from '../components/ClientStories';
import ExpertiseShowcase from '../components/ExpertiseShowcase';
import { Reveal } from '../components/StudioMotion';
import { Arrow } from '../components/Icons';

export default function Home() {
    const c = useCopy();
    const { siteRoutes } = useSite();
    return <SiteLayout title="Transforming Ideas into Real Impact"><div className="homepage"><Hero /><section className="home-studio-note page-shell" aria-labelledby="studio-note-heading"><p className="eyebrow">{c('home.label')}</p><Reveal><h2 id="studio-note-heading">{c('home.heading')}<br /><em>{c('home.emphasis')}</em></h2></Reveal><Reveal delay={0.06}><p>{c('home.description')}</p><Link className="text-link" href={siteRoutes.about}>About Smartify <Arrow /></Link></Reveal></section><ExpertiseShowcase /><SelectedWork /><StudioTeam /><ClientStories /></div></SiteLayout>;
}
