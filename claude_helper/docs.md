# Documentation References

## Astro Image Optimization

### Using the Image Component for Remote Images
- Import `Image` from 'astro:assets' to use optimized images
- For remote images, configure authorized domains in astro.config.mjs using `image.domains`
- Always specify width and height to prevent Cumulative Layout Shift (CLS)
- Use format="webp" for better compression and performance
- The Image component automatically optimizes images at build time for prerendered pages

### Example Implementation
```astro
---
import { Image } from 'astro:assets';
const mediaUrl = import.meta.env.PUBLIC_MEDIA_URL;
---
<Image 
  src={`${mediaUrl}/images/featured.jpg`} 
  alt="Featured image" 
  width={1200}
  height={800}
  format="webp"
/>
```

### Configuration
```js
// astro.config.mjs
export default defineConfig({
  image: {
    domains: ['f004.backblazeb2.com'], // Allow optimization for Backblaze B2 bucket
  },
})
```

### Performance Optimizations for Photo Gallery
- Use `<Image>` component for thumbnails with lazy loading: `loading="lazy"`
- Set `format="webp"` for automatic format conversion (25-50% smaller files)
- For dynamic galleries with JavaScript, use regular `<img>` tags with preloading
- Add `<link rel="preload" as="image">` for first few images
- Implement JavaScript preloading for adjacent images during navigation

Source: Astro Docs - Images (https://docs.astro.build/en/guides/images/)

## Astro Components

### Component Structure
- Components have two parts: Component Script (between ---) and Component Template (HTML + JS expressions)
- Props are accessed via `Astro.props` in the frontmatter
- Components can accept children content via `<slot />` elements

### Creating Reusable Components
```astro
---
// Component Script - imports and props
import OtherComponent from './OtherComponent.astro';
const { propName } = Astro.props;
---
<!-- Component Template -->
<div>
  <slot /> <!-- Default slot for children -->
</div>
```

### Using Components
- Import components in the frontmatter
- Components must be capitalized when used
- Pass props as attributes
- Use `class:list` directive for dynamic classes

Source: Astro Docs - Components

## MDX Integration

### Installation and Setup
- Install with `npm install @astrojs/mdx`
- Add to astro.config.mjs: `import mdx from '@astrojs/mdx'` and `integrations: [mdx()]`
- MDX files use `.mdx` extension and support JSX expressions and components

### Key MDX Features
- Frontmatter support (YAML/TOML) works like standard Markdown
- Import and use Astro components and UI framework components
- Export variables and data using `export` statements
- Access frontmatter variables with `{frontmatter.variableName}`
- Components must include `client:` directives for interactivity

### Converting from Markdown
- Simply rename `.md` files to `.mdx`
- Existing frontmatter and content remain compatible
- MDX extends Markdown with component support

Source: Astro Docs - MDX Integration

## Font Setup with Fontsource

### Installing Fonts
- Install font packages via npm: `npm install @fontsource/[font-name]`
- Import specific weights to optimize loading: `@fontsource/inter/300.css`
- Use in layouts for global application

### Implementation Pattern
- Create a BaseLayout component
- Import font in layout component script
- Apply font family in global CSS with system font fallbacks
- All pages using the layout automatically inherit the font

### Example Setup
```astro
---
// BaseLayout.astro
import '@fontsource/inter/300.css';
---
<style is:global>
  html {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    font-weight: 300;
  }
</style>
```

Source: Astro Docs - Fonts Guide

## Dark Mode Implementation

### Theme Toggle Setup
- Add theme toggle button to navigation as regular menu item
- Use JavaScript to detect system preference and localStorage
- Toggle between "light" and "dark" text based on current theme
- Script handles theme persistence and system preference detection

### CSS Dark Mode Styling
- Use `html.dark` class to target dark mode styles
- Apply dark background (#0a0a0a) and light text (#ffffff) for dark mode
- Maintain monochrome color scheme with appropriate contrast
- Include smooth transitions for theme switching

### Implementation Pattern
```css
html {
  background-color: #ffffff;
  color: #000000;
}

html.dark {
  background-color: #0a0a0a;
  color: #ffffff;
}
```

Source: Astro Docs - Dark Mode Tutorial

## BaseLayout Full Viewport Mode

### Purpose
- Enables pages to use full viewport height without scrolling
- Uses CSS Grid for clean layout without hardcoded navbar heights
- Maintains consistent navigation across all pages

### Implementation
```astro
---
// In BaseLayout.astro
export interface Props {
  pageTitle?: string;
  fullViewport?: boolean;
}
const { pageTitle, fullViewport = false } = Astro.props;
---
<body class:list={[{ 'full-viewport': fullViewport }]}>
  <Navigation />
  <main class:list={[{ 'full-viewport': fullViewport }]}>
    <slot />
  </main>
</body>
```

### CSS for Full Viewport
```css
body.full-viewport {
  height: 100vh;
  overflow: hidden;
  display: grid;
  grid-template-rows: auto 1fr;
}

main.full-viewport {
  padding: 0;
  max-width: none;
  overflow: hidden;
}
```

### Usage
```astro
<BaseLayout fullViewport={true}>
  <!-- Content that fills remaining viewport -->
</BaseLayout>
```

## Vimeo Embedding Best Practices

### Privacy-First Embedding
- Use `?dnt=1` parameter to disable tracking
- Add additional parameters for clean embed:
  - `&color=ffffff` - Set player controls color
  - `&title=0` - Hide video title
  - `&byline=0` - Hide author byline
  - `&portrait=0` - Hide author portrait

### Responsive Video Container
```css
.video-container {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  height: 0;
  overflow: hidden;
}
.video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
```

### Security Attributes
```html
<iframe 
  src="https://player.vimeo.com/video/ID?dnt=1"
  frameborder="0"
  allow="autoplay; fullscreen; picture-in-picture"
  allowfullscreen
></iframe>
```

Source: Vimeo Help Center & GDPR Compliance Best Practices

## HTML5 Video Poster Images

### Native Poster Attribute
- Use the native `poster` attribute on `<video>` elements for placeholder images
- The poster displays automatically while video is downloading/loading
- Browser handles showing/hiding the poster - no JavaScript or CSS transitions needed
- Poster automatically disappears when video starts playing or first frame is ready

### Optimizing Posters with Astro's getImage()
Use `getImage()` to convert remote poster images to WebP at build time:

```astro
---
import { getImage } from 'astro:assets';

const posterUrl = 'https://example.com/poster.png';
const optimizedPoster = await getImage({
  src: posterUrl,
  format: 'webp',
  width: 600,
  height: 800,
});
---

<video
  src={videoUrl}
  poster={optimizedPoster.src}
  preload="metadata"
  muted
  playsinline
></video>
```

### Key Benefits
- **Simple**: One attribute, browser handles all complexity
- **Standard**: HTML5 feature designed for this exact use case
- **Performant**: Browser optimizes poster display and transition
- **Build-time optimization**: getImage() converts to WebP during build
- **No JavaScript required**: No event listeners or transition logic needed

### Best Practices
- Use `getImage()` with `format: 'webp'` for ~25-50% smaller file sizes
- Specify width/height to match video dimensions
- Use `preload="metadata"` to load video metadata without full download
- Poster image should be first frame of video for seamless appearance
- Ensure remote image domains are configured in astro.config.mjs

Source: MDN Web Docs - HTML Video Element, Astro Docs - Images