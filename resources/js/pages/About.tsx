import { useCopy, useSite } from '../content';
import ContentLines from '../components/ContentLines';
import { Link } from '@inertiajs/react';
import { m } from 'motion/react';
import SiteLayout from '../components/SiteLayout';
import PageIntro from '../components/PageIntro';
import StudioTeam from '../components/StudioTeam';
import { Reveal, scrollReveal } from '../components/StudioMotion';
import { useStudioMotion } from '../components/useStudioMotion';
import { Arrow, ServiceIcon } from '../components/Icons';

export default function About() {
    const c = useCopy();
    const { siteRoutes } = useSite();
    const { reducedMotion } = useStudioMotion();
    return <SiteLayout title="About Smartify"><PageIntro label={c('about.label')} title={<><ContentLines text={c('about.heading')} /><br /><em>{c('about.emphasis')}</em></>} description={c('about.description')} image="office"><Link className="button-primary" href="#our-story">Our Story <Arrow /></Link></PageIntro>
        <section id="our-story" className="page-shell values-section"><div className="section-heading"><Reveal><p className="eyebrow">{c('about.story_label')}</p><h2>{c('about.story_heading')}<br /><em>{c('about.story_emphasis')}</em></h2></Reveal><m.p {...scrollReveal(reducedMotion, { delay: 0.1 })}>{c('about.story_description')}</m.p></div><div className="values-grid">{[['eye',c('about.vision_title'),c('about.vision')],['spark',c('about.mission_title'),c('about.mission')],['brand',c('about.values_title'),c('about.values')]].map(([icon,title,description], index) => <Reveal key={title} delay={index * 0.08}><ServiceIcon name={icon} /><h3>{title}</h3><p>{description}</p></Reveal>)}</div></section>
        <section className="principles-band"><div className="page-shell">{[[c('about.principle_1_title'),c('about.principle_1')],[c('about.principle_2_title'),c('about.principle_2')],[c('about.principle_3_title'),c('about.principle_3')]].map(([title, description], index) => <Reveal key={title} delay={index * 0.08}><span>0{index + 1}</span><h3>{title}</h3><p>{description}</p></Reveal>)}</div></section>
        <StudioTeam /><section className="page-shell closing-note"><Reveal><h2><ContentLines text={c('about.closing')} /></h2></Reveal><Reveal delay={0.1}><Link className="button-primary" href={siteRoutes.process}>Explore our process <Arrow /></Link></Reveal></section>
    </SiteLayout>;
}
