import { useCopy } from '../content';
import ContentLines from '../components/ContentLines';
import SiteLayout from '../components/SiteLayout';
import PageIntro from '../components/PageIntro';
import SelectedWork from '../components/SelectedWork';

export default function Projects() {
    const c = useCopy();
    return <SiteLayout title="Projects & Studio Explorations"><PageIntro label={c('projects.label')} title={<><ContentLines text={c('projects.heading')} /> <em>{c('projects.emphasis')}</em></>} description={c('projects.description')} image="laptop" /><SelectedWork fullPage /></SiteLayout>;
}
