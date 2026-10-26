# Smartify Solutions — Creative Direction

Phase 1 proposal · 24 October 2026 · Design only; no website implementation.

## 1. Project findings

- Read the root `AGENTS.md`. Its intended identity is dark editorial futurism, with original compositions, purposeful motion, and accessible engineering.
- Current application: Laravel 13 (`composer.json` constraint `^13.17`), PHP requirement `^8.3`, Tailwind CSS 4, and Vite 8. `/` currently renders `resources/views/welcome.blade.php`; `resources/js/app.js` is effectively empty.
- React, TypeScript, Inertia, Motion, GSAP, and Three.js are not currently declared dependencies. React + TypeScript + Inertia is the architecture requested by the guidelines, rather than an existing implementation.
- Instrument Sans, weights 400/500/600, is already configured in `vite.config.js`.
- The available brand asset is `public/images/brand/smartify-logo.png`. The SVG named in `AGENTS.md` is absent. Project and service image directories are empty; no approved portfolio imagery or testimonials were supplied.
- PHP and Composer are available. No application or dependency changes were made. Complete the Laravel Boost setup required by `AGENTS.md` before future application changes, then reread its generated guidelines.

## 2. What the logo tells us

The inspected PNG is 1447 × 1087 with transparency. It combines a deep burgundy circular field, a white brain/lightbulb symbol, rounded radiating strokes, a heavy uppercase SMARTIFY wordmark, and a widely tracked SOLUTIONS line.

Opaque-pixel sampling identifies `#70020E` as the most frequent color, with closely related burgundy shades. White `#FFFFFF` and near-white pixels form the lettering and symbol. The exact typeface cannot be established from the raster asset.

**Design implications:** intelligence becoming an idea; ideas radiating into the world; confident typography balanced by curved, human forms. Translate these qualities into light, rhythm, and composition, rather than repeating literal lightbulbs across the page.

Use the supplied file unchanged: preserve its proportions, colors, lettering, transparency, and internal padding. No filters, tracing, recoloring, cropping, or separate extraction of its symbol. Display it with `object-fit: contain`; test its full lockup at realistic navigation sizes. If lettering becomes too small, enlarge the logo area or simplify adjacent navigation. A future vector original would improve clarity but is not required to complete the design.

The provisional blue palette is superseded by the actual burgundy identity. Supporting neutrals and pale rose below are proposed extensions, not colors claimed to have been sampled from the logo.

## 3. Three distinct homepage directions

### A. The Ignition Room — cinematic sculpture

**Premise:** Smartify is where an ambitious idea becomes a tangible digital experience. The page feels like entering a private creative studio after dark.

**Composition:** an asymmetric hero places immense left-aligned typography beside an off-center sculptural light installation. Warm-white strokes float around a burgundy circular aperture, echoing the logo's radiating geometry without redrawing it. Crisp foreground type, an object in the middle distance, and restrained atmospheric light establish three clear depths. Broad project images interrupt the darkness farther down the page.

**Typography and colors:** Space Grotesk 500/600 for headlines; Instrument Sans 400/500/600 for reading and navigation. Ink `#0D090B`, burgundy `#70020E`, warm white `#FAF7F5`, and pale rose `#E7BFC5`. No unrelated neon colors.

**Hero copy proposal:** “Intelligence, made extraordinary.” Supporting line: “Smartify Solutions brings strategy, design, and engineering together to create distinctive digital experiences.” Actions: “Explore our work” and “Start a conversation.” Both copy and capabilities require business approval.

**Motion:** one measured light sweep reveals the sculpture; the headline enters by line, never letter by letter. Fine-pointer movement shifts the decorative object by at most 8px. Project images reveal through simple masks; a short process sequence brings the same radial motif back as a closing idea.

**Tradeoff:** strongest brand connection and cinematic potential, but requires an excellent custom centerpiece. Begin with a static art-directed render plus lightweight SVG/CSS layers; consider WebGL only after proving a meaningful benefit.

### B. The Smartify Edition — editorial gallery

**Premise:** a design publication and a contemporary exhibition meet a technology studio. The work carries the spectacle.

**Composition:** a dark masthead leads into a huge typographic hero with one sharply cropped, approved project image offset across the grid. Alternate dark sections with warm-white project spreads and burgundy chapter dividers. Images use unequal widths, captions, generous margins, and occasional edge-to-edge crops; avoid a uniform portfolio-card grid.

**Typography and colors:** Instrument Sans 600 for assertive headlines and 400/500 for body text. The hierarchy comes from scale and spacing rather than a second display face. Warm white `#FAF7F5` dominates the portfolio chapters; ink `#0D090B` and burgundy `#70020E` anchor the dark frame and closing CTA.

**Hero copy proposal:** “A sharper point of view. A stronger digital presence.” A large editorial project plate overlaps the right-hand portion of the composition, with its real title and discipline beneath.

**Motion:** image-to-image transitions, caption reveals, and understated underline movement. No continuous ambient animation. Each case study opens with a distinct visual rhythm; touch users receive the same content in a vertical reading order.

**Tradeoff:** most durable and easiest to keep fast, but needs exceptional real project photography, screenshots, and case-study content. With the current empty asset folders, its defining feature is not yet available.

