# Personal Website

A minimal personal website built with Astro and deployed to GitHub Pages.

## Stack Choices

**Astro** - Chosen for its simplicity and excellent static site generation. Perfect for a personal site that doesn't need complex client-side JavaScript. The component-based architecture keeps things organized while generating fast, lightweight HTML.

**Vanilla CSS** - No CSS frameworks or preprocessors. Keeps the site fast and gives complete control over styling without unnecessary bloat.

**GitHub Pages** - Simple, free hosting that integrates directly with the repository. No need for complex deployment pipelines.

**Inter Font** - Clean, readable typeface that works well across different screen sizes and devices.

## Development Approach

This site was built almost entirely through "vibe coding" using Claude Code. Rather than following detailed specifications or wireframes, the development process was conversational and iterative:

- Started with basic Astro setup
- Built pages and components through natural language requests
- Made design decisions through trial and feedback
- Refined layouts and interactions based on visual results
- Let the site evolve organically through experimentation

The result is a site that feels natural and unforced, built through exploration rather than rigid planning.

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## Structure

- `/src/pages/` - Site pages (photographs, films, writing, etc.)
- `/src/components/` - Reusable components like navigation
- `/src/layouts/` - Page layout templates
- `/src/data/` - Content data for photographs and films
- `/public/` - Static assets (images, videos, etc.)