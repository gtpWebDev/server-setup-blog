import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// needed because react routes by default leave the user scrolled where they were before the click

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
