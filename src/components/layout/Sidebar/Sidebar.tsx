"use client";

import { useState } from "react";
import SidebarContent from "./SidebarContent";

const Sidebar = () => {
  const [isCollapse, setIsCollapse] = useState(false);

  return (
    <aside
      className={`hidden sticky top-0 h-screen flex-col justify-between border-r border-black/10 bg-surface-low p-4 transition-all duration-300 lg:flex ${
        isCollapse ? "w-20" : "w-64"
      }`}
    >
      <SidebarContent
        isCollapsed={isCollapse}
        onToggleCollapse={() => setIsCollapse((prev) => !prev)}
      />
    </aside>
  );
};

export default Sidebar;
