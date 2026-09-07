import { defineConfig } from 'astro/config'
import { blogTheme } from 'theme-astro'
import config from './blog.config'

export default defineConfig({
  integrations: [blogTheme(config)],
})
