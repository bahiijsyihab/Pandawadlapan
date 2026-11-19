"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Instagram,
  Share2,
  Sparkles,
} from "lucide-react";
import type { Member, WorkItem } from "@/types/pandawa";
import { PandawaLogo } from "./PandawaLogo";
import { WorkPreviewModal } from "./Modals";

interface YearbookProfileClientProps {
  member: Member;
  works: WorkItem[];
  prevMember: Member;
  nextMember: Member;
}

function getFallbackInterests(member: Member): string[] {
  const base = member.class_group === "SAINTEK" ? ["Sains & Teknologi", "Ngaji"] : ["Sosial & Humaniora", "Ngaji"];
  const roleLower = member.role.toLowerCase();
  if (roleLower.includes("media") || roleLower.includes("foto") || roleLower.includes("video")) {
    return [...base, "Fotografi", "Visual Kreatif"];
  }
  if (roleLower.includes("musik") || roleLower.includes("seni")) {
    return [...base, "Musik", "Seni Kreatif"];
  }
  if (roleLower.includes("olahraga") || roleLower.includes("futsal")) {
    return [...base, "Olahraga", "Futsal"];
  }
  if (roleLower.includes("ketua") || roleLower.includes("koordinator")) {
    return [...base, "Kepemimpinan", "Organisasi"];
  }
  return [...base, "Nongkrong Bareng", "Kebersamaan"];
}

