// src/components/navigation.tsx
import * as React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import { NavigationItem, ExternalLink } from "../config/siteConfig"
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem
} from "@/components/ui/navigation-menu"
import { ModeToggle } from "./mode-toggle"

interface NavigationProps {
  navigation?: NavigationItem[]
  externalLinks?: ExternalLink[]
}

const Navigation: React.FC<NavigationProps> = ({
                                                 navigation = [],
                                                 externalLinks = []
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
    <nav className="flex justify-between items-center">
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
            {externalLinks.map((link) => (
              <NavigationMenuItem key={link.url}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium hover:text-gray-600 transition-colors"
                >
                  {link.name}
                </a>
              </NavigationMenuItem>
              ))}
          </NavigationMenuList>
        </NavigationMenu>
        <ModeToggle />
      </div>
    </nav>
  )
}

export default Navigation
