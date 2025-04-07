import * as React from "react"
import {graphql, Link, PageProps} from "gatsby"
import Layout from "../components/layout/layout"
import {FeedItem, BlogPostCard} from "@/components/post/feed-components"

interface Post {
  frontmatter: {
    title: string
    date: string
    tags?: string[]
    slug: string
    type?: 'note' | 'post'
    banner?: string
  }
  excerpt: string
  id: string
}

interface IndexPageData {
  allMdx: {
    nodes: Post[]
  }
}

const IndexPage: React.FC<PageProps<IndexPageData>> = ({data}) => {
  return (
    <Layout>
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-16 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Welcome to Polymorlog</h1>
          <p className="text-xl text-muted-foreground">A place where I share my thoughts and experiences</p>
        </section>

        {/* Unified Feed Section */}
        <section className="max-w-3xl mx-auto">
          <div className="space-y-6">
            {data.allMdx.nodes.map((post) => (
              post.frontmatter.type === 'note' ? (
                <FeedItem key={post.id} post={post}/>
              ) : (
                <BlogPostCard key={post.id} post={post}/>
              )
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
    limit: 30
    filter: { internal: { contentFilePath: { regex: "/content/(posts|notes)/" } } }
  ) {
    nodes {
      frontmatter {
        title
        date(formatString: "YYYY.MM.DD")
        tags
        slug
        type
        banner
      }
      excerpt
      id
    }
  }
}
`

export default IndexPage

export const Head = () => <title>Polymorlog</title>
