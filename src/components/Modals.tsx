"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Headphones,
  Instagram,
  Pause,
  Play,
  Sparkles,
  User,
  Volume2,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import type { Album, Member, VideoItem, WorkItem } from "@/types/pandawa";

// Hook to lock body scroll & close on Escape
function useModalBehavior(isOpen: boolean, onClose: () => void) {
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);
}

/* 1. MEMBER PROFILE MODAL (FR-04) */
export function MemberProfileModal({
  member,
  works,
  onClose,
  onOpenWork,
}: {
  member: Member | null;
  works: WorkItem[];
  onClose: () => void;
  onOpenWork: (work: WorkItem) => void;
}) {
  useModalBehavior(Boolean(member), onClose);
  if (!member) return null;

  const igHandle = member.instagram.replace(/^@/, "");

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="member-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white text-ink shadow-2xl border border-gold/40 animate-modal-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top dark editorial banner */}
        <div className="hero-mesh p-6 sm:p-8 text-white relative">
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal profil"
            className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5">
            <div className="w-28 h-36 rounded-2xl overflow-hidden border-2 border-gold shadow-xl shrink-0 bg-obsidian">
              <img
                src={member.photo_url}
                alt={member.full_name}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="text-center sm:text-left">
              <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                <span className="px-2.5 py-1 rounded-lg bg-gold text-obsidian font-mono text-xs font-bold">
                  #{member.index}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white/15 font-mono text-xs text-aqua">
                  {member.class_group}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white/10 font-mono text-xs text-white/85">
                  &ldquo;{member.nickname}&rdquo;
                </span>
              </div>
              <h3
                id="member-modal-title"
                className="font-display font-extrabold text-2xl sm:text-3xl leading-tight"
              >
                {member.full_name}
              </h3>
              <p className="mt-1 text-gold-soft font-semibold text-sm">{member.role}</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Quote */}
          <div className="p-5 rounded-2xl bg-alabaster border border-royal/15">
            <span className="font-mono text-[11px] uppercase tracking-widest text-royal font-semibold">
              Kutipan Anggota
            </span>
            <p className="mt-2 font-serif italic text-xl text-ink leading-relaxed">
              &ldquo;{member.quote}&rdquo;
            </p>
          </div>

          {/* Instagram Link */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl border border-ink/10 bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-royal/10 text-royal flex items-center justify-center">
                <Instagram className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-xs text-muted">Akun Instagram</span>
                <span className="font-mono text-sm font-semibold text-ink">
                  {member.instagram}
                </span>
              </div>
            </div>
            <a
              href={`https://instagram.com/${igHandle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gold text-obsidian font-semibold text-xs hover:bg-gold-soft transition"
            >
              <span>Kunjungi Profil</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Works by this Member */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-display font-extrabold text-base text-ink flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-royal" />
                <span>Karya di Etalase PANDAWA ({works.length})</span>
              </h4>
            </div>

            {works.length > 0 ? (
              <div className="space-y-2.5">
                {works.map((w) => (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => onOpenWork(w)}
                    className="w-full text-left p-3.5 rounded-2xl bg-alabaster hover:bg-royal/5 border border-ink/10 hover:border-royal/40 flex items-center justify-between gap-3 transition group"
                  >
                    <div className="min-w-0">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-aqua text-obsidian font-mono text-[10px] font-bold mb-1">
                        {w.category}
                      </span>
                      <p className="font-display font-bold text-sm text-ink group-hover:text-royal truncate">
                        {w.title}
                      </p>
                    </div>
                    <span className="font-mono text-xs font-semibold text-royal shrink-0">
                      Buka Karya →
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted italic bg-alabaster rounded-xl p-4 border border-dashed border-ink/15">
                Belum ada karya terpublikasi di etalase digital — kontribusi aktif dalam kegiatan angkatan.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* 2. MULTI-FORMAT WORK PREVIEW MODAL (FR-08 & FR-09) */
export function WorkPreviewModal({
  work,
  author,
  onClose,
  onOpenMember,
}: {
  work: WorkItem | null;
  author: Member | null;
  onClose: () => void;
  onOpenMember: (member: Member) => void;
}) {
  useModalBehavior(Boolean(work), onClose);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    setPlaying(false);
    setProgress(0);
    setDuration(0);
  }, [work?.id]);

  if (!work) return null;

  const toggleAudio = () => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      el.play().catch(() => {});
      setPlaying(true);
    }
  };

  const formatTime = (sec: number) => {
    const s = Math.floor(sec || 0);
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="work-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white text-ink shadow-2xl border border-gold/40 animate-modal-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="hero-mesh p-6 text-white flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-lg bg-aqua text-obsidian font-mono text-xs font-bold">
                {work.category}
              </span>
              {work.year && (
                <span className="px-2.5 py-1 rounded-lg bg-white/10 font-mono text-xs text-gold">
                  {work.year}
                </span>
              )}
            </div>
            <h3 id="work-modal-title" className="font-display font-extrabold text-xl sm:text-2xl">
              {work.title}
            </h3>
            {work.subtitle && <p className="mt-1 text-sm text-white/75">{work.subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup pratinjau karya"
            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center shrink-0 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-Format Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* TEXT READER */}
          {(work.content_type === "text" || work.content_type === "pdf") && (
            <div className="p-6 sm:p-8 rounded-2xl bg-alabaster border border-ink/10">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-ink/10 font-mono text-xs text-royal uppercase tracking-wider">
                <BookOpen className="w-4 h-4" />
                <span>
                  {work.content_type === "text" ? "Mode Baca Editorial" : "Ringkasan Dokumen Proyek"}
                </span>
              </div>
              <div className="whitespace-pre-line font-sans text-base leading-relaxed text-ink/90">
                {work.content_body}
              </div>
            </div>
          )}

          {/* HIGH-RES IMAGE VIEWER */}
          {work.content_type === "image" && (
            <div className="rounded-2xl overflow-hidden bg-obsidian border border-ink/15 shadow-lg">
              <img
                src={work.content_body || work.preview_url}
                alt={work.title}
                className="w-full h-auto object-contain max-h-[60vh]"
              />
            </div>
          )}

          {/* INTERACTIVE AUDIO PLAYER */}
          {work.content_type === "audio" && (
            <div className="rounded-2xl hero-mesh p-6 sm:p-8 text-white border border-gold/30">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="w-24 h-24 rounded-2xl bg-gold/15 border border-gold/40 flex items-center justify-center shrink-0">
                  <Headphones className="w-10 h-10 text-gold" />
                </div>
                <div className="flex-1 w-full space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-aqua uppercase tracking-wider flex items-center gap-2">
                      <Volume2 className="w-4 h-4" />
                      Pemutar Audio Interaktif
                    </span>
                    {/* Equalizer bars */}
                    <div className="flex items-end gap-1 h-5" aria-hidden="true">
                      {[0, 1, 2, 3, 4].map((bar) => (
                        <span
                          key={bar}
                          className={`w-1 rounded-full bg-gold transition-all ${
                            playing ? "animate-eq h-5" : "h-1.5 opacity-40"
                          }`}
                          style={{ animationDelay: `${bar * 140}ms` }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={toggleAudio}
                      aria-label={playing ? "Jeda audio" : "Putar audio"}
                      className="w-12 h-12 rounded-full bg-gold text-obsidian flex items-center justify-center shadow-[0_0_24px_rgba(247,208,70,0.45)] hover:bg-gold-soft transition shrink-0"
                    >
                      {playing ? (
                        <Pause className="w-5 h-5 fill-current" />
                      ) : (
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      )}
                    </button>
                    <div className="flex-1 space-y-1.5">
                      <input
                        type="range"
                        min={0}
                        max={duration || 100}
                        step={0.1}
                        value={progress}
                        aria-label="Posisi pemutaran audio"
                        onChange={(e) => {
                          const t = Number(e.target.value);
                          if (audioRef.current) audioRef.current.currentTime = t;
                          setProgress(t);
                        }}
                        className="w-full accent-gold cursor-pointer"
                      />
                      <div className="flex justify-between font-mono text-[11px] text-white/75">
                        <span>{formatTime(progress)}</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <audio
                ref={audioRef}
                src={work.content_body}
                onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                onEnded={() => setPlaying(false)}
              />
            </div>
          )}

          {/* Author Attribution Footer */}
          {author && (
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-ink/10">
              <div className="flex items-center gap-3">
                <img
                  src={author.photo_url}
                  alt={author.full_name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-royal/30"
                />
                <div>
                  <span className="block font-mono text-[11px] text-muted uppercase">
                    Karya Oleh
                  </span>
                  <span className="font-display font-bold text-base text-ink">
                    {author.full_name}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onOpenMember(author)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-royal text-white font-semibold text-xs hover:bg-abyss transition"
              >
                <User className="w-4 h-4" />
                <span>Lihat Profil Pembuat</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* 3. LAZY-LOADED VIDEO PLAYER MODAL (FR-07) */
export function VideoPlayerModal({
  video,
  onClose,
}: {
  video: VideoItem | null;
  onClose: () => void;
}) {
  useModalBehavior(Boolean(video), onClose);
  if (!video) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian/90 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl rounded-3xl overflow-hidden bg-obsidian border border-gold/40 shadow-2xl animate-modal-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-white/10 text-white">
          <div className="min-w-0">
            <span className="font-mono text-[11px] text-gold uppercase tracking-wider">
              {video.category} • {video.duration}
            </span>
            <h3 id="video-modal-title" className="font-display font-bold text-base sm:text-lg truncate">
              {video.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup pemutar video"
            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center shrink-0 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lazy-loaded iframe mounted ONLY while modal is open */}
        <div className="relative aspect-video w-full bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${video.youtube_id}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>

        {video.description && (
          <p className="px-5 py-4 text-sm text-white/75 border-t border-white/10">
            {video.description}
          </p>
        )}
      </div>
    </div>
  );
}

/* 4. FULL-SCREEN PHOTO LIGHTBOX MODAL (FR-06) */
export function PhotoLightboxModal({
  album,
  photoIndex,
  onChangeIndex,
  onClose,
}: {
  album: Album | null;
  photoIndex: number;
  onChangeIndex: (nextIndex: number) => void;
  onClose: () => void;
}) {
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    setZoomed(false);
  }, [photoIndex, album?.id]);

  useEffect(() => {
    if (!album) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") {
        onChangeIndex((photoIndex + 1) % album.photos.length);
      }
      if (e.key === "ArrowLeft") {
        onChangeIndex((photoIndex - 1 + album.photos.length) % album.photos.length);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [album, photoIndex, onChangeIndex, onClose]);

  if (!album) return null;
  const photo = album.photos[photoIndex];
  if (!photo) return null;

  const prev = () => onChangeIndex((photoIndex - 1 + album.photos.length) % album.photos.length);
  const next = () => onChangeIndex((photoIndex + 1) % album.photos.length);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Lightbox ${album.title}`}
      className="fixed inset-0 z-50 flex flex-col bg-obsidian/95 backdrop-blur-lg text-white animate-fade-in"
      onClick={onClose}
    >
      {/* Top Bar */}
      <div
        className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <span className="font-mono text-xs text-gold">
            {album.title} • {photoIndex + 1} / {album.photos.length}
          </span>
          <p className="text-xs text-white/60 font-mono">
            Gunakan tombol panah ← → atau ESC untuk navigasi
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setZoomed((z) => !z)}
            aria-label={zoomed ? "Perkecil gambar" : "Perbesar gambar"}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono transition"
          >
            {zoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
            <span className="hidden sm:inline">{zoomed ? "100%" : "Perbesar"}</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup lightbox"
            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div
        className="relative flex-1 flex items-center justify-center p-4 sm:p-8 overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={prev}
          aria-label="Foto sebelumnya"
          className="absolute left-3 sm:left-6 z-10 w-12 h-12 rounded-full bg-obsidian/80 border border-white/20 hover:border-gold hover:text-gold flex items-center justify-center transition"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <img
          src={photo.url}
          alt={photo.caption}
          onClick={() => setZoomed((z) => !z)}
          className={`rounded-2xl shadow-2xl border border-white/15 transition-transform duration-300 cursor-zoom-in ${
            zoomed ? "scale-125 sm:scale-150 cursor-zoom-out" : "max-h-[70vh] max-w-[85vw] object-contain"
          }`}
        />

        <button
          type="button"
          onClick={next}
          aria-label="Foto berikutnya"
          className="absolute right-3 sm:right-6 z-10 w-12 h-12 rounded-full bg-obsidian/80 border border-white/20 hover:border-gold hover:text-gold flex items-center justify-center transition"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Caption Bar */}
      <div
        className="px-6 py-4 border-t border-white/10 text-center bg-obsidian/80"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-sm sm:text-base text-white/90 max-w-3xl mx-auto">{photo.caption}</p>
      </div>
    </div>
  );
}
