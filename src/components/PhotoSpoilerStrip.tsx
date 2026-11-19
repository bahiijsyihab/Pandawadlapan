"use client";

import React from "react";
import { ArrowDownRight, Maximize2 } from "lucide-react";
import type { Album, Member } from "@/types/pandawa";
import { ParallaxLayer } from "./ParallaxLayer";

interface PhotoSpoilerStripProps {
  featuredAlbum: Album | null;
  members: Member[];
  onOpenLightbox: (album: Album, photoIndex: number) => void;
  onSelectMember: (member: Member) => void;
}

export function PhotoSpoilerStrip({
  featuredAlbum,
  members,
  onOpenLightbox,
  onSelectMember,
}: PhotoSpoilerStripProps) {
  const spoilerMembers = members.slice(0, 14);
  // Duplicate array once for seamless infinite CSS marquee loop
  const marqueeTrack = [...spoilerMembers, ...spoilerMembers];

  return (
    <section
      aria-label="Cuplikan Visual PANDAWA"
      className="py-14 sm:py-20 bg-transparent text-white border-t border-white/10 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 mb-8 border-b border-white/10">
          <div>
            <span className="block text-xs font-medium tracking-widest text-gold uppercase mb-2">
              Cuplikan Momen
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white leading-[1.04]">
              Sekilas Momen{" "}
              <span className="font-serif italic font-normal text-gold">&amp; Wajah PANDAWA</span>
            </h2>
          </div>
          <a
            href="#arsip"
            className="inline-flex items-center gap-1.5 font-mono text-xs tracking-wider uppercase text-white/70 hover:text-gold transition-colors w-fit"
          >
            <span>Lihat Arsip Lengkap</span>
            <ArrowDownRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Asymmetric 12-Col Photo Spoiler Bento with Staggered Depth Parallax */}
        {featuredAlbum && featuredAlbum.photos.length >= 3 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-14">
            {/* Main Wide Landscape Feature (7 cols — slower offset [36, -36]) */}
            <ParallaxLayer offsetY={36} className="lg:col-span-7 flex">
              <button
                type="button"
                onClick={() => onOpenLightbox(featuredAlbum, 0)}
                className="w-full group relative rounded-2xl overflow-hidden bg-black/45 backdrop-blur-2xl border border-white/15 hover:border-gold/70 shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-colors aspect-[16/10] lg:aspect-auto lg:min-h-[400px] text-left"
              >
                <img
                  src={featuredAlbum.photos[0].url}
                  alt={featuredAlbum.photos[0].caption}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian/85 via-obsidian/15 to-transparent" />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-black/55 backdrop-blur-xl border border-white/15 font-mono text-[11px] text-gold">
                  {featuredAlbum.title.toUpperCase()} • {featuredAlbum.date}
                </div>
                <span className="absolute top-4 right-4 w-9 h-9 rounded-lg bg-black/55 backdrop-blur-xl border border-white/15 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-4 h-4 text-gold" />
                </span>
                <div className="absolute bottom-5 left-5 right-5">
                  <p className="font-display text-lg sm:text-xl text-white leading-snug">
                    {featuredAlbum.photos[0].caption}
                  </p>
                </div>
              </button>
            </ParallaxLayer>

            {/* Right Stack (5 cols — deeper staggered offset [72, -72]) */}
            <ParallaxLayer offsetY={72} className="lg:col-span-5 grid grid-cols-2 lg:grid-cols-1 gap-4">
              <button
                type="button"
                onClick={() => onOpenLightbox(featuredAlbum, 2)}
                className="group relative rounded-2xl overflow-hidden bg-black/45 backdrop-blur-2xl border border-white/15 hover:border-gold/70 shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-colors aspect-[16/10] lg:h-[210px] lg:aspect-auto text-left"
              >
                <img
                  src={featuredAlbum.photos[2].url}
                  alt={featuredAlbum.photos[2].caption}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-transparent to-transparent" />
                <div className="absolute bottom-3.5 left-4 right-4">
                  <span className="block font-mono text-[10px] text-gold uppercase tracking-wider mb-0.5">
                    OUTBOUND BANDUNG
                  </span>
                  <p className="text-xs sm:text-sm font-medium text-white line-clamp-1">
                    {featuredAlbum.photos[2].caption}
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onOpenLightbox(featuredAlbum, 1)}
                className="group relative rounded-2xl overflow-hidden bg-black/45 backdrop-blur-2xl border border-white/15 hover:border-gold/70 shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-colors aspect-[16/10] lg:h-[174px] lg:aspect-auto text-left"
              >
                <img
                  src={featuredAlbum.photos[1].url}
                  alt={featuredAlbum.photos[1].caption}
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-transparent to-transparent" />
                <div className="absolute bottom-3.5 left-4 right-4">
                  <span className="block font-mono text-[10px] text-gold uppercase tracking-wider mb-0.5">
                    REKTORAT UNPAD
                  </span>
                  <p className="text-xs sm:text-sm font-medium text-white line-clamp-1">
                    {featuredAlbum.photos[1].caption}
                  </p>
                </div>
              </button>
            </ParallaxLayer>
          </div>
        )}
      </div>

      {/* Smooth Editorial Portrait Filmstrip (Pauses on Hover — Click to Open Profile) */}
      <div className="relative pt-2">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-3 flex items-center justify-between">
          <span className="text-xs font-medium text-white/55">
            Potret Anggota PANDAWA
          </span>
          <a
            href="#anggota"
            className="font-mono text-[11px] text-gold hover:underline uppercase tracking-wider"
          >
            Semua 41 →
          </a>
        </div>

        {/* Left & right obsidian fade masks */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-8 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-obsidian to-transparent z-10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-8 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-obsidian to-transparent z-10"
        />

        <div className="flex w-max animate-spoiler-marquee hover:[animation-play-state:paused] gap-3.5 px-4">
          {marqueeTrack.map((member, i) => (
            <button
              key={`${member.id}-${i}`}
              type="button"
              onClick={() => onSelectMember(member)}
              className="group relative w-32 sm:w-36 shrink-0 rounded-xl overflow-hidden border border-white/12 hover:border-gold transition-colors bg-abyss text-left"
            >
              <div className="aspect-[4/5] w-full overflow-hidden">
                <img
                  src={member.photo_url}
                  alt={member.full_name}
                  loading="lazy"
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-obsidian via-obsidian/80 to-transparent">
                <span className="block font-mono text-[10px] text-gold">
                  #{member.index} • {member.class_group}
                </span>
                <span className="block font-display text-xs text-white truncate">
                  {member.nickname}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
