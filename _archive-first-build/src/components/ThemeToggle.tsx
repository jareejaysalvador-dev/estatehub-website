"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "@phosphor-icons/react";

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    if (current === "light" || current === "dark") setTheme(current);
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("estatehub-theme", next);
    } catch {
      // localStorage unavailable (private mode, etc). Preference just won't persist.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      className={
        className ??
        "flex h-9 w-9 items-center justify-center rounded-full border border-border/70 text-foreground/80 transition-colors hover:text-foreground"
      }
    >
      {theme === "dark" ? (
        <Sun size={17} weight="light" />
      ) : (
        <Moon size={17} weight="light" />
      )}
    </button>
  );
}
