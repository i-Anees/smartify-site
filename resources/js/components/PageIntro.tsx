import { useCopy } from '../content';
import ContentLines from './ContentLines';
import type { ReactNode } from 'react';
import { Reveal } from './StudioMotion';
import { WaveLines } from './Icons';

export default function PageIntro({ label, title, description, image, children }: { label: string; title: ReactNode; description: string; image?: 'office' | 'laptop'; children?: ReactNode }) {
    const c = useCopy();
    const office = image === 'office';
    return <section className={`page-intro ${image ? 'with-visual' : 'without-visual'}`}><div className="page-shell page-intro-grid">
        <div className="page-intro-copy"><Reveal distance={28}><p className="eyebrow">{label}</p><h1>{title}</h1></Reveal><Reveal className="page-intro-support" delay={0.12} distance={22}><p className="intro-description"><ContentLines text={description} /></p>{children}</Reveal></div>
        {image && <Reveal className="page-intro-visual" direction="right" distance={32} delay={0.12}><img src={c(office ? 'images.office' : 'images.laptop')}  sizes="(max-width: 767px) 100vw, 50vw" width={office ? 1120 : 1280} height={office ? 1400 : 960} alt={c(office ? 'images.office_alt' : 'images.laptop_alt')} /><span className="image-caption">{c(office ? 'images.office_caption' : 'images.laptop_caption')}</span></Reveal>}
    </div><WaveLines /></section>;
}
