import * as React from "react"
import { graphql, PageProps } from "gatsby"
import Layout from "../components/layout/layout"

interface PageQueryData {
  mdx: {
    frontmatter: {
      title: string
      slug: string
    }
  }
}

const Page: React.FC<PageProps<PageQueryData>> = ({ data, children }) => {
  const { frontmatter } = data.mdx

  return (
    <Layout>
      <article className="max-w-screen-xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{frontmatter.title}</h1>
        <div className="prose dark:prose-invert max-w-none">
          {children}
        </div>
      </article>
    </Layout>
  )
}

export default Page

export const query = graphql`
  query PageQuery($id: String!) {
    mdx(id: { eq: $id }) {
      frontmatter {
        title
        slug
      }
    }
  }
`
