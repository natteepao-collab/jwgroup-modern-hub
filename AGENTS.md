# Architecture rules

- Keep homepage-only refinements under `.home-page` and use homepage media tokens in global CSS so shared page styles remain unchanged.
- Keep the hero poster visible whenever video is not rendered, including mobile and reduced-motion mode, so desktop-to-mobile changes never leave a blank opening image.