export function YearbookProfileClient({
  member,
  works,
  prevMember,
  nextMember,
}: YearbookProfileClientProps) {
  const [copied, setCopied] = useState(false);
  const [activeWork, setActiveWork] = useState<WorkItem | null>(null);

  const igHandle = member.instagram.replace(/^@/, "");
  const interests =
    member.interests && member.interests.length > 0
      ? member.interests
      : getFallbackInterests(member);

  const storyText =
    member.story && member.story.trim().length > 0
      ? member.story
      : `Menjadi bagian dari 41 anggota PANDAWA di jurusan ${member.class_group} adalah perjalanan yang tak tergantikan. Dari rutinitas ngaji, belajar bersama di kelas, hingga cerita santai sepulang kegiatan — semua tersimpan rapi sebagai bagian dari kenangan terbaik di MA Al-Hikmah 2.`;

  const handleCopyLink = () => {
    if (typeof window === "undefined") return;
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-obsidian text-white relative overflow-x-hidden">
      {/* Subtle Ambient Background (Zero heavy blur cost) */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage:
            "radial-gradient(560px circle at 18% 15%, rgba(91, 33, 182, 0.28), transparent 70%), radial-gradient(480px circle at 85% 75%, rgba(247, 208, 70, 0.12), transparent 70%)",
        }}
      />

      {/* Top Sticky Minimal Yearbook Bar */}
      <header className="sticky top-0 z-40 bg-black/50 backdrop-blur-md border-b border-white/10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link
            href="/#anggota"
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-white/80 hover:text-gold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Portal</span>
          </Link>

          <Link href="/" className="inline-flex items-center gap-2.5">
            <PandawaLogo variant="compact" className="w-7 h-7" />
            <span className="font-mono text-xs tracking-widest uppercase text-gold">
              YEARBOOK • #{member.index}
            </span>
          </Link>

          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/15 text-xs font-medium transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-aqua" />
                <span className="text-aqua">Link Tersalin</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-gold" />
                <span className="hidden sm:inline">Bagikan Profil</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Yearbook Editorial Spread */}
      <main className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column (5 cols): Portrait & Quick Identity Card */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-5">
            <div className="rounded-3xl overflow-hidden bg-black/45 backdrop-blur-md border border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
              <div className="relative aspect-[4/5] w-full bg-obsidian overflow-hidden">
                <img
                  src={member.photo_url}
                  alt={`Potret ${member.full_name}`}
                  className="w-full h-full object-cover object-top"
                />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/70 border border-gold/50 font-mono text-xs font-bold text-gold">
                  #{member.index} / 41
                </span>
                <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/70 border border-white/20 font-mono text-xs text-white">
                  {member.class_group}
                </span>
              </div>

              <div className="p-5 flex items-center justify-between gap-3 border-t border-white/10">
                <div className="min-w-0">
                  <span className="block text-[11px] font-mono text-white/55 uppercase">
                    Instagram
                  </span>
                  <span className="block font-mono text-sm text-white truncate">
                    {member.instagram}
                  </span>
                </div>
                {igHandle && igHandle !== "-" && (
                  <a
                    href={`https://instagram.com/${igHandle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gold text-obsidian font-semibold text-xs hover:bg-gold-soft transition shrink-0"
                  >
                    <Instagram className="w-3.5 h-3.5" />
                    <span>Buka IG</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column (7 cols): Editorial Bio, Interests, Story, Works */}
          <div className="lg:col-span-7 space-y-6">
            {/* Name & Quote Header */}
            <div className="pb-6 border-b border-white/15">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-gold/15 border border-gold/40 text-gold text-xs font-medium">
                  {member.role}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/[0.06] border border-white/15 text-white/80 text-xs font-mono">
                  Panggilan: {member.nickname}
                </span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.02]">
                {member.full_name}
              </h1>

              <blockquote className="mt-5 pl-4 border-l-2 border-gold font-serif italic text-xl sm:text-2xl text-gold-soft leading-relaxed">
                &ldquo;{member.quote}&rdquo;
              </blockquote>
            </div>

            {/* Minat & Hobi */}
            <section className="rounded-2xl bg-black/45 backdrop-blur-md border border-white/15 p-6">
              <h2 className="font-mono text-xs tracking-widest uppercase text-gold mb-4">
                Minat &amp; Hobi
              </h2>
              <div className="flex flex-wrap gap-2">
                {interests.map((tag) => (
                  <span
                    key={tag}
                    className="px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/15 text-sm text-white/90"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>

            {/* Cerita & Kesan Pesan */}
            <section className="rounded-2xl bg-black/45 backdrop-blur-md border border-white/15 p-6">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-gold" />
                <h2 className="font-mono text-xs tracking-widest uppercase text-gold">
                  Cerita &amp; Kesan Pesan
                </h2>
              </div>
              <p className="text-base text-white/85 leading-relaxed whitespace-pre-line">
                {storyText}
              </p>
            </section>

            {/* Etalase Karya Pribadi */}
            <section className="rounded-2xl bg-black/45 backdrop-blur-md border border-white/15 p-6">
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-gold" />
                  <h2 className="font-mono text-xs tracking-widest uppercase text-gold">
                    Karya di Etalase PANDAWA ({works.length})
                  </h2>
                </div>
              </div>

              {works.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {works.map((w) => (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => setActiveWork(w)}
                      className="group text-left rounded-xl overflow-hidden bg-white/[0.04] hover:bg-white/[0.09] border border-white/15 hover:border-gold/50 transition-all flex flex-col"
                    >
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-obsidian">
                        <img
                          src={w.preview_url}
                          alt={w.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-aqua text-obsidian font-mono text-[10px] font-bold">
                          {w.category}
                        </span>
                      </div>
                      <div className="p-3.5">
                        <h3 className="font-display text-sm text-white group-hover:text-gold transition-colors line-clamp-1">
                          {w.title}
                        </h3>
                        {w.subtitle && (
                          <p className="mt-1 text-xs text-white/65 line-clamp-2">{w.subtitle}</p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-white/60 leading-relaxed">
                  Belum ada karya terpublikasi di etalase digital — kontribusi aktif bersama
                  keluarga besar PANDAWA Angkatan 8.
                </p>
              )}
            </section>
          </div>
        </div>

        {/* Bottom Yearbook Page-Turn Navigation (Prev / Directory / Next) */}
        <nav
          aria-label="Navigasi halaman yearbook"
          className="mt-14 pt-8 border-t border-white/15 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center"
        >
          <Link
            href={`/anggota/${prevMember.id}`}
            className="group p-4 rounded-2xl bg-black/45 backdrop-blur-md border border-white/15 hover:border-gold/60 transition flex items-center gap-3"
          >
            <ChevronLeft className="w-5 h-5 text-gold shrink-0 group-hover:-translate-x-0.5 transition-transform" />
            <div className="min-w-0">
              <span className="block font-mono text-[10px] text-white/50 uppercase">
                Sebelumnya • #{prevMember.index}
              </span>
              <span className="block font-display text-sm text-white group-hover:text-gold truncate">
                {prevMember.full_name}
              </span>
            </div>
          </Link>

          <Link
            href="/#anggota"
            className="text-center font-mono text-xs tracking-widest uppercase text-white/70 hover:text-gold py-3 transition-colors"
          >
            Semua 41 Anggota
          </Link>

          <Link
            href={`/anggota/${nextMember.id}`}
            className="group p-4 rounded-2xl bg-black/45 backdrop-blur-md border border-white/15 hover:border-gold/60 transition flex items-center justify-end gap-3 text-right"
          >
            <div className="min-w-0">
              <span className="block font-mono text-[10px] text-white/50 uppercase">
                Berikutnya • #{nextMember.index}
              </span>
              <span className="block font-display text-sm text-white group-hover:text-gold truncate">
                {nextMember.full_name}
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-gold shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </nav>
      </main>

      {/* Work Preview Modal inside Yearbook page */}
      <WorkPreviewModal
        work={activeWork}
        author={member}
        onClose={() => setActiveWork(null)}
        onOpenMember={() => setActiveWork(null)}
      />
    </div>
  );
}
