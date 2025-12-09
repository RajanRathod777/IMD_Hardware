import UpdatePassword from "./components/UpdatePassword";
import { updatePasswordPageMetadata } from "../../seo/updatePasswordSeo";

export const metadata = updatePasswordPageMetadata;

export default function Page() {
  return <UpdatePassword />;
}
