import * as React from "react"
import Navigation from "./navigation"
import { siteConfig } from "../config/siteConfig"

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen">
      <Navigation
        navigation={siteConfig.navigation}
        externalLinks={siteConfig.externalLinks}
      />
      <main className="pt-14"> {/* 네비게이션 높이만큼 상단 패딩 추가 */}
        {children}
      </main>
    </div>
  )
}

export default Layout
