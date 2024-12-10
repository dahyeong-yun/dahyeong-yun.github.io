import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"

const Footer: React.FC = () => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          siteTitle
        }
      }
    }
  `)

  return (
    <footer className="w-full py-6 mt-8 border-t">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center space-y-2 text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} {data.site.siteMetadata.siteTitle}. All rights reserved.
          </p>
          <p className="text-center">
            Built with{" "}
            <a
              href="https://www.gatsbyjs.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4 hover:text-primary"
            >
              Gatsby
            </a>
            {" "}and{" "}
            <a
              href="https://ui.shadcn.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4 hover:text-primary"
            >
              shadcn/ui
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
