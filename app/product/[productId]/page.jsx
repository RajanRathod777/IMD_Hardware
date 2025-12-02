import ProductViewer from "./components/ProductViwer";

export default function Page() {
  return <ProductViewer />;
}

export async function generateMetadata({ params }) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://imdhardware.com";
  const apiUrl = process.env.NEXT_PUBLIC_SERVER_API_URL;
  try {
    const res = await fetch(`${apiUrl}/product/${params.productId}`, { cache: "no-store" });
    const data = await res.json();
    const product = Array.isArray(data) ? data[0] : data;
    const title = product?.name ? `${product.name} | IMD Hardware` : "Product | IMD Hardware";
    const description = product?.title ?? "Browse product details.";
    const image = product?.images?.[0]
      ? `${apiUrl}/image/product/${product.images[0]}`
      : `${baseUrl}/logo.jpeg`;
    return {
      title,
      description,
      alternates: { canonical: `/product/${params.productId}` },
      openGraph: {
        title,
        description,
        url: `${baseUrl}/product/${params.productId}`,
        images: [{ url: image }],
        siteName: "IMD Hardware",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [image],
      },
    };
  } catch (e) {
    return {
      title: "Product | IMD Hardware",
      description: "Browse product details.",
      alternates: { canonical: `/product/${params.productId}` },
    };
  }
}
