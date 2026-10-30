---
name: Nivaas Utility System
colors:
  surface: '#FFFFFF'
  surface-dim: '#d3daef'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3ff'
  surface-container: '#e9edff'
  surface-container-high: '#e1e8fd'
  surface-container-highest: '#dce2f7'
  on-surface: '#141b2b'
  on-surface-variant: '#3e4947'
  inverse-surface: '#293040'
  inverse-on-surface: '#edf0ff'
  outline: '#6e7977'
  outline-variant: '#bdc9c6'
  surface-tint: '#006a63'
  primary: '#005c55'
  on-primary: '#ffffff'
  primary-container: '#0f766e'
  on-primary-container: '#a3faef'
  inverse-primary: '#80d5cb'
  secondary: '#1d4ed8'
  on-secondary: '#ffffff'
  secondary-container: '#4069f2'
  on-secondary-container: '#fffbff'
  tertiary: '#7f4025'
  on-tertiary: '#ffffff'
  tertiary-container: '#9c573a'
  on-tertiary-container: '#ffe5db'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#9cf2e8'
  primary-fixed-dim: '#80d5cb'
  on-primary-fixed: '#00201d'
  on-primary-fixed-variant: '#00504a'
  secondary-fixed: '#dce1ff'
  secondary-fixed-dim: '#b7c4ff'
  on-secondary-fixed: '#001551'
  on-secondary-fixed-variant: '#0039b5'
  tertiary-fixed: '#ffdbce'
  tertiary-fixed-dim: '#ffb598'
  on-tertiary-fixed: '#370e00'
  on-tertiary-fixed-variant: '#72361b'
  background: '#f9f9ff'
  on-background: '#141b2b'
  surface-variant: '#dce2f7'
  page-bg: '#F6F7F9'
  primary-pressed: '#115E59'
  text-primary: '#111827'
  text-secondary: '#4B5563'
  border-subtle: '#E5E7EB'
  success-text: '#166534'
  success-surface: '#DCFCE7'
  warning-text: '#92400E'
  warning-surface: '#FEF3C7'
  destructive-text: '#B91C1C'
  destructive-surface: '#FEE2E2'
  water-text: '#1D4ED8'
  water-surface: '#DBEAFE'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.25rem
  space-xl: 1.5rem
---

## Brand & Style

This design system delivers a calm, reliable, and functional utility experience tailored for small residential communities. It serves property owners and tenants who need immediate clarity on rent ledgers, building maintenance, and municipal utilities without friction. 

The aesthetic is built on pragmatic minimalism: pure content presentation, disciplined hierarchy, and intentional absence of decoration. Stock imagery, heavy drop shadows, decorative charts, and illustrative clutter are eliminated in favor of clean outline iconography, legible numerical data, and structured surfaces. The interface communicates transparency, accountability, and everyday operational trust.

## Colors

The palette is strictly calibrated for a bright, daylight-optimized light theme. The dominant environment uses `#F6F7F9` for screen backgrounds and crisp `#FFFFFF` for content containers, creating natural separation without requiring dark shadows.

Primary interactions and identity anchor on Deep Teal (`#0F766E`), reflecting quiet stewardship and dependability. The system avoids multi-color gradients; color is used strictly for state, identity, and domain metrics.

### Status & Domain Color Pairings
Every semantic status must be rendered using its dedicated text-on-surface container pairing to maintain AA contrast:
- **Success (`#166534` text on `#DCFCE7`):** Settled payments, verified visits, completed maintenance.
- **Warning (`#92400E` text on `#FEF3C7`):** Partial payments, pending approvals, tank refills in progress.
- **Destructive / Overdue (`#B91C1C` text on `#FEE2E2`):** Rent past due, critical building notices, system errors.
- **Water Utility (`#1D4ED8` text on `#DBEAFE`):** Overhead tank level indicators, municipal schedule updates, meter readings.

## Typography

The typography is built entirely on Inter. To maintain accessibility across varying age demographics and screen resolutions, font sizes below 14px are disallowed. 

### Sizing and Hierarchy
- **Main Heading (`headline-lg`, 24px/32px semibold):** Screen anchors, top-level dashboard titles.
- **Section Heading (`headline-sm`, 18px/24px semibold):** Card cluster groups, breakdown titles.
- **Primary Body (`body-md`, 16px/24px regular) & Body Medium (`body-lg`, 16px/24px medium):** Core financial records, instructions, and list content.
- **Supporting Labels (`label-md` and `label-sm`, 14px/20px):** Form labels, metadata rows, and status chip labels.

