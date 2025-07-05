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

Source: Astro Docs - Images

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