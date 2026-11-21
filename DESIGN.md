---
name: Mekar Jaya Agrisystem
colors:
  surface: '#f9f9ff'
  surface-dim: '#d3daef'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3ff'
  surface-container: '#e9edff'
  surface-container-high: '#e1e8fd'
  surface-container-highest: '#dce2f7'
  on-surface: '#141b2b'
  on-surface-variant: '#40493f'
  inverse-surface: '#293040'
  inverse-on-surface: '#edf0ff'
  outline: '#707a6e'
  outline-variant: '#bfc9bc'
  surface-tint: '#196c31'
  primary: '#005420'
  on-primary: '#ffffff'
  primary-container: '#1b6e32'
  on-primary-container: '#9beea3'
  inverse-primary: '#87d990'
  secondary: '#785a00'
  on-secondary: '#ffffff'
  secondary-container: '#fdc425'
  on-secondary-container: '#6d5200'
  tertiary: '#005424'
  on-tertiary: '#ffffff'
  tertiary-container: '#006f31'
  on-tertiary-container: '#8df09f'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#a3f6aa'
  primary-fixed-dim: '#87d990'
  on-primary-fixed: '#002108'
  on-primary-fixed-variant: '#00531f'
  secondary-fixed: '#ffdf9a'
  secondary-fixed-dim: '#f7be1d'
  on-secondary-fixed: '#251a00'
  on-secondary-fixed-variant: '#5a4300'
  tertiary-fixed: '#95f8a7'
  tertiary-fixed-dim: '#79db8d'
  on-tertiary-fixed: '#00210a'
  on-tertiary-fixed-variant: '#005323'
  background: '#f9f9ff'
  on-background: '#141b2b'
  surface-variant: '#dce2f7'
typography:
  headline-xl:
    fontFamily: Hanken Grotesk
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-xs:
    fontFamily: Hanken Grotesk
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.06em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system establishes a grounded, utilitarian, and editorial presence for an agricultural cooperative community. The visual language bridges honest rural labor with modern institutional clarity, rejecting frivolous decorations in favor of deliberate structure, robust contrast, and generous negative space. 

The aesthetic reflects modern utilitarian minimalism with subtle editorial detailing:
- **Tone:** Authoritative, transparent, resilient, and community-centric.
- **Audience:** Local farmers, regional distribution partners, agricultural extension workers, and institutional stakeholders.
- **Design Philosophy:** Utilitarian functionality over ornamental noise. Interfaces rely on precise hair-thin structural dividers, clear information hierarchy, high-contrast typography, and purposeful accents inspired by ripened paddy grains.

## Colors

The palette takes direct cues from the agricultural insignia—specifically the deep chlorophyll of healthy foliage and the rich golden amber of mature rice grains ready for harvest.

- **Primary (`#1B6E32`):** Grounded forest green representing stability, plant health, and institutional credibility. Used for key navigational landmarks, primary action triggers, and active states.
- **Secondary (`#EAB308`):** Harvest gold/amber accent. Used sparingly for status badges (such as crop maturity indicators, harvest notices), critical highlights, and subtle data visualization accents.
- **Tertiary (`#15803D`):** Rich field green supporting interactive hover states, secondary highlights, and successful yield metrics.
- **Neutral Palette:** High-contrast dark charcoal (`#111827`) provides maximum legibility for body copy and headings in field environments. Supporting text uses crisp medium slate (`#4B5563`). Canvas backgrounds remain pristine off-white (`#F8FAFC` and `#FFFFFF`) to ensure an open, glare-resistant viewing experience under natural daylight.

## Typography

The typographic voice relies on **Hanken Grotesk**, a sharp, geometric neo-grotesque with clean apertures and excellent rhythm. It reflects both the precision of modern agricultural management and the geometric directness seen in cooperative stamp marks.

- Headings demand strict tracking (`-0.02em` on displays) to establish compact, newsprint-grade editorial weight.
- Body paragraphs prioritize tall x-heights and open proportions for immediate outdoor readouts.
- Metadata and utility labels (e.g., metric units, lot numbers, seasonal phases) utilize uppercase tracking with medium-to-bold weights to guarantee functional legibility on rugged handheld devices.

