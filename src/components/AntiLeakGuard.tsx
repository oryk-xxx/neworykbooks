"use client";

import { useEffect } from "react";

export function AntiLeakGuard({ watermark }: { watermark: string }) {
  useEffect(() => {
    function onContextMenu(e: MouseEvent) {
      e.preventDefault();
      log("context_menu_blocked");
    }
    function onKey(e: KeyboardEvent) {
      const isDevtools =
        (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key)) ||
        (e.metaKey && e.altKey && ["I", "J", "C"].includes(e.key));
      if (isDevtools) {
        log("devtools_shortcut");
        e.preventDefault();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        log("attempt_save");
        e.preventDefault();
      }
    }
    function onBeforePrint() {
      log("before_print");
    }
    function onResize() {
      const threshold = 160;
      if (window.outerWidth - window.innerWidth > threshold) {
        log("devtools_opened_heuristic");
      }
    }
    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("keydown", onKey);
    window.addEventListener("beforeprint", onBeforePrint);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("beforeprint", onBeforePrint);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  async function log(action: string) {
    try {
      await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action })
      });
    } catch {}
  }

  return (
    <div className="no-select">
      <div className="blurred-watermark">{watermark}</div>
    </div>
  );
}

