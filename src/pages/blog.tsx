import * as React from "react"
import { graphql, Link, PageProps } from "gatsby"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Layout from "../components/layout"

const ITEMS_PER_PAGE = 5

interface BlogPost {
  frontmatter: {
    title: string
    date: string
    tags: string[]
    slug: string
  }
  excerpt: string
  id: string
}

interface BlogPageData {
  allMdx: {
    nodes: BlogPost[]
    totalCount: number
  }
}

const BlogPage: React.FC<PageProps<BlogPageData>> = ({ data }) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const totalPages = Math.ceil(data.allMdx.totalCount / ITEMS_PER_PAGE);
  const skip = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentPosts = data.allMdx.nodes.slice(skip, skip + ITEMS_PER_PAGE);

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-8">Blog Posts</h1>
        <div className="grid gap-6 mb-8">
          {currentPosts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <CardTitle>
                  <Link
                    to={post.frontmatter.slug} // '/'를 제거
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

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i + 1}
                variant={currentPage === i + 1 ? "default" : "outline"}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </Layout>
  )
}

export const query = graphql`
  query {
    allMdx(
      sort: { frontmatter: { date: DESC } }
      filter: { internal: { contentFilePath: { regex: "/content/posts/" } } }
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

export default BlogPage
