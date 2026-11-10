---
name: JW Group
description: Established corporate real-estate identity with multilingual content.
colors:
  background: "hsl(210 20% 98%)"
  foreground: "hsl(222 47% 11%)"
  card: "hsl(0 0% 100%)"
  primary: "hsl(30 70% 45%)"
  primary-foreground: "hsl(0 0% 100%)"
  secondary: "hsl(222 47% 11%)"
  secondary-foreground: "hsl(210 20% 98%)"
  muted: "hsl(215 16% 90%)"
  muted-foreground: "hsl(215 16% 40%)"
  accent: "hsl(20 56% 18%)"
  border: "hsl(215 20% 88%)"
typography:
  body:
    fontFamily: "Noto Sans Thai, Noto Sans, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0em"
rounded:
  sm: "8px"
  md: "10px"
  lg: "12px"
spacing:
  unit: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.md}"
    height: "40px"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.secondary-foreground}"
    rounded: "{rounded.md}"
    height: "40px"
---

# Design System: JW Group

## Overview

The established identity combines navy corporate surfaces, orange actions, and light neutral work areas. This documents the existing system, not a site-wide redesign. The structure page uses that identity to make relationships readable.

## Colors

Global HSL tokens in `src/index.css` remain authoritative. Primary is the orange interaction color; secondary and foreground are the navy corporate roles. Individual businesses retain their maintained identities. Use semantic roles rather than literal color classes.

## Typography

Noto Sans Thai is the universal font, including display and serif aliases. Bold headings distinguish hierarchy. Use zero letter spacing on the organization surface and allow Thai names and positions to wrap.

## Layout

The centered shared container reaches 1400px. Preserve navbar-safe offsets. Route-specific changes remain local. Organization executive tiers run horizontally; department branches descend beneath their existing manager. Mobile organization navigation uses a two-column grid, and the chart uses an accordion.

## Elevation & Depth

Shared shadow tokens provide offset, soft depth. Use plain surfaces and borders for chart tools; selection relies on orange outlines rather than decorative glow.

## Shapes

The global radius is 12px with smaller control variants. Organization cards use 8px corners; only compact branch toggles and badges are circular or pill-shaped.

## Components

Shared Button variants own commands and selection. Inputs retain keyboard-visible focus. Navy marks the top executive; neutral cards show other roles. Direct reporting connectors are solid; advisory/support connectors are dashed. Orange highlights the selected reporting path. Node selection and expansion are separate buttons.

## Public-page polish

Public information, business, contact, news and careers pages use zero tracking, balanced headings and a light neutral reading surface. Page titles are left-aligned with a short orange rule; corporate documents retain the navy title band and shared About navigation. Contact uses labeled fields, white form surfaces and orange submission controls. Business panels preserve the accordion and official logos with a token-owned white logo surface; galleries keep full uncropped images in a bounded dialog. Business gallery identities use the semantic estate, hotel, pet, herbal and construction CSS tokens. Public refinements exclude the admin and preserve homepage-local media rules. News article reading measure is 75 characters and body leading is 1.9. Reduced-motion disables moving transforms without hiding content.

## Do's and Don'ts

- Do retain official logos, universal type, semantic tokens, and reduced-motion support.
- Do keep all maintained businesses and preserve original hierarchy records.
- Don't treat a route refinement as a global rebrand.
- Don't invent personnel, reporting relationships, achievements, or claims.
- Don't use decorative grids or blurred orbs on the organization surface.