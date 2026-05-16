# Quilled Frontend Redesign Spec

## Direction
- Adopt a clean monochrome visual system inspired by minimalist portfolio aesthetics.
- Remove decorative gradients, neon accents, and high-noise effects.
- Keep interfaces text-first, low-contrast, and sharply structured with clear spacing.

## Scope
- Keep only these user-facing pages:
  - Article list (`/`)
  - Article detail (`/read/:pid`)
  - Login (`/login`)
  - Signup (`/signup`)
- Remove other routed page experiences and related UI flows from active navigation.

## IA and Routing
- Use a single router tree with one root layout and narrow child routes.
- Keep dedicated error handling via a shared 404/error page.
- Avoid route-level complexity not required for the four retained pages.

## Visual System
- Base palette: near-black backgrounds, white/neutral text, grayscale borders.
- Typography: smaller global text baseline for denser and cleaner reading rhythm.
- UI elements:
  - Flat bordered controls
  - Subtle hover inversion
  - Uppercase micro-labeling for metadata and navigation

## Page Design Notes
### Article List
- Show clean metadata rows (category, author, date) before each title.
- Keep card surfaces minimal with simple border hover emphasis.
- Prioritize title and short summary only.

### Article Detail
- Preserve semantic article hierarchy with readable content width.
- Keep header metadata concise and monotone.
- Render body content with restrained prose styles.

### Auth Pages
- Simplify to single-step forms.
- Remove multi-step animations and non-essential visual assets.
- Keep clear form labels, strong input contrast, and direct actions.

## SEO Requirements
- Article detail must include:
  - Dynamic title and meta description
  - Canonical URL
  - Open Graph metadata
  - Twitter metadata
  - JSON-LD `Article` structured data

## Engineering Cleanup
- Remove obsolete page/component files tied to deleted routes.
- Normalize router setup and remove unused lazy-loading wrappers.
- Keep frontend CSS focused on global primitives and page-level utility composition.

## Acceptance Criteria
- App boots with only the four retained routes.
- UI consistently follows monochrome styling.
- Global text size is reduced from previous baseline.
- Article detail metadata is SEO-complete and dynamic.
- Build and lint run successfully for the updated frontend.
