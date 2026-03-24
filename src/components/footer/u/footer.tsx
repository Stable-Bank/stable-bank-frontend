import { UFooterLinks } from "@/lib/navigation";
import Link from "next/link";

export default function UFooter() {
  return (
    <div className="mt-auto hidden lg:flex items-center justify-end gap-9">
      {UFooterLinks.map((link) => (
        <Link
          key={link.label}
          href={link.route}
          className="transform text-sm font-normal text-white/60 transition-all duration-200 ease-linear hover:text-base hover:text-white"
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
