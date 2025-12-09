import Image from "next/image";
import HomePage from "./home/components/Home";
import { homePageMetadata } from "../seo/homeSeo";

export const metadata = homePageMetadata;

export default function Home() {
  return (
    <div>
      <HomePage/>
    </div>
  );
}
