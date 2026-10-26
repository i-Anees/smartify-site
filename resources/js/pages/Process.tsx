import { useCopy, useSite } from '../content';
import ContentLines from '../components/ContentLines';
import { Link } from '@inertiajs/react';
import SiteLayout from '../components/SiteLayout';
import { Reveal } from '../components/StudioMotion';
import { Arrow, ServiceIcon, WaveLines } from '../components/Icons';

export default function Process() {
    const c = useCopy();
    const { siteRoutes, siteContent: { process: processSteps } } = useSite();
    return <SiteLayout title="Our Creative Process"><section className="process-page page-shell"><div className="process-copy"><Reveal><p className="eyebrow">{c('process.label')}</p><h1>{c('process.heading')}<br /><em>{c('process.emphasis')}</em></h1><p className="intro-description">{c('process.description')}</p></Reveal><ol className="process-timeline">{processSteps.map((step, index) => <li key={step.title}><Reveal distance={24}><span className="step-symbol"><ServiceIcon name={step.icon || ['eye','spark','design','code','check'][index % 5]} /></span><div><span className="step-index">0{index + 1}</span><h2>{step.title}</h2><p>{step.description}</p><p className="step-outcome">{step.outcome}</p></div></Reveal></li>)}</ol></div><Reveal className="process-art" direction="right" distance={30}><img src={c('images.office')} width="1120" height="1400" alt={c('images.office_alt')} /><div className="process-art-label"><ServiceIcon name="spark" /><span>{c('process.art_heading')}<br /><strong>{c('process.art_emphasis')}</strong></span></div><span className="image-caption">{c('images.office_caption')}</span><WaveLines /></Reveal></section><section className="page-shell closing-note"><Reveal><h2>{c('process.closing_heading')}<br /><em>{c('process.closing_emphasis')}</em></h2></Reveal><Reveal delay={0.1}><Link href={siteRoutes.contact} className="button-primary">Start your project <Arrow /></Link></Reveal></section></SiteLayout>;
}
