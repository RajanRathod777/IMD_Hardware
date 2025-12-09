export async function generateProductMetadata({ params }) {
  const { productId } = params;

  // You can fetch product data here if needed
  // const product = await fetchProduct(productId);

  return {
    title: `Product Details | IMD Hardware`,
    description: `View detailed information about this hardware product from IMD Hardware.`,
    keywords:
      "hardware product, IMD Hardware, locks, door handles, screws, bolts",
    openGraph: {
      title: `Product Details | IMD Hardware`,
      description: `Quality hardware product from IMD Hardware.`,
      url: `https://imdhardware.com/product/${productId}`,
      type: "website",
    },
  };
}
