import ContactPage from "./components/ContactPage";
import { contactPageMetadata } from "../../seo/contactSeo";

export const metadata = contactPageMetadata;

export default function Page() {
  return <ContactPage />;
}
