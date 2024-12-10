import * as path from "path"
import type { GatsbyNode } from "gatsby"

export const createSchemaCustomization: GatsbyNode["createSchemaCustomization"] = ({ actions }) => {
  const { createTypes } = actions

  const typeDefs = `
    type MdxFrontmatter {
      title: String! @defaultValue(value: "Untitled")
      date: Date! @dateformat @defaultValue(value: "2024-01-01")
      slug: String!
      tags: [String!] @defaultValue(value: [])
      type: String! @defaultValue(value: "post")
      banner: String @defaultValue(value: "/images/default-banner.jpg")
    }
  `
  createTypes(typeDefs)
}

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

  // 태그 페이지를 위한 별도의 쿼리 실행
  const tagsResult = await graphql<{
    allMdx: {
      group: Array<{
        fieldValue: string
        totalCount: number
      }>
    }
  }>(`
    query {
      allMdx {
        group(field: { frontmatter: { tags: SELECT } }) {
          fieldValue
          totalCount
        }
      }
    }
  `)

  if (tagsResult.errors) {
    reporter.panicOnBuild('Error loading tags', tagsResult.errors)
    return
  }

  // 태그별 페이지 생성
  const tags = tagsResult.data?.allMdx.group || []

  // 디버깅을 위한 로그
  console.log('Found tags:', tags.map(tag => tag.fieldValue))

  tags.forEach(({ fieldValue: tag }) => {
    console.log(`Creating page for tag: ${tag}`)
    createPage({
      path: `/tags/${tag}`,
      component: path.resolve("./src/templates/tags.tsx"),
      context: {
        tag: tag,
      },
    })
  })

  // 기존 페이지 생성을 위한 쿼리
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
    return
  }

  const nodes = result.data?.allMdx.nodes

  // 기존 페이지와 포스트 생성 로직
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
