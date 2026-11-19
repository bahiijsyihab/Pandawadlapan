"use client";

import React from "react";
import type { Member } from "@/types/pandawa";
import { ParallaxLayer } from "./ParallaxLayer";

interface CabinetStructureProps {
  members: Member[];
  onSelectMember: (member: Member) => void;
}

interface CabinetPosition {
  memberId: string;
  code: string;
  title: string;
  duty: string;
}

const LEADERSHIP: CabinetPosition[] = [
  {
    memberId: "pandawa-31",
    code: "01",
    title: "Ketua Angkatan",
    duty: "Pimpinan tertinggi kabinet, penentu arah kebijakan, dan representasi resmi PANDAWA.",
  },
  {
    memberId: "pandawa-02",
    code: "02",
    title: "Wakil Ketua Angkatan",
    duty: "Koordinasi internal lintas jurusan SAINTEK & SOSHUM serta sinergi kegiatan eksternal madrasah.",
  },
];

const COORDINATORS: CabinetPosition[] = [
  {
    memberId: "pandawa-03",
    code: "03",
    title: "Sekretaris",
    duty: "Administrasi, notulensi rapat, dan pengarsipan dokumen resmi angkatan.",
  },
  {
    memberId: "pandawa-04",
    code: "04",
    title: "Bendahara",
    duty: "Manajemen keuangan, transparansi kas, dan perencanaan alokasi kegiatan.",
  },
  {
    memberId: "pandawa-05",
    code: "05",
    title: "Koordinator Media & Dokumentasi",
    duty: "Publikasi resmi, arahan desain visual, dan pengelolaan arsip digital angkatan.",
  },
  {
    memberId: "pandawa-06",
    code: "06",
    title: "Koordinator Acara & Alumni",
    duty: "Perencanaan agenda kebersamaan serta jejaring silaturahmi pasca-kelulusan.",
  },
];

export function CabinetStructure({ members, onSelectMember }: CabinetStructureProps) {
  const byId = Object.fromEntries(members.map((m) => [m.id, m]));
  const resolveMember = (pos: CabinetPosition): Member | undefined => {
    const byRole = members.find(
      (m) => m.role.trim().toLowerCase() === pos.title.trim().toLowerCase()
    );
    return byRole ?? byId[pos.memberId];
  };

  return (
    <section id="struktur" className="py-14 sm:py-20 bg-transparent text-white border-y border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Planto-Style Editorial Header with Oversized Numeral 03 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12 mb-12 border-b border-white/15 items-end">
          <div className="lg:col-span-7 flex items-baseline gap-5">
            <span className="font-display text-5xl sm:text-6xl text-white/20 leading-none select-none">
              03
            </span>
            <div>
              <span className="block text-xs font-medium tracking-widest text-gold uppercase mb-2">
                Struktur Organisasi
              </span>
              <h2 className="font-display text-3xl sm:text-5xl text-white leading-[1.04]">
                Pengurus{" "}
                <span className="font-serif italic font-normal text-gold">&amp; Koordinator</span>
              </h2>
            </div>
          </div>
          <div className="lg:col-span-5">
            <p className="text-white/70 text-base leading-relaxed">
              Enam posisi inti yang menggerakkan tata kelola organisasi, administrasi, dokumentasi,
              dan kegiatan kolektif Angkatan 8 MA.
            </p>
          </div>
        </div>

        {/* Asymmetric 5 : 7 Liquid Glass Cabinet Grid with Staggered Depth Parallax */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (5 cols — offset [40, -40]) */}
          <ParallaxLayer offsetY={40} className="lg:col-span-5 flex flex-col gap-6">
            {LEADERSHIP.map((pos, idx) => {
              const member = resolveMember(pos);
              if (!member) return null;
              const isTop = idx === 0;
              return (
                <button
                  key={pos.memberId}
                  type="button"
                  onClick={() => onSelectMember(member)}
                  className={`group text-left flex-1 rounded-2xl p-6 sm:p-7 backdrop-blur-md border transition-all flex flex-col justify-between gap-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)] ${
                    isTop
                      ? "bg-black/50 text-white border-gold/45 hover:border-gold hover:bg-white/[0.08]"
                      : "bg-black/45 text-white border-white/15 hover:border-gold/50 hover:bg-white/[0.08]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={member.photo_url}
                        alt={member.full_name}
                        loading="lazy"
                        className={`w-16 h-16 rounded-xl object-cover object-top border ${
                          isTop ? "border-gold/60" : "border-white/20"
                        }`}
                      />
                      <div>
                        <span
                          className={`block text-xs font-medium tracking-wider uppercase ${
                            isTop ? "text-gold" : "text-aqua"
                          }`}
                        >
                          {pos.title}
                        </span>
                        <h3 className="mt-1 font-display text-xl sm:text-2xl leading-tight text-white">
                          {member.full_name}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm leading-relaxed text-white/75">
                    {pos.duty}
                  </p>

                  <div className="pt-4 border-t border-white/12 flex items-center justify-between font-mono text-xs text-white/60">
                    <span>
                      #{member.index} • {member.class_group}
                    </span>
                    <span className="text-gold font-medium">
                      Profil →
                    </span>
                  </div>
                </button>
              );
            })}
          </ParallaxLayer>

          {/* Right Column (7 cols — deeper staggered offset [76, -76]) */}
          <ParallaxLayer
            offsetY={76}
            className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 border border-white/15 rounded-2xl overflow-hidden bg-black/45 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.4)] divide-y sm:divide-y-0"
          >
            {COORDINATORS.map((pos, i) => {
              const member = resolveMember(pos);
              if (!member) return null;
              return (
                <button
                  key={pos.memberId}
                  type="button"
                  onClick={() => onSelectMember(member)}
                  className={`group text-left p-6 sm:p-7 bg-transparent hover:bg-white/[0.06] transition-colors flex flex-col justify-between gap-5 ${
                    i % 2 === 0 ? "sm:border-r border-white/12" : ""
                  } ${i < 2 ? "sm:border-b border-white/12" : ""}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-mono text-2xl text-white/25 group-hover:text-gold transition-colors leading-none">
                      {pos.code}
                    </span>
                    <img
                      src={member.photo_url}
                      alt={member.full_name}
                      loading="lazy"
                      className="w-12 h-12 rounded-xl object-cover object-top border border-white/20 group-hover:border-gold transition-colors"
                    />
                  </div>

                  <div>
                    <span className="block font-mono text-[11px] tracking-[0.16em] text-aqua uppercase">
                      {pos.title}
                    </span>
                    <h3 className="mt-1 font-display text-lg text-white leading-snug">
                      {member.full_name}
                    </h3>
                    <p className="mt-2 text-sm text-white/70 leading-relaxed">{pos.duty}</p>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between font-mono text-[11px] text-white/60">
                    <span>
                      #{member.index} • {member.class_group}
                    </span>
                    <span className="text-gold font-medium opacity-75 group-hover:opacity-100">
                      Profil →
                    </span>
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
