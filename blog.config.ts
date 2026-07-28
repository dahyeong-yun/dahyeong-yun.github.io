import type { BlogConfig } from 'theme-astro'

const config: BlogConfig = {
  site: {
    title: 'Polymorlog',
    description: '개발, 성장, 회고를 기록합니다.',
    url: 'https://dahyeong-yun.github.io/',
    author: 'polymorph',
    language: 'ko',
  },
  theme: {
    colorScheme: 'dark',
    codeTheme: 'tokyo-night',
    fontFamily: 'Pretendard',
  },
  navigation: [
    { title: 'Blog', href: '/blog' },
    { title: 'Series', href: '/series' },
    { title: 'About', href: '/about' },
  ],
  analytics: {
    gtm: {
      id: 'GTM-WTHZW3K9',
      includeInDevelopment: true,
    },
    ga: {
      id: 'G-GZDF7K86DL', // Google Analytics 4 Measurement ID (e.g. 'G-XXXXXXXXXX')
      includeInDevelopment: true,
    },
  },
  seo: {
    openGraph: true,
    twitterCard: 'summary_large_image',
  },
}

export default config
