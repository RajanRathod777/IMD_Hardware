import { productsPageMetadata } from "../../seo/productsSeo";
import Products from "./components/Products";
import { Suspense } from "react";
import Loading from "../../components/Loading";

export const metadata = productsPageMetadata;

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <Products />
    </Suspense>
  );
}
