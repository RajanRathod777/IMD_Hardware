import ProductViewer from "./components/ProductViwer";
import { generateProductMetadata } from "../../../seo/singleProductSeo";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  try {
    const meta = await generateProductMetadata({ params: resolvedParams });
    return meta;
  } catch (e) {
    console.error("DEBUG: generateMetadata error", e);
    throw e;
  }
}

export default function Page(props) {
  return <ProductViewer />;
}
