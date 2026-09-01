"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { logPageView } from "@/app/actions/analytics";

const STORAGE_KEY = "shamba_spot_visitor_id";

function getVisitorId(): string | null {
  try {
    let id = localStorage.getItem(STORAGE_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(STORAGE_KEY, id);
    }
    return id;
  } catch {
    return null;
  }
}

export function TrackPageView() {
  const pathname = usePathname();

  useEffect(() => {
    const visitorId = getVisitorId();
    if (visitorId) {
      logPageView(pathname, visitorId);
    }
  }, [pathname]);

  return null;
}
