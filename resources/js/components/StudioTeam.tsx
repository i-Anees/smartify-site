import { useRef } from 'react';
import { Link } from '@inertiajs/react';
import { m, useScroll, useTransform } from 'motion/react';
import { useCopy, useSite, type TeamMember } from '../content';
import { Arrow } from './Icons';
import { Reveal } from './StudioMotion';
import { usePointerMotion } from './useStudioMotion';

function PortraitCard({ member, index }: { member?: TeamMember; index: number }) {
    const target = useRef<HTMLDivElement>(null);
    const { canHover, reducedMotion, tiltStyle, handlers } = usePointerMotion(4);
    const { scrollYProgress } = useScroll({ target, offset: ['start end', 'end start'] });
    const y = useTransform(scrollYProgress, [0, 0.5, 1], [index % 2 ? 35 : 55, 0, -20]);
    const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [index % 2 ? -8 : 8, 0, 0]);
    return <div ref={target} className="portrait-card-anchor"><m.article className="portrait-card" data-studio-reveal="" initial={reducedMotion ? false : { opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: reducedMotion ? 0 : 0.7, delay: canHover ? index % 3 * 0.08 : 0 }} style={canHover ? { y, rotateY, transformPerspective: 1400 } : undefined}>
        <m.div className="portrait-frame" {...handlers} style={tiltStyle}>
            {member?.portrait ? <img src={member.portrait} alt={`Portrait of ${member.name}`} style={{ objectPosition: `50% ${member.portraitFocus ?? 35}%` }} loading="lazy" decoding="async" width="640" height="800" /> : <div className="portrait-awaiting"><svg viewBox="0 0 240 300" fill="none" aria-hidden="true"><path d="M28 290c0-65 38-100 92-100s92 35 92 100" fill="currentColor" opacity=".06" /><ellipse cx="120" cy="122" rx="51" ry="64" fill="currentColor" opacity=".08" /><path d="M18 45V18h27M195 18h27v27M222 255v27h-27M45 282H18v-27" stroke="currentColor" strokeWidth=".6" opacity=".25" /></svg><span>TEAM PORTRAIT / COMING SOON</span></div>}
            <span className="portrait-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            {member?.linkedin && <a className="portrait-social" href={member.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} on LinkedIn (opens in a new tab)`}>in <Arrow diagonal /></a>}
        </m.div>
        <div className="portrait-copy"><div><h3>{member?.name ?? 'A real person. A distinct perspective.'}</h3><p className="portrait-role">{member?.role ?? 'Team introduction coming soon'}</p></div>{member?.bio && <p className="portrait-bio">{member.bio}</p>}</div>
    </m.article></div>;
}

export default function StudioTeam() {
    const c = useCopy();
    const { siteRoutes, siteContent: { team } } = useSite();
    return <section className="studio-team portrait-team page-shell" id="team" aria-labelledby="team-heading"><div className="section-heading"><Reveal><p className="eyebrow">{c('team.label')}</p><h2 id="team-heading">{c('team.heading')}<br /><em>{c('team.emphasis')}</em></h2></Reveal><Reveal delay={0.1}><p className="team-introduction">{c('team.description')}</p></Reveal></div><div className="portrait-grid">{team.length ? team.map((member, index) => <PortraitCard key={member.id ?? member.name} member={member} index={index} />) : [0, 1, 2].map((index) => <PortraitCard key={index} index={index} />)}</div><div className="team-section-bottom">{!team.length && <p>{c('team.empty')}</p>}<Link href={siteRoutes.about} className="text-link">Get to know the studio <Arrow /></Link></div></section>;
}
