"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";

import logoIcon from "@/assets/icons/logo.svg";
import collapseIcon from "@/assets/icons/collapse.svg";
import logoutIcon from "@/assets/icons/logout.svg";

import { getSidebarLinks } from "@/constants/sidebar-links";
import SidebarItem from "./SidebarItem";

type SidebarContentProps = {
  isCollapsed: boolean;
  showCollapseButton?: boolean;
  onToggleCollapse?: () => void;
  onNavigate?: () => void;
};

const SidebarContent = ({
  isCollapsed,
  showCollapseButton = true,
  onToggleCollapse,
  onNavigate,
}: SidebarContentProps) => {
  const pathname = usePathname();
  const params = useParams();

  const projectId = params.projectId as string;

  const sidebarLinks = getSidebarLinks(projectId);

  return (
    <>
      {/* Top Section */}
      <div className="flex flex-1 flex-col">
        {/* Logo */}
        <div
          className={`mb-6 flex items-center ${
            isCollapsed ? "justify-center" : "gap-2"
          }`}
        >
          <Image src={logoIcon} alt="Taskly Logo" width={24} height={24} />

          {!isCollapsed && (
            <Link
              href="/project"
              className="text-title-md font-bold text-neutral-dark"
            >
              Taskly
            </Link>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1">
          <ul className="flex flex-col gap-1">
            {sidebarLinks.map((link) => (
              <SidebarItem
                key={link.href}
                href={link.href}
                label={link.label}
                icon={link.icon}
                isActive={pathname === link.href}
                isCollapsed={isCollapsed}
                onNavigate={onNavigate}
              />
            ))}
          </ul>
        </nav>
      </div>

      {/* Footer */}
      <footer className="border-t border-black/10 pt-5">
        {showCollapseButton && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className={`mb-5 flex w-full items-center gap-3 text-neutral-dark transition-colors hover:text-primary ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <Image
              src={collapseIcon}
              alt="Collapse sidebar"
              width={10}
              height={10}
              className={`transition-transform duration-300 ${
                isCollapsed ? "rotate-180" : ""
              }`}
            />

            {!isCollapsed && (
              <span className="text-body-md font-medium">Collapse</span>
            )}
          </button>
        )}

        <Link
          href="/"
          className={`flex items-center gap-3 text-error transition-colors hover:opacity-80 ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <Image
            src={logoutIcon}
            alt=""
            width={20}
            height={20}
            aria-hidden="true"
          />

          {!isCollapsed && (
            <span className="text-body-md font-medium">Logout</span>
          )}
        </Link>
      </footer>
    </>
  );
};

export default SidebarContent;
