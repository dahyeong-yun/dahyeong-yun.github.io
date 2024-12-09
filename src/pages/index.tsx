import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"

const IndexPage: React.FC<PageProps> = () => {
  // @ts-ignore
  return (
    <main>
      <h1>Welcome to My Blog</h1>
      <p>This is the home page of my blog.</p>
      {/* 여기에 원하는 내용을 추가하세요 */}
    </main>
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>Home Page</title>
