import React from "react";
import LoginForm from "./components/LoginForm";
import { loginPageMetadata } from "../../seo/loginSeo";

export const metadata = loginPageMetadata;

export default function Page() {
  return <LoginForm />;
}
