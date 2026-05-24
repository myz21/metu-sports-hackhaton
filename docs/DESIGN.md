---
name: Glacial Intelligence
colors:
  surface: '#101415'
  surface-dim: '#101415'
  surface-bright: '#363a3b'
  surface-container-lowest: '#0b0f10'
  surface-container-low: '#191c1e'
  surface-container: '#1d2022'
  surface-container-high: '#272a2c'
  surface-container-highest: '#323537'
  on-surface: '#e0e3e5'
  on-surface-variant: '#c6c6cd'
  inverse-surface: '#e0e3e5'
  inverse-on-surface: '#2d3133'
  outline: '#909097'
  outline-variant: '#45464d'
  surface-tint: '#bec6e0'
  primary: '#bec6e0'
  on-primary: '#283044'
  primary-container: '#0f172a'
  on-primary-container: '#798098'
  inverse-primary: '#565e74'
  secondary: '#ddb7ff'
  on-secondary: '#490080'
  secondary-container: '#6f00be'
  on-secondary-container: '#d6a9ff'
  tertiary: '#2fd9f4'
  on-tertiary: '#00363e'
  tertiary-container: '#001b20'
  on-tertiary-container: '#008ea1'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#f0dbff'
  secondary-fixed-dim: '#ddb7ff'
  on-secondary-fixed: '#2c0051'
  on-secondary-fixed-variant: '#6900b3'
  tertiary-fixed: '#a2eeff'
  tertiary-fixed-dim: '#2fd9f4'
  on-tertiary-fixed: '#001f25'
  on-tertiary-fixed-variant: '#004e5a'
  background: '#101415'
  on-background: '#e0e3e5'
  surface-variant: '#323537'
typography:
  display-lg:
    fontFamily: Sora
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Sora
    fontSize: 32px
    fontWeight: '800'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Sora
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Sora
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style

This design system embodies the intersection of elite athletic performance and high-velocity artificial intelligence. The aesthetic is "Glacial Tech"—a fusion of the precision found in figure skating edges and the cold, calculated efficiency of data processing.

The design style leverages **Glassmorphism** and **Minimalism** to create a UI that feels lightweight yet structured. Surfaces should appear as polished ice—translucent, layered, and deep—while maintaining a high-contrast environment for data readability. The goal is to evoke a sense of focused energy, professional mastery, and futuristic innovation.

## Colors

The palette is anchored in a deep "Abyssal Blue" (`#0F172A`) to provide a high-contrast foundation for data-driven overlays. 

- **Primary (Abyssal Blue):** Used for deep backgrounds and structural depth.
- **Secondary (Electric Purple):** Represents the "AI" energy; used for key actions, progress indicators, and active states.
- **Tertiary (Glacial Cyan):** Represents the "Skate" element; used for precision markers, data visualizations, and secondary highlights.
- **Neutral (Crisp White):** Used strictly for high-readability typography and icons to ensure they "pop" against the dark background.

Apply semi-transparent variants of these colors for glassmorphic surfaces to maintain a sense of depth and fluidity.

## Typography

The typography strategy balances athletic dynamism with technical precision. 

**Sora** is utilized for headlines. Its geometric construction and wide stance suggest stability and forward movement. **Geist** is the workhorse for body text and labels, offering a monospaced-influenced clarity that feels data-driven and developer-centric.

Use `label-sm` with all-caps and increased tracking for metadata, technical timestamps, or sensor readings to reinforce the "instrument panel" feel.

## Layout & Spacing

The layout follows a strict **12-column fluid grid** for desktop and a **4-column grid** for mobile. Spacing is derived from an 8px base unit to ensure rhythmic consistency.

- **Precision Alignment:** Elements should align to the grid to evoke a sense of technical accuracy.
- **Breathable Margins:** Large outer margins (`40px` on desktop) prevent the UI from feeling claustrophobic, mirroring the open expanse of an ice rink.
- **Data Densities:** While general layouts are spacious, data-heavy "dashboards" can utilize a tighter 4px sub-grid for information density.

## Elevation & Depth

Depth is achieved through **Tonal Layers** and **Glassmorphism**, rather than traditional shadows.

1.  **Base Layer:** The deepest background (`#0F172A`).
2.  **Surface Layer:** A semi-transparent overlay (5-10% opacity white) with a `20px` background blur. This creates the "frosted ice" effect.
3.  **Accent Layer:** Subtle 1px inner borders (top and left) using a high-opacity cyan or purple to simulate light catching the "edge" of the glass.
4.  **Active Layer:** Elements that are "hovered" or "active" should increase their backdrop blur and stroke brightness, effectively "rising" toward the user.

Avoid drop shadows unless used to separate high-priority modals from the background, in which case use a deep blue-tinted, highly diffused shadow.

## Shapes

The shape language is **Rounded (Level 2)**. 

Standard components (buttons, input fields) use a `0.5rem` (8px) radius. Larger containers and cards use `1rem` (16px). This subtle rounding softens the technical edge of the system, making it feel approachable and modern rather than "brutalist" or "industrial." 

Interactive elements should maintain these consistent radii to ensure a cohesive "object" feel across the interface.

## Components

### Buttons
- **Primary:** Gradient fill (Electric Purple to Glacial Cyan), white text, bold weight.
- **Secondary:** Ghost style with a 1px Glacial Cyan border and backdrop blur.
- **Action:** Square with slightly more rounded corners for "Record" or "Sync" functions.

### Cards & Containers
Containers must use the frosted glass effect. A 1px border at 20% opacity white is mandatory to define the silhouette against the dark background. 

### Data Visualization
Charts should use vibrant gradients of the primary accent colors. Grid lines within charts should be ultra-thin (0.5px) and low contrast to keep the focus on the data trends.

### Input Fields
Dark backgrounds (even darker than the base layer) with a 1px bottom-border highlight that glows Cyan on focus.

### Chips & Tags
Small, pill-shaped elements with a low-opacity background tint of the status color (e.g., green for "Optimal," red for "Correction Needed").