### C. Signal / Form — kinetic graphic studio

**Premise:** an expressive creative workshop where ideas are visibly arranged, tested, and connected.

**Composition:** an oversized typographic stage dominates the hero. “THINK.”, “MAKE.”, and “MATTER.” sit on intentionally offset baselines among radial ticks, ruled lines, and circular apertures. Work appears as a numbered exhibition index that expands into large previews. Services become a typographic repertoire rather than a row of boxes.

**Typography and colors:** Space Grotesk 600/700 for monumental display text, Instrument Sans for descriptions, and system monospace only for small indices. Predominantly warm white on ink; solid burgundy panels supply punctuation. Pale rose marks active states.

**Hero concept:** words and geometric fragments assemble once into a resolved composition; the message reads immediately even before motion finishes. A persistent “View selected work” link gives the graphic stage a clear purpose.

**Motion:** crisp panel wipes, sliding typographic masks, and pointer/focus-triggered project previews. Preview interaction is optional enhancement: every project retains its title, image, and link on touch and keyboard.

**Tradeoff:** highly memorable with fewer heavy visual assets, but the kinetic language can overpower the approachable intelligence of the logo. Requires especially disciplined mobile typography and motion restraint.

## 4. Recommended direction: The Ignition Room

Choose **A**. It connects most directly to the supplied identity, creates an original signature visual before portfolio assets arrive, and combines cinematic depth with a clear agency story. Adopt B's caption discipline and breathing room, without turning the result into a hybrid of all three concepts.

The emotional sequence is **intrigue → understanding → evidence → confidence → conversation**. A beautiful hero earns attention; real work and clear explanations earn trust. Avoid dashboard mockups, pricing-style grids, generic glowing orbs, fake client logos, and invented results.

### Homepage choreography

| Section | Composition and content | Interaction |
| --- | --- | --- |
| 1. Floating navigation | Compact glass island; unchanged logo, Work, Expertise, Studio, Contact. Start around 88px tall and refine around actual logo legibility. | Stable sticky position, active underline, opaque fallback. Mobile menu opens as an accessible dialog with visible close control. |
| 2. Cinematic hero | Two-column editorial stage; headline occupies roughly seven grid columns, sculpture the remaining five. Two clear CTAs. | Brief entrance sequence; sculpture remains behind text and never captures interaction. |
| 3. Agency introduction | Large statement paired with a short explanation of who the studio serves and how it works. Radial detail becomes a quiet margin annotation. | One subtle group reveal; copy remains readable throughout. |
| 4. Selected projects | One expansive lead project followed by two offset project plates. Each names the challenge, contribution, and verified outcome. | Small image scale on hover/focus; explicit case-study links. No horizontal scroll requirement. |
| 5. Services and expertise | Numbered editorial rows with descriptions, deliverables, and related work. Proposed groups: Strategy, Brand & Experience, Websites & Products, Engineering. | Accessible expandable detail; essential descriptions stay visible. Validate the service list before publishing. |
| 6. Why Smartify Solutions | Three concise arguments: strategic clarity, integrated craft, and dependable delivery. Pair each with real evidence when available. | Restrained line reveals; no unsupported counters or awards. |
| 7. Creative process | Discover → Define → Design → Build → Evolve. Show activities, client participation, and a deliverable per stage. | A short desktop progress sequence; optional pinning only if tested well. Mobile uses a plain vertical timeline. |
| 8. Testimonials | One substantial approved quote at a time, with attribution and project context; preferably a static editorial composition. | If multiple quotes require controls, use manual previous/next buttons and announce changes. No autoplay. |
| 9. Contact CTA | Full-width burgundy chapter: “What could we make extraordinary?” A direct invitation and clear contact action. | Arrow translation on hover/focus. Contact destination must use verified business details. |
| 10. Premium footer | Spacious identity, navigation, verified contact/social links, legal links, and copyright. | Clear link focus states. No decorative interaction that blocks navigation. |

Project, testimonial, and results sections are planned slots. Do not publish fabricated content to fill them. Obtain approved assets or agree an honest alternative before implementation reaches those sections.

## 5. Design system specification

### Color tokens

| Token | Value | Role |
| --- | --- | --- |
| `brand-primary` | `#70020E` | Sampled burgundy; major planes, primary buttons, sculpture lighting |
| `canvas` | `#0D090B` | Main background; proposed warm ink |
| `surface` | `#181114` | Raised panels and opaque glass fallback |
| `surface-raised` | `#25191E` | Expanded details and menu surface |
| `text-primary` | `#FAF7F5` | Headlines and primary body copy |
| `text-secondary` | `#BFAFB3` | Supporting text |
| `accent-light` | `#E7BFC5` | Active links, focus rings, restrained highlights |
| `divider` | `rgba(250,247,245,0.14)` | Decorative separators; not sole control boundaries |

Calculated solid-color contrast: primary text/canvas **18.56:1**, secondary text/canvas **9.42:1**, secondary text/surface **8.85:1**, and primary text/burgundy **11.55:1**. Burgundy/canvas is only **1.61:1**: never use burgundy alone for small dark-mode text, essential icons, or control boundaries. Use a pale outline where a dark burgundy control needs visible separation. Recheck contrast against actual rendered glass and imagery later.

