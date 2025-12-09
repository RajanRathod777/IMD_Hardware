import { homePageMetadata } from "../seo/homeSeo";
import { metadata as aboutMetadata } from "../seo/aboutSeo";
import { contactPageMetadata } from "../seo/contactSeo";
import { productsPageMetadata } from "../seo/productsSeo";
import { rewardsPageMetadata } from "../seo/rewardsSeo";
import { cartPageMetadata } from "../seo/cartSeo";
import { loginPageMetadata } from "../seo/loginSeo";
import { registerPageMetadata } from "../seo/registerSeo";
import { resetPasswordPageMetadata } from "../seo/resetPasswordSeo";
import { updatePasswordPageMetadata } from "../seo/updatePasswordSeo";
import { profilePageMetadata } from "../seo/profileSeo";
import { checkoutPageMetadata } from "../seo/checkoutSeo";

export default function robots() {
  const allMetadata = [
    { path: "/", metadata: homePageMetadata },
    { path: "/about", metadata: aboutMetadata },
    { path: "/contact", metadata: contactPageMetadata },
    { path: "/products", metadata: productsPageMetadata },
    { path: "/rewards", metadata: rewardsPageMetadata },
    { path: "/cart", metadata: cartPageMetadata },
    { path: "/login", metadata: loginPageMetadata },
    { path: "/register", metadata: registerPageMetadata },
    { path: "/resetpassword", metadata: resetPasswordPageMetadata },
    { path: "/updatepassword", metadata: updatePasswordPageMetadata },
    { path: "/profile", metadata: profilePageMetadata },
    { path: "/checkout", metadata: checkoutPageMetadata },
  ];

  const disallowList = ["/review/*", "/reward-claim/*"];

  allMetadata.forEach((item) => {
    const robots = item.metadata?.robots;
    let isNoIndex = false;

    if (typeof robots === "string") {
      if (robots.includes("noindex")) {
        isNoIndex = true;
      }
    } else if (typeof robots === "object") {
      if (robots.index === false) {
        isNoIndex = true;
      }
    }

    if (isNoIndex) {
      disallowList.push(item.path);
    }
  });

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: disallowList,
    },
    sitemap: "https://imdhardware.com/sitemap.xml",
  };
}
