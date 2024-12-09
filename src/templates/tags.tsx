import * as React from "react"
import { graphql, PageProps } from "gatsby"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Link } from "gatsby"
import Layout from "../components/layout"

interface TagPageData {
  allMdx: {
    nodes: Array<{
      frontmatter: {
        title: string
        date: string
        slug: string
        tags: string[]
      }
      excerpt: string
      id: string
    }>
  }
}

interface TagPageContext {
  tag: string
}

const TagPage: React.FC<PageProps<TagPageData, TagPageContext>> = ({ data, pageContext }) => {
  return (
    <Layout>
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-8">Posts tagged with "{pageContext.tag}"</h1>
        <div className="grid gap-6">
          {data.allMdx.nodes.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <CardTitle>
                  <Link
                    to={post.frontmatter.slug} // 수정된 부분: 앞의 슬래시(/) 제거
                    className="hover:text-primary transition-colors"
                  >
                    {post.frontmatter.title}
                  </Link>
                </CardTitle>
                <CardDescription>
                  {post.frontmatter.date}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p>{post.excerpt}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.frontmatter.tags?.map((tag) => (
                    <Link
                      key={tag}
                      to={`/tags/${tag}`}
                      className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${
                        tag === pageContext.tag
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary hover:bg-secondary/80"
                      }`}
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </Layout>
  )
}

export default TagPage

export const query = graphql`
  query TagPosts($tag: String!) {
    allMdx(
      sort: { frontmatter: { date: DESC } }
      filter: { frontmatter: { tags: { in: [$tag] } } }
    ) {
      nodes {
        frontmatter {
          title
          date(formatString: "YYYY-MM-DD")
          slug
          tags
        }
        excerpt
        id
      }
    }
  }
`
