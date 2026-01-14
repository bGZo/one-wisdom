import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import partytown from '@astrojs/partytown';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://one.bgzo.cc',
  output: 'static',
  integrations: [
    vue(),
    partytown({ config: { forward: ['dataLayer.push', 'gtag'] } }),
    sitemap()
  ],
});
