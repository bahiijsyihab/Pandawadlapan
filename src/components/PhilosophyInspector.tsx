"use client";

import React, { useState } from "react";
import { PandawaLogo, type LogoLayer } from "./PandawaLogo";
import { ParallaxLayer } from "./ParallaxLayer";

interface PhilosophyItem {
  id: Exclude<LogoLayer, null>;
  num: string;
  tag: string;
  title: string;
  subtitle: string;
  description: string;
}

const PHILOSOPHY_ITEMS: PhilosophyItem[] = [
  {
    id: "triangle",
    num: "01",
    tag: "STRUKTUR LUAR",
    title: "Bentuk Segitiga Terbalik",
    subtitle: "Solidaritas yang kokoh dan saling menopang",
    description:
      "Geometri segitiga terbalik memusatkan kekuatan 41 individu pada satu titik tumpu kepercayaan — komitmen untuk saling menopang tanpa meninggalkan satu pun anggota.",
  },
  {
    id: "branches",
    num: "02",
    tag: "RUANG NEGATIF",
    title: "Garis Bercabang-cabang",
    subtitle: "Keberagaman latar belakang dan interaksi sosial",
    description:
      "Celah diagonal yang membelah pita menggambarkan ragam karakter, minat, dan dinamika pergaulan lintas kelas yang terhubung dalam satu ritme angkatan.",
  },
  {
    id: "monogram",
    num: "03",
    tag: "INTI IDENTITAS",
    title: "Monogram Huruf P & D",
    subtitle: "Persatuan nama PanDawa Angkatan 8",
    description:
      "Penggabungan konsonan utama dari identitas PanDawa dalam dua pita geometris yang saling mengunci sebagai penanda resmi Pasukan Angkatan 8 MA.",
  },
];

export function PhilosophyInspector() {
  const [activeLayer, setActiveLayer] = useState<LogoLayer>(null);
  const [lockedLayer, setLockedLayer] = useState<LogoLayer>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const effectiveLayer = activeLayer ?? lockedLayer;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: -y * 22, ry: x * 24 });
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0 });
  };

  return (
    <section id="filosofi" className="py-14 sm:py-20 bg-transparent text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Planto-Style Oversized Section Numeral + Editorial Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12 mb-12 border-b border-white/15 items-end">
          <div className="lg:col-span-7 flex items-baseline gap-5">
            <span className="font-display text-5xl sm:text-6xl text-white/20 leading-none select-none">
              01
            </span>
            <div>
              <span className="block text-xs font-medium tracking-widest text-gold uppercase mb-2">
                Filosofi Logo
              </span>
              <h2 className="font-display text-3xl sm:text-5xl text-white leading-[1.04]">
                Makna di Balik{" "}
                <span className="font-serif italic font-normal text-gold">Identitas PANDAWA</span>
              </h2>
            </div>
          </div>
          <div className="lg:col-span-5">
            <p className="text-white/70 text-base leading-relaxed">
              Arahkan kursor atau klik salah satu lapisan di bawah ini untuk membedah struktur
              geometri logo resmi PANDAWA secara real-time pada panggung 3D.
            </p>
          </div>
        </div>

        {/* Asymmetric 5 : 7 Interactive Stage + Staggered Depth Parallax */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Column (5 cols — offset [38, -38]) */}
          <ParallaxLayer offsetY={38} className="lg:col-span-5">
            <div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative h-full min-h-[420px] sm:min-h-[480px] perspective-1000 rounded-2xl bg-black/45 backdrop-blur-md border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-8 flex flex-col items-center justify-center overflow-hidden"
            >
              {/* Subtle architectural hairline crosshair */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)",
                  backgroundSize: "48px 48px",
                }}
              />

              {effectiveLayer && (
                <div className="absolute top-5 left-5 right-5 flex items-center justify-end text-xs">
                  <span className="text-gold font-medium">
                    {effectiveLayer === "triangle"
                      ? "Bentuk Segitiga Terbalik"
                      : effectiveLayer === "branches"
                      ? "Garis Bercabang-cabang"
                      : "Monogram Huruf P & D"}
                  </span>
                </div>
              )}

              {/* Restrained single hairline gold orbital ring */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 flex items-center justify-center"
              >
                <div
                  className="w-72 h-72 rounded-full border border-gold/25 animate-orbit-slow"
                  style={{ ["--tilt" as string]: "70deg" }}
                />
              </div>

              {/* 3D Physically Tilting Official SVG Logo */}
              <div
                className="relative z-10 transition-transform duration-150 ease-out will-change-transform"
                style={{
                  transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateZ(20px)`,
                }}
              >
                <PandawaLogo activeLayer={effectiveLayer} className="w-60 h-60 sm:w-68 sm:h-68" />
              </div>

              <span className="absolute bottom-5 font-mono text-[10px] text-white/45 tracking-[0.2em] uppercase">
                Gerakkan kursor untuk kemiringan 3D
              </span>
            </div>
          </ParallaxLayer>

          {/* Right Column (7 cols — deeper staggered offset [72, -72]) */}
          <ParallaxLayer offsetY={72} className="lg:col-span-7 flex flex-col justify-between gap-3">
            {PHILOSOPHY_ITEMS.map((item) => {
              const isActive = effectiveLayer === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onMouseEnter={() => setActiveLayer(item.id)}
                  onMouseLeave={() => setActiveLayer(null)}
                  onFocus={() => setActiveLayer(item.id)}
                  onBlur={() => setActiveLayer(null)}
                  onClick={() =>
                    setLockedLayer((prev) => (prev === item.id ? null : item.id))
                  }
                  aria-pressed={lockedLayer === item.id}
                  className={`w-full text-left py-6 px-5 sm:px-7 rounded-2xl backdrop-blur-md border transition-all duration-200 flex items-start gap-6 sm:gap-8 ${
                    isActive
                      ? "bg-black/55 text-white border-gold/60 shadow-[0_8px_32px_rgba(0,0,0,0.45)]"
                      : "bg-black/45 text-white border-white/15 hover:bg-white/[0.08] hover:border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
                  }`}
                >
                  <span
                    className={`font-mono text-2xl sm:text-3xl font-semibold leading-none pt-1 shrink-0 ${
                      isActive ? "text-gold" : "text-white/30"
                    }`}
                  >
                    {item.num}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-display text-xl sm:text-2xl leading-tight text-white">
                        {item.title}
                      </h3>
                      {lockedLayer === item.id && (
                        <span className="text-[11px] px-2 py-0.5 rounded bg-gold text-obsidian font-semibold shrink-0">
                          Aktif
                        </span>
                      )}
                    </div>
                    <p
                      className={`font-serif italic text-lg mt-1 ${
                        isActive ? "text-gold" : "text-gold-soft/85"
                      }`}
                    >
                      {item.subtitle}
                    </p>
                    <p className="mt-2.5 text-sm leading-relaxed max-w-xl text-white/75">
                      {item.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </ParallaxLayer>
        </div>
      </div>
    </section>
  );
}
