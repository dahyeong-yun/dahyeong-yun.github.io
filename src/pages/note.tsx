import * as React from "react"
import { graphql, Link, PageProps } from "gatsby"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Layout from "../components/layout/layout"

interface NotePost {
  frontmatter: {
    title: string
    date: string
    tags?: string[]
    slug: string
  }
  excerpt: string
  id: string
}

interface NotePageData {
  allMdx: {
    nodes: NotePost[]
    totalCount: number
  }
}

const NotePage: React.FC<PageProps<NotePageData>> = ({ data }) => {
  const posts = data.allMdx.nodes;

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-8">Notes</h1>
        <div className="grid gap-6">
          {posts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>
                  <Link
                    to={post.frontmatter.slug}
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
                  <p className="text-muted-foreground">{post.excerpt}</p>
                </div>
                {post.frontmatter.tags && (
                  <div className="flex flex-wrap gap-2">
                    {post.frontmatter.tags.map((tag) => (
                      <Link
                        key={tag}
                        to={`/tags/${tag}`}
                        className="text-sm bg-secondary hover:bg-secondary/80 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query {
    allMdx(
      sort: { frontmatter: { date: DESC } }
      filter: { internal: { contentFilePath: { regex: "/content/notes/" } } }
    ) {
      nodes {
        frontmatter {
          title
          date(formatString: "YYYY.MM.DD")
          tags
          slug
        }
        excerpt
        id
      }
      totalCount
    }
  }
`

export default NotePage
