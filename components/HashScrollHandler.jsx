'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Handles smooth scrolling to hash anchors after navigation.
 * When the user navigates to /#section-id from another page,
 * this component waits for the DOM to mount and then scrolls.
 */
export default function HashScrollHandler() {
  const pathname = usePathname();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    const id = hash.replace('#', '');
    // Give the page time to render before scrolling
    const timer = setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Clean the hash from URL without re-navigation
        window.history.replaceState(null, '', pathname);
      }
    }, 120);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null; // Renders nothing — purely behavioural
}
