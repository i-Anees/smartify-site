import { useCopy, useSite } from '../content';
import ContentLines from '../components/ContentLines';
import SiteLayout from '../components/SiteLayout';
import InquiryForm from '../components/InquiryForm';
import { ServiceIcon, WaveLines } from '../components/Icons';
import { Reveal } from '../components/StudioMotion';

export default function Contact() {
    const c = useCopy();
    const { contactEmail } = useSite();
    return <SiteLayout title="Contact Smartify"><section className="contact-page"><img className="contact-background" src={c('images.office')} width="1120" height="1400" alt="" /><div className="page-shell contact-layout"><div className="contact-copy"><Reveal distance={28}><p className="eyebrow">{c('contact.label')}</p><h1><ContentLines text={c('contact.heading')} /> <em>{c('contact.emphasis')}</em></h1><p className="intro-description">{c('contact.description')}</p></Reveal><div className="contact-details"><Reveal delay={0.04} distance={20}><ServiceIcon name="mail" /><div><h2>Project inquiries</h2>{contactEmail ? <a href={`mailto:${contactEmail}`}>{contactEmail}</a> : <p>Start by shaping your project brief.</p>}</div></Reveal><Reveal delay={0.1} distance={20}><ServiceIcon name="spark" /><div><h2>{c('contact.location_heading')}</h2><p>{c('contact.location_description')}</p></div></Reveal><Reveal delay={0.16} distance={20}><ServiceIcon name="eye" /><div><h2>{c('contact.conversation_heading')}</h2><p>{c('contact.conversation_description')}</p></div></Reveal></div></div><Reveal delay={0.1} direction="right" distance={28}><InquiryForm contactEmail={contactEmail} /></Reveal></div><WaveLines /></section></SiteLayout>;
}
