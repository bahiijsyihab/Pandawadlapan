"use client";

import React from "react";
import { ArrowUp, Instagram } from "lucide-react";
import { PandawaLogo } from "./PandawaLogo";

const QUICK_LINKS = [
  { href: "#beranda", label: "Beranda" },
  { href: "#filosofi", label: "Filosofi Logo" },
  { href: "#anggota", label: "Direktori 41 Anggota" },
  { href: "#struktur", label: "Struktur Pengurus" },
  { href: "#arsip", label: "Arsip & Karya" },
];

export function Footer() {
  return (
    <footer className="bg-black/50 backdrop-blur-md text-white border-t border-white/15">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Brand Column */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-3.5">
              <PandawaLogo variant="compact" className="w-12 h-12" />
              <div>
                <span className="block font-display font-extrabold text-xl tracking-wide">
                  PANDAWA
                </span>
                <span className="block font-mono text-xs text-gold tracking-widest uppercase">
                  Pasukan Angkatan 8 MA
                </span>
              </div>
            </div>
            <p className="font-serif italic text-2xl text-gold-soft">
              &ldquo;United in Trust, Stronger Together&rdquo;
            </p>
            <p className="text-sm text-white/70 max-w-md leading-relaxed">
              Portal identitas digital, direktori interaktif 41 anggota, dan arsip terpadu resmi
              Pasukan Angkatan 8 MA. Dibangun untuk menjaga persaudaraan dan dokumentasi karya
              melampaui masa sekolah.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-gold mb-4">
              Navigasi Cepat
            </h4>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-white/75 hover:text-gold transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Back to top */}
          <div className="md:col-span-3 flex flex-col justify-between gap-6">
            <div>
              <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-gold mb-4">
                Terhubung Bersama Kami
              </h4>
              <a
                href="https://instagram.com/pandawadlapan"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/8 hover:bg-white/15 border border-white/15 hover:border-gold/50 transition"
              >
                <Instagram className="w-5 h-5 text-gold" />
                <div>
                  <span className="block text-xs text-white/60">Instagram Resmi</span>
                  <span className="font-mono text-sm font-semibold text-white">
                    @pandawadlapan
                  </span>
                </div>
              </a>
            </div>

            <a
              href="#beranda"
              className="inline-flex items-center gap-2 text-xs font-mono text-aqua hover:text-gold transition w-fit"
            >
              <ArrowUp className="w-4 h-4" />
              <span>Kembali ke Panggung 3D</span>
            </a>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/60">
          <p>© 2026 PANDAWA — Angkatan 8 MA. Seluruh hak cipta dilindungi.</p>
          <p className="text-white/50">41 Anggota • 1 Visi</p>
        </div>
      </div>
    </footer>
  );
}
