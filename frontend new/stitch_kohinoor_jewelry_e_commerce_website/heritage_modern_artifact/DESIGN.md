---
name: Heritage-Modern Artifact
colors:
  surface: '#fff8f0'
  surface-dim: '#dfd9d1'
  surface-bright: '#fff8f0'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f9f3ea'
  surface-container: '#f3ede4'
  surface-container-high: '#ede7df'
  surface-container-highest: '#e8e2d9'
  on-surface: '#1d1b16'
  on-surface-variant: '#584141'
  inverse-surface: '#33302b'
  inverse-on-surface: '#f6f0e7'
  outline: '#8c7070'
  outline-variant: '#e0bfbe'
  surface-tint: '#ae2e39'
  primary: '#51000d'
  on-primary: '#ffffff'
  primary-container: '#7a0019'
  on-primary-container: '#ff7b7f'
  inverse-primary: '#ffb3b2'
  secondary: '#77592d'
  on-secondary: '#ffffff'
  secondary-container: '#fdd39c'
  on-secondary-container: '#785a2d'
  tertiary: '#33210e'
  on-tertiary: '#ffffff'
  tertiary-container: '#4b3621'
  on-tertiary-container: '#bd9f84'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad9'
  primary-fixed-dim: '#ffb3b2'
  on-primary-fixed: '#410009'
  on-primary-fixed-variant: '#8d1324'
  secondary-fixed: '#ffddb2'
  secondary-fixed-dim: '#e8c08b'
  on-secondary-fixed: '#291800'
  on-secondary-fixed-variant: '#5d4218'
  tertiary-fixed: '#ffdcbf'
  tertiary-fixed-dim: '#e1c1a4'
  on-tertiary-fixed: '#291806'
  on-tertiary-fixed-variant: '#59422d'
  background: '#fff8f0'
  on-background: '#1d1b16'
  surface-variant: '#e8e2d9'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 64px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.1em
  button:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  section-v: 64px
  gutter-desktop: 24px
  margin-desktop: auto
  margin-mobile: 20px
  max-width: 1280px
---

## Brand & Style

The design system is crafted for a premium jewelry brand that bridges the gap between ancient Indian heritage and contemporary luxury. It targets an audience that values the weight of tradition but seeks the convenience of modern, anti-tarnish wear. 

The visual style is **Corporate Modern with a Minimalist Editorial edge**. It utilizes expansive white space (using a warm cream base) to allow jewelry photography to breathe, while employing deep cherry and soft gold accents to evoke a sense of royalty and craftsmanship. The emotional response should be one of "Timeless Sophistication"—feeling grounded, artisanal, yet technologically advanced in its product quality.

## Colors

The palette is rooted in an organic, warm spectrum. 
- **Primary (Deep Cherry Red):** Reserved for brand moments, primary calls to action, and high-level headings.
- **Secondary (Soft Gold):** Used for decorative borders, iconography, and subtle highlights to denote premium quality.
- **Neutral & Text:** A very dark brown is used instead of pure black to maintain a softer, more natural "oxidized jewelry" feel. 
- **Backgrounds:** The primary background is a rich cream to avoid the clinical feel of pure white, while surface containers provide subtle depth for grouping related information.

## Typography

This design system uses a high-contrast typographic pairing. **Playfair Display** provides the editorial, luxury voice for headings, suggesting the heritage aspect of the brand. **Manrope** provides a highly legible, modern counterpoint for all UI elements, body copy, and technical details.

Labels and button text must always be uppercase with generous letter spacing to maintain a clean, organized hierarchy that mirrors high-end fashion cataloging.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy for desktop to ensure a curated, boutique experience. 
- **Desktop:** 12-column grid with a 1280px max-width. Sections are separated by a consistent 64px vertical rhythm to create a sense of poise.
- **Mobile:** 4-column fluid grid with 20px side margins.
- **Rhythm:** An 8px base unit governs all internal spacing (padding, gaps). Use 16px or 24px for component-level spacing and 48px+ for layout-level spacing.

## Elevation & Depth

The design system utilizes **Tonal Layers** combined with **Ambient Shadows** to create a soft, inviting depth. 
- **Surfaces:** Use `#F3EDE4` for secondary cards or content areas to distinguish them from the cream background without needing harsh lines.
- **Shadows:** Avoid heavy, dark shadows. Use a warm, diffused shadow `rgba(43, 27, 23, 0.05)` with a high blur (40px) to simulate jewelry sitting under soft, directional gallery lighting.
- **Borders:** High-priority elements use a 1px solid border in Soft Gold (`#C6A16E`) to denote "premium" status or interactive focus.

## Shapes

The shape language is primarily **Soft (0.25rem/4px)** for functional components to maintain a structured, professional feel. 
- **Cards:** Use a slightly more relaxed 8px radius to feel approachable.
- **Badges/Chips:** Use full pill shapes (999px) to contrast against the structured grid and highlight "New" or "Anti-Tarnish" status tags.
- **Inputs:** Maintain the 4px radius for a crisp, architectural look.

## Components

- **Buttons:** Primary buttons use the Deep Cherry Red background with white text. Secondary buttons use a Soft Gold 1px border with the Label-style typography. All buttons use 4px roundedness.
- **Input Fields:** Use a subtle `#F3EDE4` fill or a thin neutral border. Focus states should transition the border to Soft Gold.
- **Cards:** Product cards should have no border, utilizing the warm ambient shadow and 8px radius. Text within cards should be center-aligned for a gallery aesthetic.
- **Chips/Badges:** Small, pill-shaped elements using the Beige Accent (`#D8B89C`) with Dark Brown text for secondary metadata, or Deep Cherry Red for high-importance alerts.
- **Jewelry Specifics:** Include a "Care & Materials" list component using a Soft Gold vertical line as a divider to emphasize the "anti-tarnish" value proposition.