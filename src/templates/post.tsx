import * as React from "react"
import { graphql, PageProps } from "gatsby"
import { MDXProvider } from "@mdx-js/react"
import Layout from "../components/layout"
import PostHeader from "../components/PostHeader"

interface PostQueryData {
  mdx: {
    frontmatter: {
      title: string
      date: string
      slug: string
      tags?: string[]
    }
  }
}

const components = {
  p: ({ children, ...props }: { children: React.ReactNode }) => (
    <p {...props} style={{ margin: '2rem 0' }} className="leading-7">{children}</p>
  ),
  blockquote: ({ children, ...props }: { children: React.ReactNode }) => (
    <blockquote {...props} style={{ margin: '2rem 0' }} className="pl-4 border-l-4 border-gray-300 italic">
      {children}
    </blockquote>
  ),
  h1: ({ children, ...props }: { children: React.ReactNode }) => (
    <h1 {...props} style={{ margin: '3rem 0 1.5rem' }} className="text-3xl font-bold">{children}</h1>
  ),
  h2: ({ children, ...props }: { children: React.ReactNode }) => (
    <h2 {...props} style={{ margin: '2.5rem 0 1.25rem' }} className="text-2xl font-bold">{children}</h2>
  ),
  h3: ({ children, ...props }: { children: React.ReactNode }) => (
    <h3 {...props} style={{ margin: '2rem 0 1rem' }} className="text-xl font-bold">{children}</h3>
  ),
  ul: ({ children, ...props }: { children: React.ReactNode }) => (
    <ul {...props} style={{ margin: '1.5rem 0' }} className="list-disc pl-6">{children}</ul>
  ),
  ol: ({ children, ...props }: { children: React.ReactNode }) => (
    <ol {...props} style={{ margin: '1.5rem 0' }} className="list-decimal pl-6">{children}</ol>
  ),
  li: ({ children, ...props }: { children: React.ReactNode }) => (
    <li {...props} style={{ margin: '0.5rem 0' }}>{children}</li>
  ),
}

const Post: React.FC<PageProps<PostQueryData>> = ({ data, children }) => {
  const { frontmatter } = data.mdx
  const { title, date, tags } = frontmatter

  return (
    <Layout>
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <article className="w-full py-8 sm:py-12 md:py-16">
          <PostHeader title={title} date={date} tags={tags} />
          <MDXProvider components={components}>
            <div className="prose dark:prose-invert
              prose-sm sm:prose-base md:prose-lg
              w-full
              prose-headings:tracking-tight
              prose-p:leading-relaxed
              prose-pre:overflow-x-auto">
              {children}
            </div>
          </MDXProvider>
        </article>
      </div>
    </Layout>
  )
}

export default Post

export const query = graphql`
  query PostQuery($id: String!) {
    mdx(id: { eq: $id }) {
      frontmatter {
        title
        date(formatString: "YYYY.MM.DD")
        slug
        tags
      }
    }
  }
`
