// src/pages/index.tsx
import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Navigation from "../components/navigation"
import { siteConfig } from "../config/navigation"

const IndexPage: React.FC<PageProps> = () => {
  return (
    <div>
      <header className="border-b">
        <div className="container mx-auto p-4">
          <Navigation
            navigation={siteConfig.navigation}
            externalLinks={siteConfig.externalLinks}
          />
        </div>
      </header>
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
    </div>
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>Home Page</title>
