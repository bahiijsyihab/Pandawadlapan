"use client";

import React from "react";

export function HighlightBar() {
  return (
    <section
      aria-label="Ringkasan Angkatan PANDAWA"
      className="py-12 sm:py-16 bg-transparent text-white border-y border-white/10"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Planto-style Oval Brand Pill Divider */}
        <div className="flex items-center gap-5 mb-12">
          <div className="h-px flex-1 bg-white/15" />
          <span className="px-6 py-1.5 rounded-full bg-white/[0.04] backdrop-blur-xl border border-white/15 font-display text-sm tracking-widest uppercase text-gold">
            PANDAWA • 08
          </span>
          <div className="h-px flex-1 bg-white/15" />
        </div>

        {/* Clean High-Contrast Editorial Metrics inside Liquid Glass Container */}
        <div className="rounded-2xl bg-black/45 backdrop-blur-2xl border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-8 sm:p-10 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 md:divide-x divide-white/12">
          <div className="md:pr-10">
            <span className="font-display text-6xl sm:text-7xl text-gold leading-none">
              41
            </span>
            <h3 className="mt-3 font-display text-lg text-white">Anggota Solid</h3>
            <p className="mt-1 text-sm text-white/70 leading-relaxed">
              Terbagi dalam dua jurusan — SAINTEK dan SOSHUM — dalam satu keluarga angkatan.
            </p>
          </div>

          <div className="md:px-10">
            <span className="font-display text-6xl sm:text-7xl text-white leading-none">
              08
            </span>
            <h3 className="mt-3 font-display text-lg text-white">Angkatan MA</h3>
            <p className="mt-1 text-sm text-white/70 leading-relaxed">
              Generasi kedelapan yang meneruskan tradisi integritas dan kebersamaan madrasah.
            </p>
          </div>

          <div className="md:pl-10">
            <span className="font-display text-6xl sm:text-7xl text-white leading-none">
              01
            </span>
            <h3 className="mt-3 font-display text-lg text-white">Visi Kebersamaan</h3>
            <p className="mt-1 font-serif italic text-lg text-gold">
              United in Trust, Stronger Together.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
