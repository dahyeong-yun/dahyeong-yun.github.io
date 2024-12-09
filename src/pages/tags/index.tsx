import * as React from "react"
import { graphql, Link, PageProps } from "gatsby"
import Layout from "../../components/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TagsPageData {
  allMdx: {
    group: Array<{
      fieldValue: string
      totalCount: number
      nodes: Array<{
        frontmatter: {
          title: string
          date: string
        }
      }>
    }>
  }
}

const TagListPage: React.FC<PageProps<TagsPageData>> = ({ data }) => {
  // 태그를 알파벳 순으로 정렬
  const sortedTags = [...data.allMdx.group].sort((a, b) =>
    a.fieldValue.localeCompare(b.fieldValue)
  );

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">All Tags</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sortedTags.map(tag => (
          <Card key={tag.fieldValue}>
            <CardHeader>
              <CardTitle>
                <Link
                  to={`/tags/${tag.fieldValue}`}
                  className="flex items-center justify-between group"
                >
                  <span className="group-hover:text-primary transition-colors">
                    {tag.fieldValue}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {tag.totalCount} {tag.totalCount === 1 ? 'post' : 'posts'}
                  </span>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground">
                {tag.nodes.slice(0, 3).map((post, index) => (
                  <li key={index} className="truncate">
                    {post.frontmatter.title}
                  </li>
                ))}
                {tag.nodes.length > 3 && (
                  <li className="text-primary text-xs mt-1">
                    And {tag.nodes.length - 3} more...
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  )
}

export const query = graphql`
  query AllTagsQuery {
    allMdx {
      group(field: { frontmatter: { tags: SELECT } }) {
        fieldValue
        totalCount
        nodes {
          frontmatter {
            title
            date
          }
        }
      }
    }
  }
`

export default TagListPage
