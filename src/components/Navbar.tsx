"use client";

import React, { useEffect, useState } from "react";
import { Menu, X, Users } from "lucide-react";
import { PandawaLogo } from "./PandawaLogo";

const NAV_ITEMS = [
  { id: "beranda", label: "Beranda" },
  { id: "filosofi", label: "Filosofi" },
  { id: "anggota", label: "41 Anggota" },
  { id: "struktur", label: "Struktur" },
  { id: "arsip", label: "Arsip & Karya" },
];

export function Navbar() {
  const [activeId, setActiveId] = useState<string>("beranda");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = NAV_ITEMS.map((item) => document.getElementById(item.id)).filter(
      Boolean
    ) as HTMLElement[];
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-28% 0px -52% 0px", threshold: [0.1, 0.25, 0.5] }
    );

    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, []);

  const handleNavClick = (id: string) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 px-4 sm:px-6 pt-3 sm:pt-4 pointer-events-none">
      <nav
        aria-label="Navigasi Utama PANDAWA"
        className={`pointer-events-auto mx-auto max-w-7xl rounded-2xl transition-all duration-300 ${
          scrolled
            ? "bg-black/45 backdrop-blur-md border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
            : "bg-black/45 backdrop-blur-md border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
        }`}
      >
        <div className="flex items-center justify-between px-4 sm:px-5 h-16">
          {/* Left: Vector Logo + Identity */}
          <a
            href="#beranda"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("beranda");
            }}
            className="flex items-center gap-3 group"
          >
            <PandawaLogo
              variant="compact"
              className="w-9 h-9 transition-transform duration-300 group-hover:scale-105"
            />
            <div className="flex flex-col leading-tight">
              <span className="font-display font-extrabold text-white tracking-wide text-sm sm:text-base">
                PANDAWA
              </span>
              <span className="font-mono text-[10px] sm:text-[11px] text-gold/90 tracking-widest uppercase">
                PANDAWA • Angkatan 8
              </span>
            </div>
          </a>

          {/* Center: Smooth-scroll nav */}
          <ul className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const active = activeId === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.id);
                    }}
                    className={`relative px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                      active ? "text-gold" : "text-white/80 hover:text-white"
                    }`}
                  >
                    {item.label}
                    {active && (
                      <span className="absolute left-3.5 right-3.5 -bottom-0.5 h-0.5 rounded-full bg-gold shadow-[0_0_10px_#F7D046]" />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Right: Primary Gold CTA */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href="#anggota"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("anggota");
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gold text-obsidian font-semibold text-sm shadow-[0_6px_22px_rgba(247,208,70,0.35)] hover:bg-gold-soft hover:-translate-y-0.5 transition-all"
            >
              <Users className="w-4 h-4" />
              <span>Direktori Angkatan</span>
            </a>
          </div>

          {/* Mobile Hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
            aria-expanded={menuOpen}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 text-white hover:bg-white/20 transition"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Drawer */}
        {menuOpen && (
          <div className="lg:hidden border-t border-white/10 px-4 py-4 space-y-1.5 animate-fade-in">
            {NAV_ITEMS.map((item) => {
              const active = activeId === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.id);
                  }}
                  className={`block px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                    active
                      ? "bg-gold/15 text-gold border border-gold/30"
                      : "text-white/85 hover:bg-white/10"
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
            <div className="pt-2 sm:hidden">
              <a
                href="#anggota"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick("anggota");
                }}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-gold text-obsidian font-semibold text-sm"
              >
                <Users className="w-4 h-4" />
                <span>Direktori Angkatan</span>
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