### Typography

- Display: Space Grotesk 500/600, fallback `ui-sans-serif, system-ui, sans-serif`. Hero range 48–112px, line height 1.02–1.08, tracking about −0.035em. Use intentional line breaks by viewport; never shrink text merely to preserve desktop composition.
- Section headings: 34–64px, line height 1.08–1.15. Project titles: 26–40px.
- Body: Instrument Sans 400, 16–18px, line height 1.6; supporting introductory text 20–24px. Keep paragraphs around 55–65 characters wide.
- Navigation/buttons: 14–16px, weight 500/600. Labels: 12–13px, modest uppercase tracking; no long uppercase paragraphs.
- Keep the embedded logo lettering intact. Proposed website fonts complement it; they are not assertions about the logo font. Add only required font weights, preferably local WOFF2 with swap behavior.

### Layout, surfaces, and components

- Twelve-column desktop grid; maximum content width 1320px. Gutters: 60px at 1440, 40px at 1280, 32px at 768, 20px at 390. Tablet uses eight columns; mobile uses four.
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160px. Section spacing: 96–160px desktop, 64–88px mobile.
- Corners: 8px controls, 16px media, 24px navigation. Preserve mostly rectangular editorial project plates; reserve circles for the brand-derived visual motif.
- Glass belongs primarily to navigation: dark translucent fill, subtle light edge, 12–16px blur, and an opaque fallback. Avoid stacking blurred layers across every section.
- Buttons: minimum 48px high, clear verb labels, visible focus outline with offset; warm-white text on burgundy for primary actions, quiet text-and-arrow links for secondary actions. Cover hover, focus, pressed, disabled, and loading states where relevant.
- Plan reusable `FloatingNav`, `HeroStage`, `SectionHeading`, `ProjectPlate`, `ServiceRow`, `ProcessTimeline`, `Testimonial`, `ContactCTA`, and `SiteFooter` components. Share tokens and behavior; allow each section its own composition.

### Motion and interaction

- Micro-interactions: 160–220ms; component transitions: 280–400ms; hero entrance: 700–1000ms total. Suggested easing: `cubic-bezier(0.22, 1, 0.36, 1)`.
- Motion owns local UI transitions; GSAP is reserved for coordinated scroll sequences. Avoid competing animation libraries controlling the same property. Neither library is installed during Phase 1.
- Animate opacity and transforms. Limit optional parallax to fine pointers; pause off-screen ambient effects. No cursor replacement, scroll hijacking, mandatory intro, or permanent light pulsing.
- Reduced motion: static hero, immediate text, no parallax, no pinned storytelling, instant section navigation. All information and actions remain available.

### Responsive, accessible, and fast

- At 1440/1280, preserve the asymmetric hero and offset projects. At 768, put typography above a shallower sculpture. At 390, use a single column, a compact decorative stage, stacked CTAs, and full-width project imagery. Test intermediate widths and short landscape viewports as well.
- Let hero height follow content with a sensible small-viewport minimum; avoid trapping mobile content inside a fixed `100vh` stage. No sideways page overflow or hover-only information.
- Semantic landmarks, one H1, logical headings, skip link, visible keyboard focus, 44px minimum touch targets, and an accessible mobile dialog with focus return. Decorative sculpture is hidden from assistive technology; meaningful project imagery receives useful alt text.
- Target WCAG 2.2 AA, LCP ≤2.5s, INP ≤200ms, and CLS ≤0.1. These are future acceptance goals, not measured results.
- Start with a static hero poster; enhance after essential content. Responsive AVIF/WebP project images, explicit image dimensions, deferred below-fold media, and route-specific animation loading. Proposed initial budgets: ≤250KB compressed JavaScript and ≤350KB hero artwork, subject to measurement.
- No Three.js by default. Any later WebGL experiment must justify its transfer and rendering cost, have a static fallback, and preserve the mobile experience.

## 6. Inputs and next phase

Before final content production, collect approved case studies, permitted imagery, service scope, audience priorities, testimonial permissions, and verified contact/social details. Do not invent these. No implementation is included in this proposal.

After direction approval: complete the repository's Boost setup; establish the requested frontend architecture; build and review navigation plus hero first; then progress section by section. Validate at 1440, 1280, 768, and 390px with rendered screenshots, keyboard checks, reduced-motion checks, and performance measurements. No rendered homepage or visual implementation QA has occurred during this phase.

## Reference scope

The brief's principles guide this original proposal: precision and hierarchy associated with [Linear](https://linear.app/), layered visual depth associated with [Huly](https://huly.io/), and creative-agency storytelling. Their public pages were consulted for context; no rendered visual audit or reproduction is claimed. [Active Theory](https://activetheory.net/) returned a JavaScript-only shell in text inspection and is not treated as visually reviewed.

Proposed type references: [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) and [Instrument Sans](https://fonts.google.com/specimen/Instrument+Sans). The direction, layouts, sculpture, tokens, and motion specifications above are Smartify-specific design proposals.
