import * as React from "react";
import Navigation from "./navigation";
import { siteConfig } from "../config/siteConfig";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto p-4">
          <Navigation
            navigation={siteConfig.navigation}
            externalLinks={siteConfig.externalLinks}
          />
        </div>
      </header>
      {children}
    </div>
  );
};

export default Layout;
