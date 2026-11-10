# Architecture rules

- Keep homepage-only refinements under `.home-page` and use homepage media tokens in global CSS so shared page styles remain unchanged.
- Keep the hero poster visible whenever video is not rendered, including mobile and reduced-motion mode, so desktop-to-mobile changes never leave a blank opening image.
- Keep organization styling scoped to `.org-page` and `.about-structure-page`; arrange department branches vertically under their existing executive without changing parent records.
- Store confirmed product context in `PRODUCT.md` and Impeccable workflow defaults in `.impeccable/config.json` so product truth and build preferences remain separate.
- Use CorporateLayout and its shared navigation for corporate-information and legal pages; scope their presentation to `.corporate-page` so other pages retain their styling.
- Scope cross-page public refinements to `.public-page`, excluding admin and homepage; keep media/brand surface colors in global CSS tokens so shared interactions remain theme-safe.