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
    // description 은 그 페이지 제목 아래 한 줄 설명으로 들어간다.
    { title: 'Blog', href: '/blog', description: '겪은 일과 그때 한 생각을 남깁니다.' },
    { title: 'Wiki', href: '/wiki', description: '정리해 둔 정보성 문서들. 계속 고쳐 씁니다.' },
    { title: 'Series', href: '/series', description: '이어서 읽으면 좋은 글들을 묶었습니다.' },
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
