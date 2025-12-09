import CartProductViewer from "./components/CartProductViewer";
import { cartPageMetadata } from "../../seo/cartSeo";

export const metadata = cartPageMetadata;

export default function Page() {
  return <CartProductViewer />;
}
