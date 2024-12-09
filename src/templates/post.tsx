import * as React from "react"
import { graphql, PageProps } from "gatsby"
import { MDXProvider } from "@mdx-js/react"
import Layout from "../components/layout"

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

interface MDXComponentProps {
  children?: React.ReactNode
  className?: string
  [key: string]: any
}

// MDX 컴포넌트들에 대한 스타일 재정의
const components = {
  // 텍스트 블록 요소들
  p: ({ children, ...props }: MDXComponentProps) => (
    <p {...props} style={{ margin: '2rem 0' }} className="leading-7">{children}</p>
  ),
  blockquote: ({ children, ...props }: MDXComponentProps) => (
    <blockquote {...props} style={{ margin: '2rem 0' }} className="pl-4 border-l-4 border-gray-300 italic">
      {children}
    </blockquote>
  ),

  // 헤딩 요소들
  h1: ({ children, ...props }: MDXComponentProps) => (
    <h1 {...props} style={{ margin: '3rem 0 1.5rem' }} className="text-3xl font-bold">{children}</h1>
  ),
  h2: ({ children, ...props }: MDXComponentProps) => (
    <h2 {...props} style={{ margin: '2.5rem 0 1.25rem' }} className="text-2xl font-bold">{children}</h2>
  ),
  h3: ({ children, ...props }: MDXComponentProps) => (
    <h3 {...props} style={{ margin: '2rem 0 1rem' }} className="text-xl font-bold">{children}</h3>
  ),

  // 리스트 요소들
  ul: ({ children, ...props }: MDXComponentProps) => (
    <ul {...props} style={{ margin: '1.5rem 0' }} className="list-disc pl-6">{children}</ul>
  ),
  ol: ({ children, ...props }: MDXComponentProps) => (
    <ol {...props} style={{ margin: '1.5rem 0' }} className="list-decimal pl-6">{children}</ol>
  ),
  li: ({ children, ...props }: MDXComponentProps) => (
    <li {...props} style={{ margin: '0.5rem 0' }}>{children}</li>
  ),
}

const Post: React.FC<PageProps<PostQueryData>> = ({ data, children }) => {
  const { frontmatter } = data.mdx
  const { title, date, tags } = frontmatter

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <article className="max-w-4xl mx-auto py-16 sm:py-20 lg:py-24">
          <header className="mb-12 md:mb-16">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              {title}
            </h1>
            <div className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
              {date}
            </div>
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          <MDXProvider components={components}>
            <div className="prose dark:prose-invert prose-base md:prose-lg lg:prose-xl max-w-none">
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
