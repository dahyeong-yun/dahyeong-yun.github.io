import * as React from "react"
import { graphql, PageProps } from "gatsby"
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

const Post: React.FC<PageProps<PostQueryData>> = ({ data, children }) => {
  const { frontmatter } = data.mdx
  const { title, date, tags } = frontmatter

  return (
    <Layout>
      <article className="max-w-screen-xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-4">{title}</h1>
          <div className="text-gray-600 dark:text-gray-400 mb-4">{date}</div>
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-sm bg-gray-100 dark:bg-gray-800 rounded"
                >
                 {tag}
               </span>
              ))}
            </div>
          )}
        </header>
        <div className="prose dark:prose-invert max-w-none">
          {children}
        </div>
      </article>
    </Layout>
  )
}

export default Post

export const query = graphql`
 query PostQuery($id: String!) {
   mdx(id: { eq: $id }) {
     frontmatter {
       title
       date
       slug
       tags
     }
   }
 }
`
