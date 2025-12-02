import Image from "next/image";
import HomePage from "./home/components/Home";

export const metadata = {
  title: "IMD Hardware | Buy Hardware Online",
  description: "Browse and buy hardware products with secure checkout and rewards.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
 <div>
  <HomePage/>
 </div>
  );
}
