
import React, { memo } from 'react';

interface DesktopSidebarProps {
  children: React.ReactNode;
}

export const DesktopSidebar = memo<DesktopSidebarProps>(({ children }) => (
  <section
    aria-labelledby="products-heading"
    className="overflow-y-auto z-50 w-80 h-fit pt-5 pb-20 transition-all bg-white shadow-md relative top-16"
  >
    <form className="relative pt-5" aria-label="Product filters">
      {children}
    </form>
  </section>
));

DesktopSidebar.displayName = 'DesktopSidebar';