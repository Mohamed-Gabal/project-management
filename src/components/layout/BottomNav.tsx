"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { getSidebarLinks } from "@/constants/sidebar-links";

const BottomNav = () => {
  const pathname = usePathname();
  const params = useParams();
  const projectId = params.projectId as string;

  const sidebarLinks = getSidebarLinks(projectId);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 border-t border-black/10 bg-surface-low lg:hidden"
      aria-label="Bottom Navigation"
    >
      <ul className="flex h-16 items-center justify-around px-6">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href;

          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`flex flex-col items-center justify-center gap-1 ${
                  isActive ? "text-primary" : "text-neutral"
                }`}
              >
                <Image
                  src={link.icon}
                  alt=""
                  width={20}
                  height={20}
                  aria-hidden="true"
                />

                <span className="text-[10px] font-medium">
                  {link.mobileLabel}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default BottomNav;
