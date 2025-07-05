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