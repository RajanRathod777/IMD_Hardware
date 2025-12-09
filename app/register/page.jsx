import RegistrationForm from "./components/RegistrationForm";
import { registerPageMetadata } from "../../seo/registerSeo";

export const metadata = registerPageMetadata;

export default function Page() {
  return <RegistrationForm />;
}
