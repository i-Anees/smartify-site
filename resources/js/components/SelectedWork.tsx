import { useCopy, useSite, type Project } from '../content';
import ContentLines from './ContentLines';
import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { m } from 'motion/react';
import { Arrow } from './Icons';
import Modal from './Modal';
import { Reveal, SectionRule } from './StudioMotion';
import { studioEase, usePointerMotion } from './useStudioMotion';
import ScrollTransform from './ScrollTransform';

function ProjectPlate({ project, index, onSelect }: { project: Project; index: number; onSelect: (project: Project) => void }) {
    const { reducedMotion, canHover, style, handlers } = usePointerMotion(8);
    return <m.article className={`project-plate project-${index + 1}`} initial={reducedMotion ? false : { y: canHover ? 64 : 28, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: reducedMotion ? 0 : 0.95, delay: reducedMotion ? 0 : index * 0.1, ease: studioEase }}>
        <m.button type="button" className="project-open group" aria-haspopup="dialog" onClick={() => onSelect(project)} aria-label={`Explore ${project.subtitle}, ${project.concept ? 'a studio concept' : 'a selected project'}`}
            initial={false} animate="rest" whileHover={canHover ? 'engaged' : undefined} whileFocus={reducedMotion ? undefined : 'engaged'}>
            <div className="project-image-wrap" {...handlers}>
                <ScrollTransform image>
                <m.div className="project-artwork" style={style}>
                    <m.img src={project.image} alt={project.alt} width={index === 0 ? 1600 : 1200} height={index === 0 ? 1100 : 1400} loading="lazy" decoding="async"
                        variants={{ rest: { scale: canHover ? 1.025 : 1 }, engaged: { scale: canHover ? 1.09 : 1 } }} transition={{ duration: reducedMotion ? 0 : 0.95, delay: reducedMotion ? 0 : index * 0.1, ease: studioEase }} />
                </m.div>
                </ScrollTransform>
                <span className="concept-badge">{project.concept ? 'STUDIO CONCEPT' : 'SELECTED WORK'} / {String(index + 1).padStart(2, '0')}</span>
                <m.span className="project-view" aria-hidden="true" variants={{ rest: { y: canHover ? 65 : 0, opacity: canHover ? 0 : 1 }, engaged: { y: 0, opacity: 1 } }} transition={{ duration: reducedMotion ? 0 : 0.25, ease: studioEase }}><Arrow diagonal /></m.span>
                <m.span className="project-focus-line" aria-hidden="true" variants={{ rest: { scaleX: 0 }, engaged: { scaleX: 1 } }} transition={{ duration: reducedMotion ? 0 : 0.35, ease: studioEase }} />
            </div>
            <div className="project-meta"><span>{project.category}</span><span>{String(index + 1).padStart(2, '0')} — {project.concept ? 'EXPLORATION' : 'PROJECT'}</span></div>
            <h3>{project.title}</h3>
            <p className="project-subtitle">{project.subtitle}<Arrow diagonal /></p>
        </m.button>
    </m.article>;
}

export default function SelectedWork({ fullPage = false }: { fullPage?: boolean }) {
    const c = useCopy();
    const [selected, setSelected] = useState<Project | null>(null);
    const [filter, setFilter] = useState('All');
    const { siteRoutes, siteContent: { projects } } = useSite();
    const visibleProjects = projects.filter((project) => filter === 'All' || project.category === filter);

    return <section id="work" className={`selected-work page-shell ${fullPage ? 'full-projects' : ''}`} aria-labelledby="work-heading">
        {!fullPage && <div className="section-overline flex items-center justify-between"><span className="eyebrow">{c('work.label')}</span><span className="eyebrow hidden sm:block">A LITTLE OF HOW WE THINK</span><SectionRule /></div>}
        {fullPage ? <h2 id="work-heading" className="sr-only">Selected projects</h2> : <Reveal className="work-heading-grid">
            <h2 id="work-heading">{c('work.heading')}<br /><span className="text-muted">{c('work.emphasis')}</span></h2>
            <p><ContentLines text={c('work.description')} /></p>
        </Reveal>}
        {fullPage && <div className="project-filters" role="group" aria-label="Filter projects">{['All', ...new Set(projects.map((project) => project.category))].map((category) => <button key={category} type="button" aria-pressed={filter === category} onClick={() => setFilter(category)}>{category}</button>)}<p role="status">Showing {visibleProjects.length} {visibleProjects.length === 1 ? 'project' : 'projects'}</p></div>}
        <div className="work-grid">
            {visibleProjects.map((project) => <ProjectPlate key={project.id} project={project} index={projects.indexOf(project)} onSelect={setSelected} />)}
        </div>
        <div className="work-closing"><span className="signal-dot" />{projects.every((project) => project.concept) && <p>{c('work.note')}</p>}<Link href={fullPage ? siteRoutes.contact : siteRoutes.projects} className="text-link">{fullPage ? 'Imagine what’s next' : 'Explore our work'}<Arrow /></Link></div>
        <Modal open={selected !== null} onClose={() => setSelected(null)} titleId="project-dialog-title" className="project-dialog">
            {selected && <>
                <p className="eyebrow mb-5">{selected.concept ? 'STUDIO CONCEPT' : 'SELECTED WORK'} / {selected.subtitle}</p>
                <h2 id="project-dialog-title" className="dialog-title">{selected.title}</h2>
                <p className="text-muted mt-5 mb-8 leading-relaxed">{selected.description}</p>
                <img className="project-dialog-image" src={selected.image} alt={selected.alt} />
                <p className="text-muted text-sm mt-6">{selected.disciplines}</p>
                {selected.concept && <p className="text-muted text-sm mt-3">Self-initiated exploration. No client affiliation or performance results are claimed.</p>}
            </>}
        </Modal>
    </section>;
}
