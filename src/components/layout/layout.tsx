import * as React from "react"
import Navigation from "./navigation"
import Footer from "./footer"
import { siteConfig } from "../../config/site-config"

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation
        navigation={siteConfig.navigation}
        externalLinks={siteConfig.externalLinks}
      />
      <main className="flex-1 pt-14">
        <div className="max-w-screen-xl mx-auto px-4">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Layout
