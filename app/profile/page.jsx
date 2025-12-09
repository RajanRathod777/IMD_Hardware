import ProfileManager from "./components/ProfileManager";
import { profilePageMetadata } from "../../seo/profileSeo";

export const metadata = profilePageMetadata;

export default function Page() {
  return <ProfileManager />;
}
