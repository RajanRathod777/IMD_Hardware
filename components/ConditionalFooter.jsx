"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

const ConditionalFooter = () => {
  const pathname = usePathname();

  // Pages where footer should be hidden
  const hideFooterPages = [
    "/login",
    "/register",
    "/profile",
    "/checkout",
    "/cart",
  ];

  // Check if current page should hide footer
  const shouldHideFooter = hideFooterPages.includes(pathname);

  // Don't render footer on specified pages
  if (shouldHideFooter) {
    return null;
  }

  return <Footer />;
};

export default ConditionalFooter;
