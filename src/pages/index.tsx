import * as React from "react"
import type {HeadFC, PageProps} from "gatsby"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"

const IndexPage: React.FC<PageProps> = () => {
  return (
    <main className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Welcome to My Blog</CardTitle>
          <CardDescription>A place where I share my thoughts and experiences</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">This is the home page of my blog. Here you'll find articles about...</p>
          <Button>Read Latest Posts</Button>
        </CardContent>
      </Card>
    </main>
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>Home Page</title>
