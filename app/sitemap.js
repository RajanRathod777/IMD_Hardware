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

const baseUrl = "https://imdhardware.com";

export default function sitemap() {
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
      metadata: homePageMetadata,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
      metadata: aboutMetadata,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
      metadata: contactPageMetadata,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
      metadata: productsPageMetadata,
    },
    {
      url: `${baseUrl}/rewards`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
      metadata: rewardsPageMetadata,
    },
    {
      url: `${baseUrl}/cart`,
      lastModified: new Date(),
      changeFrequency: "never",
      priority: 0.1,
      metadata: cartPageMetadata,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "never",
      priority: 0.1,
      metadata: loginPageMetadata,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: "never",
      priority: 0.1,
      metadata: registerPageMetadata,
    },
    {
      url: `${baseUrl}/resetpassword`,
      lastModified: new Date(),
      changeFrequency: "never",
      priority: 0.1,
      metadata: resetPasswordPageMetadata,
    },
    {
      url: `${baseUrl}/updatepassword`,
      lastModified: new Date(),
      changeFrequency: "never",
      priority: 0.1,
      metadata: updatePasswordPageMetadata,
    },
    {
      url: `${baseUrl}/profile`,
      lastModified: new Date(),
      changeFrequency: "never",
      priority: 0.1,
      metadata: profilePageMetadata,
    },
    {
      url: `${baseUrl}/checkout`,
      lastModified: new Date(),
      changeFrequency: "never",
      priority: 0.1,
      metadata: checkoutPageMetadata,
    },
  ];

  // Filter out pages that have 'noindex' in their robots metadata
  const validRoutes = routes.filter((route) => {
    const robots = route.metadata?.robots;
    if (typeof robots === "string") {
      return !robots.includes("noindex");
    }
    if (typeof robots === "object") {
      return !robots.index === false;
    }
    return true;
  });

  return validRoutes.map((route) => ({
    url: route.url,
    lastModified: route.lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
