import { useSite, useCopy } from '../content';
import { useState, type FormEvent } from 'react';
import { ActionButton } from './StudioMotion';
import { Arrow } from './Icons';

export default function InquiryForm({ contactEmail }: { contactEmail: string | null }) {
    const { siteContent: { services } } = useSite();
    const c = useCopy();
    const [status, setStatus] = useState('');
    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const brief = `SMARTIFY SOLUTIONS — PROJECT INQUIRY\n\nName: ${data.get('name')}\nEmail: ${data.get('email')}\nInterested in: ${data.get('service')}\n\n${data.get('message')}`;
        if (contactEmail) {
            window.location.href = `mailto:${encodeURIComponent(contactEmail)}?subject=${encodeURIComponent('Let’s build something great together')}&body=${encodeURIComponent(brief)}`;
            setStatus('We’ve asked your email app to open a draft. Review and send it there to complete your inquiry.');
        } else {
            const url = URL.createObjectURL(new Blob([brief], { type: 'text/plain;charset=utf-8' }));
            const link = document.createElement('a');
            link.href = url; link.download = 'smartify-project-brief.txt';
            document.body.appendChild(link); link.click(); link.remove();
            window.setTimeout(() => URL.revokeObjectURL(url), 1000);
            setStatus('Your brief is ready to download. It has not been submitted to Smartify Solutions.');
        }
    }
    return <form className="inquiry-form" onSubmit={submit}>
        <h2>{c('contact.form_heading')}</h2><p>{contactEmail ? 'A few details are all it takes to start a conversation.' : 'Create a project brief to save and share when you’re ready. Nothing is submitted through this form.'}</p>
        <label>Your name<input name="name" autoComplete="name" placeholder="Your name" required maxLength={120} /></label>
        <label>Your email<input name="email" type="email" autoComplete="email" placeholder="you@company.com" required maxLength={254} /></label>
        <label>What are you thinking about?<select name="service" defaultValue="Let’s explore"><option>Let’s explore</option>{services.map((service) => <option key={service.slug}>{service.title}</option>)}</select></label>
        <label>Your message<textarea name="message" placeholder="Tell us about your project, goals, or the challenge you’d like to solve…" rows={4} required maxLength={5000} /></label>
        <ActionButton type="submit" className="button-primary">{contactEmail ? 'Open email draft' : 'Download project brief'}<Arrow /></ActionButton>
        <p role="status" className="form-status">{status || (contactEmail ? 'Your email app opens a draft for you to review and send.' : 'Your details stay in your browser until you save your brief.')}</p>
    </form>;
}
