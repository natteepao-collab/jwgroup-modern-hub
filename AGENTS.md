# Architecture rules

- Keep homepage-only refinements under `.home-page` and use homepage media tokens in global CSS so shared page styles remain unchanged.
- Keep the hero poster visible whenever video is not rendered, including mobile and reduced-motion mode, so desktop-to-mobile changes never leave a blank opening image.
- Keep organization styling scoped to `.org-page` and `.about-structure-page`; arrange department branches vertically under their existing executive without changing parent records.
- Store confirmed product context in `PRODUCT.md` and Impeccable workflow defaults in `.impeccable/config.json` so product truth and build preferences remain separate.
- Use CorporateLayout and its shared navigation for corporate-information and legal pages; scope their presentation to `.corporate-page` so other pages retain their styling.
- Scope cross-page public refinements to `.public-page`, excluding admin and homepage; keep media/brand surface colors in global CSS tokens so shared interactions remain theme-safe.
- Proxy Lovable asset paths through the published app in the local Vite server so CDN pointer images render during browser QA; production keeps the same-origin asset path.
- Keep public destination, phone, testimonial and unverified-count safeguards in `src/lib/publicContent.ts`; presentation must never substitute mock claims for missing managed data.
- Register audit-led interface translations separately from legacy copy so factual content and existing SEO metadata remain untouched.
- Keep leadership fallback text empty when managed names, titles or quotations are missing so presentation never attributes invented statements.
