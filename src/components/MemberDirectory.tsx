"use client";

import React, { useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Instagram,
  LayoutGrid,
  List,
  Search,
  X,
} from "lucide-react";
import type { ClassGroup, Member } from "@/types/pandawa";

const CLASS_FILTERS: ("Semua" | ClassGroup)[] = [
  "Semua",
  "SAINTEK",
  "SOSHUM",
];

const INITIAL_VISIBLE_COUNT = 8;

interface MemberDirectoryProps {
  members: Member[];
  workCountByAuthor: Record<string, number>;
  onSelectMember: (member: Member) => void;
}

function MemberTiltCard({
  member,
  workCount,
  onSelect,
}: {
  member: Member;
  workCount: number;
  onSelect: () => void;
}) {
  const [style, setStyle] = useState<React.CSSProperties>({});

  const handleMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rx = -(y / rect.height - 0.5) * 10;
    const ry = (x / rect.width - 0.5) * 10;
    setStyle({
      transform: `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-3px)`,
      ["--mx" as string]: `${x}px`,
      ["--my" as string]: `${y}px`,
    });
  };

  const handleLeave = () => {
    setStyle({
      transform: "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)",
    });
  };

  return (
    <button
      type="button"
      onClick={onSelect}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={style}
      className="group relative text-left rounded-2xl bg-black/45 backdrop-blur-md border border-white/15 hover:border-gold/55 hover:bg-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-200 overflow-hidden flex flex-col will-change-transform"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 specular-sheen z-20"
      />

      <div className="relative aspect-[4/5] w-full overflow-hidden bg-obsidian">
        <img
          src={member.photo_url}
          alt={`Potret ${member.full_name} — PANDAWA #${member.index}`}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-lg bg-obsidian/85 border border-gold/40 font-mono text-xs font-semibold text-gold">
          #{member.index}
        </span>
        <span className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-lg bg-obsidian/75 border border-white/15 font-mono text-[11px] text-white/90">
          {member.class_group}
        </span>
        {workCount > 0 && (
          <span className="absolute bottom-3 right-3 z-10 px-2 py-0.5 rounded-md bg-aqua text-obsidian font-mono text-[10px] font-bold">
            {workCount} Karya
          </span>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between gap-2.5">
        <div>
          <h3 className="font-display text-base text-white group-hover:text-gold transition-colors leading-snug line-clamp-1">
            {member.full_name}
          </h3>
          <p className="mt-0.5 text-xs font-medium text-aqua line-clamp-1">
            {member.role}
          </p>
          <p className="mt-2 font-serif italic text-sm text-white/70 line-clamp-2 leading-snug">
            &ldquo;{member.quote}&rdquo;
          </p>
        </div>

        <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] truncate">
            <Instagram className="w-3.5 h-3.5 text-gold shrink-0" />
            <span className="truncate">{member.instagram}</span>
          </span>
          <span className="font-mono text-[10px] font-semibold text-gold opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            Profil →
          </span>
        </div>
      </div>
    </button>
  );
}

