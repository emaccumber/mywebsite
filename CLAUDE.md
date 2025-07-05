# Project Instructions

ALL instructions within this document MUST BE FOLLOWED, these are not optional unless explicitly stated.

## Programming Principles

- Follow the KISS (Keep It Simple Stupid) principle
- DO NOT edit more code than you have to

## Documentation References

- Whenever you reference docs that I provide (either by code-block or URL) when coding, add a succinct version of the section of the doc that you used to claude_helper/docs.md
- Always reference this when making changes to the codebase

## Astro-Specific Guidelines

### Component Structure
- Keep Astro components focused and single-purpose
- Use the frontmatter (---) section only for necessary imports and data fetching
- Prefer component props over global state when possible

### File Organization
- Place reusable components in `src/components/`
- Keep page components in `src/pages/`
- Store layouts in `src/layouts/` for consistent page structure
- Keep static assets in `public/` directory

### Routing and Links
- Always use the base path `/mywebsite` in internal links (as configured in astro.config.mjs)
- Use Astro's built-in routing for navigation between pages

### Performance
- Leverage Astro's partial hydration - only add client-side JavaScript when necessary
- Use `client:*` directives sparingly and appropriately
- Prefer static generation over server-side rendering for this project

## Testing & Validation

- Do not run `npm run build` after every code change - wait for user instruction
- When instructed to build, run `npm run build` to test changes
- Test production builds with `npm run preview` to verify functionality
- Verify all internal links work correctly with the base path `/mywebsite`
- Check that any new pages or routes are accessible in the production build