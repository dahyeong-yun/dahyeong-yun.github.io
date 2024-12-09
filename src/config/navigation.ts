export type NavigationItem = {
  title: string;
  slug: string;
}

export type ExternalLink = {
  name: string;
  url: string;
}

export const siteConfig = {
  navigation: [
    {
      title: 'Blog',
      slug: '/blog',
    },
    {
      title: 'About',
      slug: '/about',
    },
  ],
  externalLinks: [
    {
      name: 'GitHub',
      url: 'https://github.com/dahyeong-yun',
    },
  ],
}
