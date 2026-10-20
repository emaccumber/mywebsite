// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://ethanmaccumber.com',
  trailingSlash: 'always',
  image: {
    domains: ['f004.backblazeb2.com'],
  },
  integrations: [mdx()],
})