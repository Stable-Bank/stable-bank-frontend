import Navbar from "@/components/navbar";
import SiteFooter from "@/components/footer/site-footer";
import { PropsWithChildren } from "react";

export default function SiteLayout({ children }: PropsWithChildren) {
  return (
    <div>
      <Navbar />
      {children}
      <SiteFooter />
    </div>
  );
}
