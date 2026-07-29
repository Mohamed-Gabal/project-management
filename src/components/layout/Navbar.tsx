"use client";

import { useEffect, useState } from "react";
import { getUser } from "@/services/user";
import menuIcon from "@/assets/icons/menu.svg";
import Image from "next/image";
import { logout } from "@/services/auth";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { getInitials } from "@/lib/utils/getInitials";

// Navbar component props
type NavbarProps = {
  isMenuOpen: boolean;
  onMenuClick: () => void;
};

// User object returned from Supabase
type User = {
  user_metadata: {
    name: string;
    job_title: string;
  };
};

const Navbar = ({ onMenuClick }: NavbarProps) => {
  // Store authenticated user information
  const [user, setUser] = useState<User | null>(null);

  // Control logout dropdown visibility
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  // Handler Logout Delete
  const handleLogout = async () => {
    setIsDropdownOpen(false);

    const result = await logout();

    if (!result.ok) {
      toast.error(result.message);
      return;
    }

    toast.success("Logged out successfully.");
    router.replace("/login");
  };

  // Fetch authenticated user data
  const fetchUser = async () => {
    const result = await getUser();

    if (result.ok) {
      setUser(result.data);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <header className="flex h-20 items-center lg:justify-end justify-between border-b border-neutral-light bg-surface px-6">
      {/* Mobile Menu Button */}
      <button
        type="button"
        onClick={onMenuClick}
        className="lg:hidden"
        aria-label="Open menu"
      >
        <Image src={menuIcon} alt="" width={24} height={24} />
      </button>

      {/* Right section user info + avatar */}
      <div className="relative flex items-center gap-4">
        {/* User Information */}
        <div className="text-right">
          <p className="text-title-md font-semibold text-neutral-dark">
            {user?.user_metadata.name || "User Name"}
          </p>

          <p className="font-bold text-body-md text-neutral">
            {user?.user_metadata.job_title || "Job Title"}
          </p>
        </div>

        {/* User Avatar */}
        <button
          type="button"
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-surface cursor-pointer"
        >
          {getInitials(user?.user_metadata.name || "")}
        </button>
        {/* Logout Dropdown */}
        {isDropdownOpen && (
          <div className="absolute right-0 top-12 z-50 w-44 rounded-lg border border-black/10 bg-white p-2 shadow-lg">
            <button
              onClick={handleLogout}
              type="button"
              className="w-full rounded-md px-3 py-2 text-left text-body-md text-error transition-colors hover:bg-gray-100 cursor-pointer"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
