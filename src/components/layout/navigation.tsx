import * as React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import { NavigationItem } from "../../config/site-config"
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem
} from "@/components/ui/navigation-menu"
import { ModeToggle } from "../post/mode-toggle"

interface NavigationProps {
  navigation: NavigationItem[]
}

const Navigation: React.FC<NavigationProps> = ({
                                                 navigation,
                                               }) => {
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
    <nav className="fixed top-0 left-0 right-0 bg-background border-b z-50">
      <div className="flex justify-between items-center max-w-screen-xl mx-auto px-4 h-14">
        <Link
          to="/"
          className="text-xl font-bold hover:text-gray-600 transition-colors"
        >
          {data.site.siteMetadata.siteTitle}
        </Link>

        <div className="flex items-center space-x-6">
          <NavigationMenu>
            <NavigationMenuList className="space-x-6">
              {navigation.map((item) => (
                <NavigationMenuItem key={item.slug}>
                  <Link
                    to={item.slug}
                    className="text-sm font-medium hover:text-gray-600 transition-colors"
                  >
                    {item.title}
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
          <ModeToggle />
        </div>
      </div>
    </nav>
  )
}

export default Navigation
