import * as path from "path"
import type { GatsbyNode } from "gatsby"

export const onCreateWebpackConfig: GatsbyNode["onCreateWebpackConfig"] = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        "@/components": path.resolve(__dirname, "src/components"),
        "@/lib/utils": path.resolve(__dirname, "src/lib/utils"),
      },
    },
  })
}

interface QueryResult {
  allMdx: {
    nodes: Array<{
      id: string
      frontmatter: {
        title: string
        date: string
        slug: string
        tags?: string[]
      }
      internal: {
        contentFilePath: string
      }
      parent: {
        internal: {
          contentFilePath: string
        }
        sourceInstanceName?: string
      } & {
        sourceInstanceName: string
      }
    }>
  }
}

export const createPages: GatsbyNode["createPages"] = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  const result = await graphql<QueryResult>(`
    query {
      allMdx {
        nodes {
          id
          frontmatter {
            title
            date
            slug
            tags
          }
          internal {
            contentFilePath
          }
          parent {
            ... on File {
              sourceInstanceName
            }
          }
        }
      }
    }
  `)

  if (result.errors) {
    reporter.panicOnBuild('Error loading MDX result', result.errors)
  }

  const nodes = result.data?.allMdx.nodes

  // Create pages and posts
  nodes?.forEach(node => {
    const isPage = node.parent.sourceInstanceName === 'pages'

    if (isPage) {
      // Pages
      if (!node.frontmatter.slug) return
      createPage({
        path: node.frontmatter.slug,
        component: `${path.resolve(`./src/templates/page.tsx`)}?__contentFilePath=${node.internal.contentFilePath}`,
        context: { id: node.id },
      })
    } else {
      // Blog posts
      const slug = node.frontmatter.slug
      if (!slug) {
        reporter.warn(`A blog post is missing a slug: ${node.frontmatter.title}`)
        return
      }

      createPage({
        path: slug,
        component: `${path.resolve(`./src/templates/post.tsx`)}?__contentFilePath=${node.internal.contentFilePath}`,
        context: {
          id: node.id,
          previousPostId: null,
          nextPostId: null
        },
      })
    }
  })
}
