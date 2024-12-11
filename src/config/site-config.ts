export type NavigationItem = {
  title: string;
  slug: string;
}

export type SocialPlatform = 'github' | 'twitter' | 'linkedin' | 'instagram' | 'threads' | 'facebook' | 'kakaotalk';

export type SocialLink = {
  platform: SocialPlatform;
  url: string;
}

export const siteConfig = {
  navigation: [
    {
      title: 'About',
      slug: '/about',
    },
    {
      title: 'Blog',
      slug: '/blog',
    },
    {
      title: 'Note',
      slug: '/note',
    },
  ],
  social: [
    {
      platform: 'github' as SocialPlatform,
      url: 'https://github.com/dahyeong-yun',
    },
    {
      platform: 'twitter' as SocialPlatform,
      url: 'https://twitter.com/username',
    },
    {
      platform: 'linkedin' as SocialPlatform,
      url: 'https://linkedin.com/in/username',
    },
    // 필요한 다른 소셜 미디어 계정들도 같은 형식으로 추가할 수 있습니다
  ] as SocialLink[],
}