## Layout & Spacing

The structural layout utilizes a strict 12-column fluid grid on desktop (collapsing to 6 columns on tablet and 4 columns on mobile). 

- **Grid Rationale:** The system balances dense tabular farm records with wide, airy editorial narratives. Information density adjusts according to purpose: data ledgers and inventory stay compact with `space-sm` and `space-md`, while editorial mission sections leverage `space-xl` and wide margins.
- **Margins & Gutters:** A 32px desktop margin preserves visual breathing room against viewport edges; mobile screens contract to 16px to conserve usable screen width for data-rich ledgers.
- **Rhythm:** All element spacing aligns strictly to an 8px base rhythm (with 4px micro increments for compact labels).

## Elevation & Depth

This design system deliberately eschews blurred drop shadows and glossy skeuomorphic treatments in favor of an authentic, print-inspired architectural elevation model.

- **Low-Contrast Ghost Outlines:** Cards, panels, and data groups sit flush against backgrounds, separated by crisp `1px` borders rendered in subtle slate (`#E2E8F0` or `#E5E7EB`).
- **Tonal Layering:** Depth is communicated through subtle contrast shifts rather than z-index casting. Base canvases in `#F8FAFC` support white (`#FFFFFF`) content tiles. Interactive elements receive subtle `#F1F5F9` surface fills on hover.
- **Border Hierarchy:** Important structural dividers (e.g., header bars, summary rows) employ deliberate `2px` solid `#111827` or `#1B6E32` borders to convey editorial structure reminiscent of ledger sheets.

## Shapes

The design uses a **Soft (Level 1)** shape language:
- Standard elements (buttons, inputs, notification pills) use a discrete `0.25rem` (4px) radius.
- Cards, ledger sheets, and modals employ `rounded-lg` at `0.5rem` (8px).
- This controlled geometry reflects functional tools, seed packets, and ledger lines—avoiding both hyper-corporate rounded pills and overly aggressive raw brutalist sharp edges.

## Components

### Buttons
- **Primary:** Solid `#1B6E32` fill, white `#FFFFFF` text, 4px border radius. Hover state transitions cleanly to `#15803D`. Active state compresses slightly without dropshadow.
- **Secondary / Outline:** Transparent fill, 1px solid `#D1D5DB` border, `#111827` text. On hover, fills with `#F8FAFC` and darkens border to `#111827`.
- **Accent:** Harvest gold `#EAB308` background with `#111827` dark text, reserved strictly for calls-to-action tied to seasonal yields or alerts.

### Chips & Badges
- **Status Chips:** Compact 24px height, 4px radius, padded with 8px horizontal spacing. 
- **Yield Status:** Harvest Gold tint background (`#FEF9C3`) with deep olive text (`#713F12`) and a fine `1px` border (`#FDE047`).
- **Operational Status:** Deep green tint (`#DCFCE7`) with dark forest green text (`#14532D`).

### Lists & Ledger Rows
- Table rows and list items feature hair-thin `1px` bottom borders (`#E5E7EB`), avoiding alternating row colors.
- Clear numeric alignment with tabular numeric figures for harvest yields, acreage measurements, and distribution logs.

### Input Fields & Controls
- **Inputs:** Crisp white background, `1px` border in `#D1D5DB`, padding `10px 14px`, 4px radius. Focus state utilizes a solid `2px` ring in `#1B6E32` with zero offset blur.
- **Checkboxes & Radios:** Sharp, tactile controls with a solid 2px outline in `#4B5563`, filling with `#1B6E32` and a crisp white tick mark upon selection.

### Cards
- Surface: `#FFFFFF` on `#F8FAFC` canvas.
- Perimeter: 1px continuous border (`#E2E8F0`). No drop shadow.
- Header bands within cards feature clean editorial typography with an optional subtle 2px accent underline in `#1B6E32`.

### Cooperative-Specific Components
- **Crop Cycle Progress Tracker:** Monoline step indicator using `#1B6E32` completed segments and `#E5E7EB` future tracks.
- **Commodity Price Banner:** High-contrast, compact data strip displaying real-time rice and commodity market rates with sharp metric typography.