### Localization Formatting Rules
- **Currency:** Indian Rupee symbol (`₹`) is rendered alongside figures using Indian numerical notation (`₹1,50,000`, `₹12,450`).
- **Dates:** Dates must use standard unambiguous calendar shorthand (`DD-MMM-YYYY`, e.g., `05-OCT-2024`).
- **Phone Numbers:** Masked mobile numbers follow the Indian format (`+91 XXXXX 12345`).

## Layout & Spacing

The layout model is mobile-first, designed for responsive single-column mobile viewports spanning `360px` to `430px`, centered around an optimal reference of `390px`. 

The system operates strictly on an 8px base rhythm:
- **Canvas Margins:** Screen gutters are fixed at `20px` (`1.25rem`), providing a comfortable reading margin for one-handed operation.
- **Card and Section Gaps:** Vertically stacked cards and structural groupings maintain a consistent `16px` (`1rem`) separation.
- **Interior Component Spacing:** Nested elements use `8px` (`space-sm`) and `16px` (`space-md`) increments to cluster related controls and metadata.
- **Safe Areas:** System top bars and home navigation indicators incorporate native operating system padding without overlapping actionable surfaces.

## Elevation & Depth

Visual depth is achieved through clean boundary contrast rather than multi-layered shadows. Heavy drop shadows, ambient blurs, and glassmorphism are explicitly excluded.

- **Surface Base:** Ground level page background (`#F6F7F9`).
- **Surface Middle (Cards and Containers):** Pure `#FFFFFF` resting directly on the ground level, defined by a 1px solid border in `#E5E7EB` and a crisp, minimal ambient lift: `0px 1px 2px rgba(17, 24, 39, 0.05)`.
- **Surface Overlay (Modals and Bottom Sheets):** Modal layers use pure `#FFFFFF` bounded by an `#E5E7EB` top border and a restrained shadow: `0px -4px 16px rgba(17, 24, 39, 0.08)`. Overlays sit above a dimmed backdrop of `rgba(17, 24, 39, 0.40)`.

## Shapes

The geometric architecture uses structured, friendly corners that maintain high density without feeling rigid.

- **Content Cards and Containers:** Fixed `16px` corner radius.
- **Interactive Form Fields:** Fixed `12px` corner radius.
- **Action Buttons:** Fixed `12px` corner radius to match input field structure.
- **Badges and Status Chips:** Fully pill-shaped (`9999px`) to create clear differentiation between static structural boxes and dynamic state pills.

## Components

### Buttons
- **Primary CTA:** Minimum `48px` touch height (standard `52px` full-width on mobile), 12px corner radius. Solid `#0F766E` background with `#FFFFFF` text (`label-lg`). Pressed state shifts to `#115E59`.
- **Secondary / Ghost Button:** Minimum `48px` touch height, 12px radius, transparent background with 1px border `#E5E7EB` and `#111827` text. Pressed state surfaces `#F6F7F9`.
- **Destructive Button:** Tinted background using `#FEE2E2` with `#B91C1C` text and border for non-final prompts; solid `#B91C1C` with `#FFFFFF` text for irreversible actions.

### Input Fields
- **Container:** Height fixed at `52px`, 12px corner radius, background `#FFFFFF`, border 1px `#E5E7EB`.
- **Focus State:** 1.5px border in `#0F766E`, no diffuse glow ring.
- **Labels:** Persistent `label-md` (14px) positioned above the input field in `#111827`. Floating or disappearing placeholders are not permitted. Helper and error text sit below the field at 14px.

### Status Chips & Badges
- **Structure:** Pill shape (`9999px` radius), horizontal padding `10px`, vertical padding `4px`.
- **Requirement:** Color must never appear without an explicit text label. Outline icons (14px) may precede the text label.
- **Variants:** Paid (`#DCFCE7` / `#166534`), Pending/Partial (`#FEF3C7` / `#92400E`), Overdue (`#FEE2E2` / `#B91C1C`), Water Indicator (`#DBEAFE` / `#1D4ED8`).

### Content Cards
- **Structure:** Surface `#FFFFFF`, 16px radius, 1px solid `#E5E7EB` border, internal padding `16px` or `20px`.
- **Dividers:** When grouping data rows within a card, use 1px horizontal dividers in `#E5E7EB`.

### Lists & Ledger Rows
- **Dimensions:** Rows maintain a minimum tap or scan height of `48px`.
- **Typography:** Ledger amounts display in `body-lg` (16px semibold `#111827`), paired with unit or tenant labels in `label-sm` (14px `#4B5563`).

### Water Level Indicator Card
- Dedicated utility card utilizing `#DBEAFE` for accent headers and icons (`#1D4ED8`). Numerical capacity displays as clean plain text percentages and liters without skeuomorphic liquid waves or radial gauges.