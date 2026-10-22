// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { remarkMarimo } from '@marimo-team/mdx-marimo/remark';

export default defineConfig({
  site: 'https://ethanmaccumber.com',
  trailingSlash: 'always',
  image: {
    domains: ['f004.backblazeb2.com'],
  },
  integrations: [mdx({ remarkPlugins: [remarkMarimo] })],
})
