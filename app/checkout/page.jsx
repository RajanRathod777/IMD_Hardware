import Checkout from "../checkout/components/Checkout";
import { checkoutPageMetadata } from "../../seo/checkoutSeo";

export const metadata = checkoutPageMetadata;

export default function Page() {
  return <Checkout />;
}
