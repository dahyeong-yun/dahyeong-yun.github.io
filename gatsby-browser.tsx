import "./src/styles/global.css"
import type { GatsbyBrowser } from "gatsby"

export const wrapRootElement: GatsbyBrowser["wrapRootElement"] = ({ element }) => {
  return element
}
