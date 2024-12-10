import * as React from "react"
import { graphql, Link, PageProps } from "gatsby"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Layout from "../components/layout/layout"

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

interface IndexPageData {
  allMdx: {
    nodes: BlogPost[]
  }
}

const IndexPage: React.FC<PageProps<IndexPageData>> = ({ data }) => {
  return (
    <Layout>
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-16 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Welcome to Polymorlog</h1>
          <p className="text-xl text-muted-foreground mb-8">A place where I share my thoughts and experiences</p>
          <Link to="/blog">
            <Button className="text-lg">
              View All Posts
              <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </section>

        {/* Recent Posts Section */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Recent Posts</h2>
            <Link to="/blog" className="text-primary hover:underline">
              View all posts →
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.allMdx.nodes.map((post) => (
              <Card key={post.id} className="flex flex-col">
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
                <CardContent className="flex-1">
                  <div className="mb-4">
                    <p className="text-muted-foreground line-clamp-2">{post.excerpt}</p>
                  </div>
                  {post.frontmatter.tags && (
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {post.frontmatter.tags.slice(0, 3).map((tag) => (
                        <Link
                          key={tag}
                          to={`/tags/${tag}`}
                          className="text-xs bg-secondary hover:bg-secondary/80 px-2 py-1 rounded-lg transition-colors"
                        >
                          {tag}
                        </Link>
                      ))}
                      {post.frontmatter.tags.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{post.frontmatter.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </Layout>
  )
}

export const query = graphql`
  query {
    allMdx(
      sort: { frontmatter: { date: DESC } }
      limit: 9
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
    }
  }
`

export default IndexPage

export const Head = () => <title>Polymorlog</title>