export function MemberDirectory({
  members,
  workCountByAuthor,
  onSelectMember,
}: MemberDirectoryProps) {
  const [query, setQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState<"Semua" | ClassGroup>("Semua");
  const [viewMode, setViewMode] = useState<"cards" | "index">("cards");
  const [showAll, setShowAll] = useState(false);

  const filteredMembers = useMemo(() => {
    const q = query.trim().toLowerCase();
    return members.filter((m) => {
      const matchClass = selectedClass === "Semua" || m.class_group === selectedClass;
      if (!matchClass) return false;
      if (!q) return true;
      return (
        m.full_name.toLowerCase().includes(q) ||
        m.nickname.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q) ||
        m.index.includes(q) ||
        m.instagram.toLowerCase().includes(q)
      );
    });
  }, [members, query, selectedClass]);

  const isFiltered = query.trim().length > 0 || selectedClass !== "Semua";
  const shouldTruncate = viewMode === "cards" && !isFiltered && !showAll;
  const visibleMembers = shouldTruncate
    ? filteredMembers.slice(0, INITIAL_VISIBLE_COUNT)
    : filteredMembers;
  const hiddenCount = filteredMembers.length - visibleMembers.length;

  return (
    <section id="anggota" className="py-14 sm:py-20 bg-transparent text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Planto-Style Header with Oversized Numeral 02 + Segmented Pill Switcher */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-10 mb-8 border-b border-white/15">
          <div className="max-w-2xl flex items-baseline gap-5">
            <span className="font-display text-5xl sm:text-6xl text-white/20 leading-none select-none">
              02
            </span>
            <div>
              <span className="block text-xs font-medium tracking-widest text-gold uppercase mb-2">
                Direktori Anggota
              </span>
              <h2 className="font-display text-3xl sm:text-5xl text-white leading-[1.04]">
                41 Anggota{" "}
                <span className="font-serif italic font-normal text-gold">Angkatan 8</span>
              </h2>
              <p className="mt-3 text-white/70 text-base leading-relaxed">
                Pilih filter jurusan, cari nama langsung, atau ubah ke{" "}
                <strong className="font-medium text-white">Indeks 41</strong> untuk melihat seluruh
                anggota dalam satu tampilan cepat.
              </p>
            </div>
          </div>

          {/* Planto High-Contrast Segmented Pill Switcher */}
          <div className="flex flex-wrap items-center gap-3">
            <div
              className="inline-flex items-center p-1 rounded-full bg-black/50 backdrop-blur-md border border-white/15"
              role="group"
              aria-label="Mode tampilan direktori"
            >
              <button
                type="button"
                onClick={() => setViewMode("cards")}
                aria-pressed={viewMode === "cards"}
                className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  viewMode === "cards"
                    ? "bg-white text-obsidian"
                    : "text-white/75 hover:text-white"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Kartu</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("index")}
                aria-pressed={viewMode === "index"}
                className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  viewMode === "index"
                    ? "bg-white text-obsidian"
                    : "text-white/75 hover:text-white"
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Indeks 41</span>
              </button>
            </div>

            <div className="font-mono text-xs tracking-wider uppercase text-white bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/15">
              <span className="font-bold text-gold">{visibleMembers.length}</span> /{" "}
              <span className="font-bold">{filteredMembers.length}</span>
            </div>
          </div>
        </div>

        {/* Real-time Search & Class Filter Bar (Liquid Glass) */}
        <div className="mb-8 p-4 rounded-2xl bg-black/40 backdrop-blur-md border border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
          <div className="relative flex-1 max-w-xl">
            <Search className="w-4 h-4 text-white/50 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari nama lengkap, panggilan, peran, atau nomor (#01)..."
              aria-label="Cari anggota PANDAWA"
              className="w-full pl-11 pr-10 py-2.5 rounded-xl bg-white/[0.06] border border-white/15 text-sm text-white placeholder:text-white/45 focus:border-gold focus:bg-white/[0.1] transition"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Hapus pencarian"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div
            className="flex flex-wrap items-center gap-1.5"
            role="group"
            aria-label="Filter kelas anggota"
          >
            {CLASS_FILTERS.map((cls) => {
              const active = selectedClass === cls;
              return (
                <button
                  key={cls}
                  type="button"
                  onClick={() => setSelectedClass(cls)}
                  aria-pressed={active}
                  className={`px-4 py-2 rounded-full font-mono text-xs font-medium transition-all ${
                    active
                      ? "bg-gold text-obsidian border border-gold"
                      : "bg-white/[0.05] text-white/80 hover:bg-white/[0.12] hover:text-white border border-white/15"
                  }`}
                >
                  {cls}
                </button>
              );
            })}
          </div>
        </div>

        {/* CONTENT: CARD GRID OR COMPACT INDEX */}
        {filteredMembers.length > 0 ? (
          viewMode === "cards" ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {visibleMembers.map((member) => (
                  <MemberTiltCard
                    key={member.id}
                    member={member}
                    workCount={workCountByAuthor[member.id] ?? 0}
                    onSelect={() => onSelectMember(member)}
                  />
                ))}
              </div>

              {/* Clean Expand / Collapse Control so scrolling stays effortless */}
              {!isFiltered && filteredMembers.length > INITIAL_VISIBLE_COUNT && (
                <div className="mt-8 pt-6 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-sm text-white/70">
                    {showAll
                      ? `Menampilkan seluruh ${filteredMembers.length} anggota PANDAWA.`
                      : `Menampilkan ${INITIAL_VISIBLE_COUNT} anggota pertama agar navigasi halaman tetap ringkas.`}
                  </p>
                  <div className="flex flex-wrap items-center gap-2.5">
                    {!showAll && (
                      <button
                        type="button"
                        onClick={() => setViewMode("index")}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.06] backdrop-blur-md border border-white/15 text-white font-medium text-sm hover:border-gold/50 hover:bg-white/[0.1] transition-all"
                      >
                        <List className="w-4 h-4 text-gold" />
                        <span>Lihat Indeks Ringkas (41)</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowAll((prev) => !prev)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gold text-obsidian font-semibold text-sm hover:bg-gold-soft transition-colors"
                    >
                      {showAll ? (
                        <>
                          <ChevronUp className="w-4 h-4" />
                          <span>Ringkas Tampilan ({INITIAL_VISIBLE_COUNT} Kartu)</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4" />
                          <span>Tampilkan Semua 41 Kartu (+{hiddenCount})</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* COMPACT EDITORIAL INDEX (Liquid Glass) */
            <div className="rounded-2xl bg-black/40 backdrop-blur-md border border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0">
                {filteredMembers.map((member) => {
                  const worksCount = workCountByAuthor[member.id] ?? 0;
                  return (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => onSelectMember(member)}
                      className="group text-left px-4 py-3.5 border-b border-r border-white/10 hover:bg-white/[0.07] transition-colors flex items-center gap-3.5"
                    >
                      <span className="font-mono text-xs font-semibold text-gold w-7 shrink-0">
                        #{member.index}
                      </span>
                      <img
                        src={member.photo_url}
                        alt={member.full_name}
                        loading="lazy"
                        className="w-10 h-10 rounded-lg object-cover object-top border border-white/15 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-display text-sm text-white group-hover:text-gold truncate">
                            {member.full_name}
                          </span>
                          {worksCount > 0 && (
                            <span className="px-1.5 py-0.5 rounded bg-aqua/25 text-aqua font-mono text-[9px] font-bold shrink-0">
                              {worksCount}K
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-white/60 truncate">
                          <span className="font-mono text-[10px] text-white/75 shrink-0">
                            {member.class_group}
                          </span>
                          <span>•</span>
                          <span className="truncate">{member.role}</span>
                        </div>
                      </div>
                      <span className="font-mono text-[11px] text-gold opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        →
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )
        ) : (
          <div className="py-16 text-center rounded-2xl bg-black/40 backdrop-blur-md border border-dashed border-white/20">
            <p className="font-display text-lg text-white">
              Tidak ada anggota yang cocok dengan pencarian &ldquo;{query}&rdquo;
            </p>
            <p className="mt-1 text-sm text-white/65">
              Coba kata kunci lain atau ubah filter kelas ke Semua.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setSelectedClass("Semua");
              }}
              className="mt-4 px-4 py-2 rounded-full bg-gold text-obsidian font-semibold text-sm hover:bg-gold-soft transition"
            >
              Reset Pencarian
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
