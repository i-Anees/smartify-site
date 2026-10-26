import { usePage } from '@inertiajs/react';

export type TeamMember = { id?: string; name: string; role: string; portrait: string; portraitFocus?: number; bio: string; linkedin?: string };
export type ClientStory = { id?: string; quote: string; name: string; role: string; company: string };
export type Service = { slug: string; icon: string; title: string; short: string; description: string; heading: string; features: string[]; tools: string[]; image: string; imageSmall?: string; alt: string; width?: number; height?: number };
export type Project = { id: string; slug: string; title: string; subtitle: string; category: string; image: string; alt: string; description: string; disciplines: string; concept: boolean };
export type ProcessStep = { title: string; description: string; outcome: string; icon?: string };
export type PublicContent = { copy: Record<string, string>; services: Service[]; projects: Project[]; process: ProcessStep[]; team: TeamMember[]; testimonials: ClientStory[]; reel: { title: string; label: string; image: string }[] };
export type SiteProps = {
    [key: string]: unknown;
    contactEmail: string | null;
    socialLinks: { name: string; url: string }[];
    siteRoutes: Record<string, string>;
    serviceRoutes: Record<string, string>;
    serviceSlug?: string;
    siteContent: PublicContent;
};

export function useSite() { return usePage<SiteProps>().props; }
export function useCopy() { const { siteContent } = useSite(); return (key: string) => siteContent.copy[key] ?? ''; }
export function artworkFor(service: Service) {
    return { image: service.image, small: service.imageSmall, width: service.width || 1120, height: service.height || 747, alt: service.alt };
}
