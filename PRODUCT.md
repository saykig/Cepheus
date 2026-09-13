# Cepheus

Cepheus publishes long-form essays on power, technology, and policy. Each essay is a reading experience first, with live, interactive instruments set into the prose where a static figure would fall short.

## Register

**Brand / long-form content.** The design is the product. A reader's impression, that this is a serious, quiet, carefully made publication, is the thing being made. Not a SaaS app, not a dashboard product.

## Readers

Students, researchers, analysts, policymakers, and technical experts who read closely and think in systems. They arrive for the argument and stay for the instruments. They are unimpressed by decoration and allergic to hype. They notice craft.

## Voice

Measured, essayistic, quietly ambitious. Concrete before abstract. Trusts the reader. Restraint as confidence, not timidity. Influences: wabi-sabi and *ma* (the active use of empty space), Cajal-meets-Kawase (precise scientific drawing meets atmospheric ink). The signature gesture is *connection*: pigment blooming, lines drawn between points, fields overlapping.

## Anti-references

- Generic SaaS marketing pages and admin dashboards.
- The "observability" reflex: dark navy, neon-on-black, glassmorphism.
- Editorial-magazine cliché: giant drop caps, broadsheet columns as costume.
- AI-slop tells: gradient text, hero-metric templates, identical icon-heading-text card grids, em dashes.

## Principles

1. **The essay leads.** Instruments serve the argument. If a visualization does not help the reader think, cut it.
2. **Evidence, with limits.** Cepheus is a *proposed* platform. The active institutional map uses sourced, provisional historical records with explicit limits. Earlier illustrative measurements are archived and do not appear in the essay.
3. **One material.** Warm paper, brown ink, one olive accent. The data palette earns its color inside the instruments only.
4. **Motion is ink.** Anything that animates should feel drawn, not slid. The charts and the landing share one hand.
5. **Reachable by everyone.** Keyboard, screen reader, reduced motion, and small screens are first-class, not afterthoughts.

## Localization

English is canonical and uses unprefixed URLs. Russian, Korean, French, and
Simplified Chinese use `/ru`, `/ko`, `/fr`, and `/zh-CN` prefixes with the same
structural slugs. Locale preference persists in the `cepheus-locale` cookie.

Copy lives in typed locale dictionaries and is consumed by shared page and
instrument components. Missing dataset translations fall back to English.
Draft locales are visible in development and Vercel preview builds; production
keeps the selector hidden unless `NEXT_PUBLIC_ENABLE_DRAFT_LOCALES=true` is set.
Draft routes are marked `noindex` until editorial review is complete.

The permanent essay redirect reads its source path from the production-only
`LEGACY_ESSAY_PATH` environment variable so legacy compatibility does not put
retired naming into source control.
