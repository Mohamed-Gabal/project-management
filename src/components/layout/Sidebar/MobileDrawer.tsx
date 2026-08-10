"use client";

import { useEffect } from "react";
import SidebarContent from "./SidebarContent";

type MobileDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

const MobileDrawer = ({ isOpen, onClose }: MobileDrawerProps) => {
  // Close on Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 lg:hidden ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "pointer-events-none opacity-0"
        }`}
      />

      {/* Drawer */}
      <aside
        id="mobile-sidebar"
        aria-label="Mobile navigation"
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col bg-surface-low p-4 shadow-xl transition-transform duration-300 lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent
          isCollapsed={false}
          showCollapseButton={false}
          onNavigate={onClose}
        />
      </aside>
    </>
  );
};

export default MobileDrawer;
