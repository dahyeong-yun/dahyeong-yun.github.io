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
      <main className="pt-14 max-w-screen-xl mx-auto w-full flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout
