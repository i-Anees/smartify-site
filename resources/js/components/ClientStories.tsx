import { useCopy, useSite } from '../content';
import ContentLines from './ContentLines';
import { useRef, useState } from 'react';
import { Link } from '@inertiajs/react';
import { AnimatePresence, m, useScroll, useTransform } from 'motion/react';
import { Arrow } from './Icons';
import { Reveal } from './StudioMotion';
import { studioEase, useStudioMotion } from './useStudioMotion';

export default function ClientStories({ fullPage = false }: { fullPage?: boolean }) {
    const c = useCopy();
    const target = useRef<HTMLElement>(null);
    const [active, setActive] = useState(0);
    const { siteRoutes, siteContent: { testimonials: clientStories } } = useSite();
    const { canHover, reducedMotion } = useStudioMotion();
    const { scrollYProgress } = useScroll({ target, offset: ['start end', 'end start'] });
    const rotate = useTransform(scrollYProgress, [0, 1], [-16, 16]);
    const rotateBack = useTransform(scrollYProgress, [0, 1], [14, -12]);
    const y = useTransform(scrollYProgress, [0, 1], [95, -65]);
    const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [-24, 0, 16]);
    const quote = clientStories[active];

    return <section ref={target} id="testimonials" className={`client-stories page-shell ${fullPage ? 'client-stories-full' : ''}`} aria-labelledby="client-stories-heading">
        <div className="client-story-heading"><Reveal><p className="eyebrow">{c('stories.label')}</p><>{fullPage ? <h1 id="client-stories-heading">{c('stories.page_heading')}<br /><em>{c('stories.page_emphasis')}</em></h1> : <h2 id="client-stories-heading">{c('stories.heading')}<br /><em>{c('stories.emphasis')}</em></h2>}</><p><ContentLines text={c('stories.description')} /></p></Reveal><Reveal delay={0.1}><Link href={siteRoutes.contact} className="text-link">Start our next conversation <Arrow diagonal /></Link></Reveal></div>
        <div className="client-story-stage">
            <m.div className="story-backplate story-backplate-one" aria-hidden="true" style={canHover ? { rotate, y } : undefined} />
            <m.div className="story-backplate story-backplate-two" aria-hidden="true" style={canHover ? { rotate: rotateBack } : undefined} />
            <m.div className="client-story-card" data-studio-reveal="" initial={reducedMotion ? false : { opacity: 0, y: 35, rotateX: 14 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: reducedMotion ? 0 : 0.8, ease: studioEase }} style={canHover ? { rotateY, transformPerspective: 1200 } : undefined}>
                <span className="client-quote-mark" aria-hidden="true">“</span>
                {quote ? <><div className="client-quote-live" aria-live="polite" aria-atomic="true"><AnimatePresence mode="wait" initial={false}><m.figure key={active} initial={reducedMotion ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: reducedMotion ? 0 : 0.35, ease: studioEase }}><blockquote>{quote.quote}</blockquote><figcaption><strong>{quote.name}</strong><span>{quote.role}{quote.company ? ` · ${quote.company}` : ''}</span></figcaption></m.figure></AnimatePresence></div>{clientStories.length > 1 && <div className="client-story-controls"><button type="button" onClick={() => setActive((active + clientStories.length - 1) % clientStories.length)} aria-label="Previous client story">←</button><span>{active + 1} / {clientStories.length}</span><button type="button" onClick={() => setActive((active + 1) % clientStories.length)} aria-label="Next client story">→</button></div>}</> : <><span className="client-story-status">A SPACE FOR REAL EXPERIENCES</span><h3><ContentLines text={c('stories.empty_heading')} /></h3><p>{c('stories.empty_description')}</p><Link href={siteRoutes.projects} className="text-link">Explore our thinking <Arrow /></Link><span className="client-story-placeholder">TESTIMONIALS / AWAITING APPROVED CONTENT</span></>}
            </m.div>
        </div>
    </section>;
}
