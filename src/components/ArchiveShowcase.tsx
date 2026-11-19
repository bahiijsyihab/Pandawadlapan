"use client";

import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Film,
  FolderOpen,
  Headphones,
  Image as ImageIcon,
  Layers,
  Maximize2,
  Play,
  Sparkles,
  User,
} from "lucide-react";
import type { Album, Member, VideoItem, WorkCategory, WorkItem } from "@/types/pandawa";
import { ParallaxLayer } from "./ParallaxLayer";

type ArchiveTab = "albums" | "videos" | "works";

const WORK_CATEGORIES: ("Semua" | WorkCategory)[] = [
  "Semua",
  "Desain Visual",
  "Karya Tulis",
  "Audio/Musik",
  "Proyek",
];

interface ArchiveShowcaseProps {
  albums: Album[];
  videos: VideoItem[];
  works: WorkItem[];
  membersById: Record<string, Member>;
  onOpenLightbox: (album: Album, photoIndex: number) => void;
  onOpenVideo: (video: VideoItem) => void;
  onOpenWork: (work: WorkItem) => void;
  onOpenMember: (member: Member) => void;
}

export function ArchiveShowcase({
  albums,
  videos,
  works,
  membersById,
  onOpenLightbox,
  onOpenVideo,
  onOpenWork,
  onOpenMember,
}: ArchiveShowcaseProps) {
  const [activeTab, setActiveTab] = useState<ArchiveTab>("albums");
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [workFilter, setWorkFilter] = useState<"Semua" | WorkCategory>("Semua");

  const filteredWorks = useMemo(() => {
    if (workFilter === "Semua") return works;
    return works.filter((w) => w.category === workFilter);
  }, [works, workFilter]);

  const workTypeIcon = (type: WorkItem["content_type"]) => {
    if (type === "text") return BookOpen;
    if (type === "audio") return Headphones;
    if (type === "image") return ImageIcon;
    return Layers;
  };

  return (
    <section id="arsip" className="py-14 sm:py-20 bg-transparent text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Planto-Style Header with Oversized Numeral 04 + Segmented Pill Tabs */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-10 mb-10 border-b border-white/15">
          <div className="max-w-2xl flex items-baseline gap-5">
            <span className="font-display text-5xl sm:text-6xl text-white/20 leading-none select-none">
              04
            </span>
            <div>
              <span className="block text-xs font-medium tracking-widest text-gold uppercase mb-2">
                Arsip &amp; Karya
              </span>
              <h2 className="font-display text-3xl sm:text-5xl text-white leading-[1.04]">
                Memori, Dokumentasi{" "}
                <span className="font-serif italic font-normal text-gold">&amp; Karya Kreatif</span>
              </h2>
              <p className="mt-3 text-white/70 text-base leading-relaxed">
                Album kegiatan, dokumentasi video resmi, serta karya tulis, desain visual, audio, dan
                proyek dari anggota PANDAWA.
              </p>
            </div>
          </div>

          {/* Planto High-Contrast Segmented Pill Tabs (Liquid Glass) */}
          <div
            role="tablist"
            aria-label="Kategori Arsip PANDAWA"
            className="inline-flex flex-wrap p-1.5 rounded-full bg-black/50 backdrop-blur-xl border border-white/15 text-white w-fit"
          >
            {[
              { id: "albums" as const, label: "Album Foto", icon: FolderOpen, count: albums.length },
              { id: "videos" as const, label: "Arsip Video", icon: Film, count: videos.length },
              { id: "works" as const, label: "Etalase Karya", icon: Sparkles, count: works.length },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  type="button"
                  aria-selected={active}
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (tab.id !== "albums") setSelectedAlbum(null);
                  }}
                  className={`relative inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                    active
                      ? "bg-gold text-obsidian"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  <span
                    className={`font-mono text-[11px] px-1.5 py-0.5 rounded-full ${
                      active ? "bg-obsidian/15 text-obsidian" : "bg-white/10 text-white/75"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* TAB 1: ALBUM FOTO (Asymmetric Editorial Bento Grid 7:5 / 5:7) */}
        {activeTab === "albums" && (
          <div className="animate-panel-in">
            {!selectedAlbum ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {albums.map((album, idx) => {
                  const spanClass =
                    idx === 4
                      ? "lg:col-span-12"
                      : idx === 0 || idx === 3
                      ? "lg:col-span-7"
                      : "lg:col-span-5";
                  return (
                    <ParallaxLayer
                      key={album.id}
                      offsetY={idx % 2 === 0 ? 36 : 72}
                      className={`${spanClass} flex`}
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedAlbum(album)}
                        className="w-full group text-left rounded-2xl bg-black/45 backdrop-blur-2xl border border-white/15 hover:border-gold/60 overflow-hidden transition-all flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
                      >
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-obsidian">
                        <img
                          src={album.cover_url}
                          alt={album.title}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-obsidian/85 via-obsidian/20 to-transparent" />
                        <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 rounded-lg bg-obsidian/85 border border-white/15 font-mono text-[11px] text-gold">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{album.date}</span>
                        </div>
                        <div className="absolute top-4 right-4 px-2.5 py-1 rounded-lg bg-gold text-obsidian font-mono text-[11px] font-semibold">
                          {album.photos.length} FOTO
                        </div>
                        <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                          <div>
                            <h3 className="font-display text-2xl text-white leading-tight">
                              {album.title}
                            </h3>
                            {album.description && (
                              <p className="mt-1.5 text-sm text-white/75 line-clamp-2 max-w-lg">
                                {album.description}
                              </p>
                            )}
                          </div>
                          <span className="shrink-0 w-10 h-10 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-center group-hover:bg-gold group-hover:text-obsidian group-hover:border-gold transition-colors">
                            <FolderOpen className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                      </button>
                    </ParallaxLayer>
                  );
                })}
              </div>
            ) : (
              /* Opened Album Photo Gallery */
              <div className="space-y-6 animate-panel-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/15">
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setSelectedAlbum(null)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold text-obsidian text-sm font-semibold hover:bg-gold-soft transition"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Semua Album</span>
                    </button>
                    <div>
                      <h3 className="font-display text-xl text-white">
                        {selectedAlbum.title}
                      </h3>
                      <p className="font-mono text-xs text-white/65">
                        {selectedAlbum.date} • {selectedAlbum.photos.length} Dokumentasi • Klik foto untuk Lightbox Layar Penuh
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {selectedAlbum.photos.map((photo, idx) => (
                    <button
                      key={photo.url}
                      type="button"
                      onClick={() => onOpenLightbox(selectedAlbum, idx)}
                      className="group text-left rounded-2xl bg-black/40 backdrop-blur-xl border border-white/15 hover:border-gold/60 overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col"
                    >
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-obsidian">
                        <img
                          src={photo.url}
                          alt={photo.caption}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-obsidian/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold text-obsidian font-mono text-xs font-bold shadow-lg">
                            <Maximize2 className="w-3.5 h-3.5" />
                            Perbesar
                          </span>
                        </div>
                        <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-obsidian/80 font-mono text-[11px] text-gold">
                          0{idx + 1}
                        </span>
                      </div>
                      <p className="p-3.5 text-xs sm:text-sm text-white/85 leading-snug line-clamp-2">
                        {photo.caption}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ARSIP VIDEO (Liquid Glass) */}
        {activeTab === "videos" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-panel-in">
            {videos.map((video) => (
              <button
                key={video.id}
                type="button"
                onClick={() => onOpenVideo(video)}
                className="group text-left rounded-2xl bg-black/40 backdrop-blur-xl border border-white/15 hover:border-gold/60 hover:bg-white/[0.07] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-obsidian">
                  <img
                    src={video.thumbnail_url}
                    alt={video.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-obsidian/35 group-hover:bg-obsidian/20 transition-colors" />
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-obsidian/80 backdrop-blur-md border border-white/15 font-mono text-xs text-aqua">
                    {video.category}
                  </span>
                  <span className="absolute bottom-4 right-4 px-2.5 py-1 rounded-lg bg-obsidian/85 border border-gold/40 font-mono text-xs font-bold text-gold">
                    {video.duration}
                  </span>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="w-16 h-16 rounded-full bg-gold text-obsidian flex items-center justify-center shadow-[0_0_35px_rgba(247,208,70,0.65)] group-hover:scale-110 transition-transform">
                      <Play className="w-7 h-7 fill-current ml-1" />
                    </span>
                  </div>
                </div>
                <div className="p-5 flex-1">
                  <h3 className="font-display text-lg sm:text-xl text-white group-hover:text-gold transition-colors">
                    {video.title}
                  </h3>
                  {video.description && (
                    <p className="mt-1.5 text-sm text-white/70 leading-relaxed line-clamp-2">
                      {video.description}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* TAB 3: ETALASE KARYA (Liquid Glass) */}
        {activeTab === "works" && (
          <div className="space-y-8 animate-panel-in">
            <div
              className="flex flex-wrap items-center gap-2"
              role="group"
              aria-label="Filter kategori karya"
            >
              {WORK_CATEGORIES.map((cat) => {
                const active = workFilter === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setWorkFilter(cat)}
                    aria-pressed={active}
                    className={`px-4 py-2 rounded-full font-mono text-xs font-semibold transition-all ${
                      active
                        ? "bg-gold text-obsidian"
                        : "bg-black/40 backdrop-blur-xl text-white/80 hover:bg-white/[0.1] hover:text-white border border-white/15"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWorks.map((work) => {
                const author = membersById[work.author_id];
                const TypeIcon = workTypeIcon(work.content_type);
                return (
                  <article
                    key={work.id}
                    className="group rounded-2xl bg-black/40 backdrop-blur-xl border border-white/15 hover:border-gold/60 hover:bg-white/[0.07] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col"
                  >
                    <button
                      type="button"
                      onClick={() => onOpenWork(work)}
                      className="relative aspect-[16/10] w-full overflow-hidden bg-obsidian text-left"
                    >
                      <img
                        src={work.preview_url}
                        alt={work.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute top-3.5 left-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-aqua text-obsidian font-mono text-[11px] font-bold shadow">
                        <TypeIcon className="w-3.5 h-3.5" />
                        {work.category}
                      </span>
                      <span className="absolute bottom-3.5 right-3.5 px-2.5 py-1 rounded-lg bg-obsidian/80 backdrop-blur-md text-gold font-mono text-[11px] border border-gold/30">
                        {work.content_type === "text"
                          ? "Baca Karya"
                          : work.content_type === "audio"
                          ? "Putar Audio"
                          : work.content_type === "image"
                          ? "Lihat HD"
                          : "Buka Dokumen"}
                      </span>
                    </button>

                    <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                      <div>
                        <button
                          type="button"
                          onClick={() => onOpenWork(work)}
                          className="text-left"
                        >
                          <h3 className="font-display text-lg text-white group-hover:text-gold transition-colors leading-snug">
                            {work.title}
                          </h3>
                        </button>
                        {work.subtitle && (
                          <p className="mt-1.5 text-sm text-white/70 line-clamp-2">
                            {work.subtitle}
                          </p>
                        )}
                      </div>

                      {author && (
                        <div className="pt-3.5 border-t border-white/10 flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => onOpenMember(author)}
                            className="inline-flex items-center gap-2.5 text-left group/author min-w-0"
                          >
                            <img
                              src={author.photo_url}
                              alt={author.full_name}
                              className="w-8 h-8 rounded-full object-cover object-top border border-white/25 shrink-0"
                            />
                            <div className="min-w-0">
                              <span className="block text-xs font-bold text-white group-hover/author:text-gold truncate">
                                {author.full_name}
                              </span>
                              <span className="block font-mono text-[10px] text-white/60">
                                #{author.index} • {author.class_group}
                              </span>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => onOpenMember(author)}
                            aria-label={`Buka profil ${author.full_name}`}
                            className="p-2 rounded-lg bg-white/[0.08] text-gold hover:bg-gold hover:text-obsidian transition shrink-0"
                          >
                            <User className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
