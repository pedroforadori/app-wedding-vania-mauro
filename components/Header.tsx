"use client";

import { useEffect, useState } from "react";
import { COUPLE_NAMES, NAV_ITEMS } from "@/lib/constants";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        isScrolled
          ? "bg-primary/95 shadow-sm backdrop-blur-sm"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-10">
        <a
          href="#home"
          className="font-serif text-lg tracking-wide text-secondary"
        >
          {COUPLE_NAMES}
        </a>

        <nav className="hidden gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm uppercase tracking-wide text-secondary/80 transition-colors hover:text-accent"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex flex-col gap-1.5 md:hidden"
        >
          <span
            className={`h-px w-6 bg-secondary transition-transform ${
              isOpen ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`h-px w-6 bg-secondary transition-opacity ${
              isOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`h-px w-6 bg-secondary transition-transform ${
              isOpen ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {isOpen && (
        <nav className="flex flex-col gap-1 border-t border-border bg-primary px-6 py-4 md:hidden">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="rounded px-2 py-3 text-sm uppercase tracking-wide text-secondary/80 hover:bg-muted hover:text-accent"
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
