import ProductViewer from "./components/ProductViwer";
import { generateProductMetadata } from "../../../seo/singleProductSeo";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  return generateProductMetadata({ params: resolvedParams });
}

export default function Page() {
  return <ProductViewer />;
}
