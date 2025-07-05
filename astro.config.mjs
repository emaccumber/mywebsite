// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://emaccumber.github.io',
  base: '/mywebsite',
  image: {
    domains: ['f004.backblazeb2.com'],
  },
})