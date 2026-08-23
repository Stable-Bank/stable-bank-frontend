import { appRoutes } from "@/lib/navigation";
import Image from "next/image";
import Link from "next/link";

export default function UProfileCard({
  user,
  clickable = true,
}: {
  user: {
    id: number;
    username: string;
    avatar: string;
    bgColor: string;
  };
  clickable?: boolean;
}) {
  return clickable ? (
    <Link
      href={`${appRoutes.dashboard.sendTo}/${user.id}`}
      className="group cursor-pointer transition-all duration-300 hover:scale-105"
    >
      <div className="relative aspect-square overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${user.bgColor} opacity-80`}
        />

        <Image
          src={user.avatar}
          alt={`${user.username} avatar`}
          width={103}
          height={94}
          className="h-full w-full object-cover mix-blend-overlay transition-all duration-300 group-hover:mix-blend-normal"
        />

        <div className="absolute inset-0 bg-black/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      <p className="mt-1 text-xs font-mono font-bold text-zinc-600 transition-colors group-hover:text-brand-purple">
        {user.username}
      </p>
    </Link>
  ) : (
    <div className="group cursor-pointer transition-all duration-300 hover:scale-105">
      <div className="relative aspect-square overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${user.bgColor} opacity-80`}
        />

        <Image
          src={user.avatar}
          alt={`${user.username} avatar`}
          width={103}
          height={94}
          className="h-full w-full object-cover mix-blend-overlay transition-all duration-300 group-hover:mix-blend-normal"
        />

        <div className="absolute inset-0 bg-black/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      <p className="mt-1 text-xs font-mono font-bold text-zinc-600 transition-colors group-hover:text-brand-purple">
        {user.username}
      </p>
    </div>
  );
}
