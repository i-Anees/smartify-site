import '../css/app.css';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { LazyMotion, MotionConfig, domAnimation } from 'motion/react';
import type { ComponentType } from 'react';
import { StudioMotionProvider } from './components/StudioMotion';

const pages = import.meta.glob<{ default: ComponentType }>('./pages/*.tsx');

createInertiaApp({
    title: (title) => `${title} — Smartify Solutions`,
    resolve: (name) => {
        const page = pages[`./pages/${name}.tsx`];
        if (!page) throw new Error(`Unknown page: ${name}`);
        return page().then((module) => module.default);
    },
    setup({ el, App, props }) {
        createRoot(el).render(
            <MotionConfig reducedMotion="user" transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}>
                <LazyMotion features={domAnimation} strict>
                    <StudioMotionProvider><App {...props} /></StudioMotionProvider>
                </LazyMotion>
            </MotionConfig>,
        );
    },
});
