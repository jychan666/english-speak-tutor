# Design System

## Colors

Strategy: Restrained. One dominant hue, tinted neutrals, one accent for primary actions and scoring emphasis.

```css
/* Primary - Teal green, calm and academic */
--color-primary: #0f766e;
--color-primary-light: #14b8a6;
--color-primary-dark: #115e59;

/* Accent - Orange, used for scores and key CTAs only */
--color-accent: #f97316;
--color-accent-light: #fb923c;

/* Neutrals - tinted toward green */
--color-bg: #f6f7f4;
--color-surface: #ffffff;
--color-surface-hover: #edf4f2;
--color-border: #dbe7e3;

/* Text */
--color-text: #1f2937;
--color-text-secondary: #4b5563;
--color-text-muted: #9ca3af;

/* Semantic */
--color-success: #22c55e;
--color-warning: #f59e0b;
--color-error: #ef4444;

/* Part identity colors */
--color-part-a: #0284c7;  /* Blue - Reading */
--color-part-b: #0f766e;  /* Teal - Role play */
--color-part-c: #ea580c;  /* Orange-red - Retelling */
```

## Typography

```css
--font-sans: 'Poppins', 'Noto Sans SC', 'Segoe UI', system-ui, sans-serif;
```

- One font stack. Poppins for English, Noto Sans SC for Chinese.
- Fixed rem scale: xs 0.75 → sm 0.875 → base 1.0 → lg 1.125 → xl 1.25 → 2xl 1.5 → 3xl 2.0
- Hero title uses clamp(2rem, 4vw, 3rem) for responsive sizing
- Body line-height: 1.6

## Spacing

4px grid: xs 4 → sm 8 → md 16 → lg 24 → xl 32 → 2xl 48 → 3xl 64

## Elevation

```css
--shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
--shadow-md: 0 4px 12px rgba(0,0,0,0.08);
--shadow-lg: 0 8px 30px rgba(0,0,0,0.12);
```

## Radius

sm 6px → md 10px → lg 16px → xl 24px

## Motion

120ms fast · 250ms normal · 400ms slow
ease-out-expo for page transitions and reveals
No bounce, no elastic, no orchestrated load sequences

## Components

- Buttons: .btn-primary (solid teal), .btn-secondary (outlined), .btn-large (14px+ padding)
- Cards: .card (white bg, lg radius, sm shadow, 1px border)
- Tags: pill-shaped, semantic colors (excellent/good/fair/needs-work)
- ScoreBar: horizontal progress bar with label + percentage
- ScoreDisplay: large number with score-glow class

## Atmosphere

Three-layer radial gradient background (brand colors at 2-4% opacity) + subtle SVG noise overlay on desktop.
