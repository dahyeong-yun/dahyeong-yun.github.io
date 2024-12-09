import * as React from "react"
import Navigation from "./navigation"
import { siteConfig } from "../config/siteConfig"

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen overflow-x-hidden"> {/* overflow-x-hidden 추가 */}
      <Navigation
        navigation={siteConfig.navigation}
        externalLinks={siteConfig.externalLinks}
      />
      <main className="pt-14 max-w-screen-xl mx-auto w-full">
        {children}
      </main>
    </div>
  )
}

export default Layout
