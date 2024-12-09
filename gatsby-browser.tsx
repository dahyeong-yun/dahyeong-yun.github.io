// gatsby-browser.tsx
import "./src/styles/global.css"
import React from "react"
import Layout from "./src/components/layout"
import { GatsbyBrowser } from "gatsby"

export const wrapRootElement: GatsbyBrowser["wrapRootElement"] = ({ element }) => {
  return <Layout>{element}</Layout>
}
