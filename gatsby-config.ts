import type {GatsbyConfig, PluginRef} from "gatsby"
import path from "path"
import "dotenv/config"

const shouldAnalyseBundle = process.env.ANALYSE_BUNDLE

const config: GatsbyConfig = {
  siteMetadata: {
    siteTitle: `Polymorlog`,
    siteLanguage: `ko`,
    siteUrl: `https://dahyeong-yun.github.io`,
    siteDescription: `Dahyeong Yun's blog`,
  },
  trailingSlash: `always`,
  plugins: [
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `content`,
        path: path.resolve(`content`),
      },
    },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        mdxOptions: {
          gatsbyRemarkPlugins: [
            {
              resolve: `gatsby-remark-images`,
              options: {
                maxWidth: 1200,
                quality: 90,
                linkImagesToOriginal: false,
                withWebp: true,
                showCaptions: ['title'],
                markdownCaptions: true,
                // 상대 경로 이미지를 처리하기 위한 설정
                backgroundColor: 'transparent',
                disableBgImageOnAlpha: true,
                disableBgImage: true,
              },
            },
          ],
        },
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 1200,
              quality: 90,
              linkImagesToOriginal: false,
              withWebp: true,
              showCaptions: ['title'],
              markdownCaptions: true,
              backgroundColor: 'transparent',
              disableBgImageOnAlpha: true,
              disableBgImage: true,
            },
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        output: `/`,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Polymorlog`,
        short_name: `Polymorlog`,
        description: `Polymorlog`,
        start_url: `/`,
        background_color: `#fff`,
        display: `standalone`,
        icons: [
          {
            src: `/android-chrome-192x192.png`,
            sizes: `192x192`,
            type: `image/png`,
          },
          {
            src: `/android-chrome-512x512.png`,
            sizes: `512x512`,
            type: `image/png`,
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title: siteTitle
                description: siteDescription
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({
                          query: { site, allMdx },
                        }: {
              query: { allMdx: { nodes: Array<any> }; site: { siteMetadata: any } }
            }) =>
              allMdx.nodes.map((node) => {
                const url = site.siteMetadata.siteUrl + node.frontmatter.slug
                const content = `<p>${node.excerpt}</p><div style="margin-top: 50px; font-style: italic;"><strong><a href="${url}">Keep reading</a>.</strong></div><br /> <br />`

                return {
                  title: node.frontmatter.title,
                  date: node.frontmatter.date,
                  excerpt: node.excerpt,
                  url,
                  guid: url,
                  custom_elements: [{"content:encoded": content}],
                }
              }),
            query: `{
  allMdx(sort: {frontmatter: {date: DESC}}) {
    nodes {
      frontmatter {
        title
        date
        slug
      }
      excerpt
    }
  }
}`,
            output: `rss.xml`,
            title: `Polymorlog `,
          },
        ],
      },
    },
    {
      resolve: "gatsby-plugin-google-tagmanager",
      options: {
        id: "GTM-PZRN9ZQC",
        includeInDevelopment: true,
      },
    },
    shouldAnalyseBundle && {
      resolve: `gatsby-plugin-webpack-statoscope`,
      options: {
        saveReportTo: `${__dirname}/public/.statoscope/_bundle.html`,
        saveStatsTo: `${__dirname}/public/.statoscope/_stats.json`,
        open: false,
      },
    },
  ].filter(Boolean) as Array<PluginRef>,
}

export default config

interface IPostTag {
  name: string
  slug: string
}

interface IPost {
  slug: string
  title: string
  defer: boolean
  date: string
  excerpt: string
  contentFilePath: string
  html: string
  timeToRead: number
  wordCount: number
  tags: Array<IPostTag>
  banner: any
  description: string
  canonicalUrl: string
}

interface IAllPost {
  nodes: Array<IPost>
}

interface ISiteMetadata {
  siteTitle: string
  siteTitleAlt: string
  siteHeadline: string
  siteUrl: string
  siteDescription: string
  siteImage: string
  author: string
}
