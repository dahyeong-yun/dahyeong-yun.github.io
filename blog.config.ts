import type { BlogConfig } from 'theme-astro'

const config: BlogConfig = {
  site: {
    title: 'Polymorlog',
    description: '개발, 성장, 회고를 기록합니다.',
    url: 'https://dahyeong-yun.github.io/',
    author: 'polymorph',
    language: 'ko',
    // 빌드 머신(로컬 KST / GitHub Actions UTC)에 따라 날짜 표기가 달라지지 않도록 고정
    timeZone: 'Asia/Seoul',
  },
  theme: {
    colorScheme: 'dark',
    codeTheme: 'tokyo-night',
    fontFamily: 'Pretendard',
  },
  navigation: [
    { title: 'Blog', href: '/blog' },
    { title: 'Wiki', href: '/wiki' },
    { title: 'Series', href: '/series' },
    { title: 'About', href: '/about' },
  ],
  wiki: {
    title: 'Wiki',
    description: '정리해 둔 정보성 문서들. 계속 고쳐 씁니다.',
  },
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
