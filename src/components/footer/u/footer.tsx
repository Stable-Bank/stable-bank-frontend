import { UFooterLinks } from "@/lib/navigation";
import Link from "next/link";

export default function UFooter() {
  return (
    <div className="mt-auto hidden lg:flex items-center justify-end gap-9 py-2">
      {UFooterLinks.map((link) => (
        <Link
          key={link.label}
          href={link.route}
          className="text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-900 font-sans"
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
