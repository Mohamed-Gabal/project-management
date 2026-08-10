import Image, { StaticImageData } from "next/image";
import Link from "next/link";

type SidebarItemProps = {
  href: string;
  label: string;
  icon: StaticImageData;
  isActive: boolean;
  isCollapsed: boolean;
  onNavigate?: () => void;
};

const SidebarItem = ({
  href,
  label,
  icon,
  isActive,
  isCollapsed,
  onNavigate,
}: SidebarItemProps) => {
  return (
    <li>
      <Link
        href={href}
        onClick={onNavigate}
        className={`flex h-10 items-center gap-3 rounded px-3 py-2.5 transition-colors ${
          isActive
            ? "bg-surface text-primary shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
            : "text-neutral-dark hover:bg-surface/60"
        }`}
      >
        <Image src={icon} alt="" width={20} height={20} aria-hidden="true" />

        {!isCollapsed && (
          <span
            className={`text-body-md font-medium ${
              isActive ? "text-primary" : "text-neutral-dark"
            }`}
          >
            {label}
          </span>
        )}
      </Link>
    </li>
  );
};

export default SidebarItem;
