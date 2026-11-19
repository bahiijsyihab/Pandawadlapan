"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Copy, Save, Search } from "lucide-react";
import type { ClassGroup, Member } from "@/types/pandawa";

export default function MemberEditorPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetch("/api/members")
      .then((r) => r.json())
      .then((data: Member[]) => {
        setMembers(data);
        setLoading(false);
      })
      .catch(() => {
        setStatus("Gagal memuat data anggota.");
        setLoading(false);
      });
  }, []);

  const updateField = <K extends keyof Member>(index: string, field: K, value: Member[K]) => {
    setMembers((prev) =>
      prev.map((m) => (m.index === index ? { ...m, [field]: value } : m))
    );
    setStatus(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ members }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan");
      setStatus(`Tersimpan! ${data.count} data anggota berhasil ditulis ke src/data/members.json.`);
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Gagal menyimpan data.");
    } finally {
      setSaving(false);
    }
  };

  const handleCopyJson = () => {
    navigator.clipboard?.writeText(JSON.stringify(members, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filtered = members.filter((m) => {
    const q = filter.trim().toLowerCase();
    if (!q) return true;
    return (
      m.index.includes(q) ||
      m.full_name.toLowerCase().includes(q) ||
      m.nickname.toLowerCase().includes(q) ||
      m.class_group.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-alabaster text-ink pb-20">
      {/* Sticky Top Toolbar */}
      <header className="sticky top-0 z-40 bg-obsidian text-white border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Website</span>
            </Link>
            <div>
              <h1 className="font-display text-base sm:text-lg leading-tight">
                Contact Sheet &amp; Editor 41 Anggota
              </h1>
              <p className="font-mono text-[11px] text-white/60">
                Ketik nama langsung di bawah setiap foto, lalu klik Simpan
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-white/50 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Cari nomor/nama..."
                className="pl-8 pr-3 py-1.5 rounded-lg bg-white/10 border border-white/15 text-xs text-white placeholder:text-white/50 w-40 sm:w-48"
              />
            </div>

            <button
              type="button"
              onClick={handleCopyJson}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-aqua" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Tersalin" : "Salin JSON"}</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving || loading}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gold text-obsidian font-semibold text-xs hover:bg-gold-soft disabled:opacity-50 transition"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? "Menyimpan..." : "Simpan ke Website"}</span>
            </button>
          </div>
        </div>

        {status && (
          <div className="bg-gold/15 border-t border-gold/30 px-4 py-2 text-center font-mono text-xs text-gold">
            {status}
          </div>
        )}
      </header>

      {/* Contact Sheet Grid */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 pt-8">
        {loading ? (
          <p className="font-mono text-sm text-muted py-12 text-center">
            Memuat 41 foto anggota...
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map((m) => (
              <div
                key={m.id}
                className="rounded-xl bg-white border border-ink/12 overflow-hidden flex flex-col"
              >
                <div className="relative aspect-[4/5] bg-obsidian overflow-hidden">
                  <img
                    src={m.photo_url}
                    alt={`Foto #${m.index}`}
                    loading="lazy"
                    className="w-full h-full object-cover object-top"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-obsidian/90 border border-gold/50 font-mono text-xs font-bold text-gold">
                    #{m.index}
                  </span>
                </div>

                <div className="p-3 space-y-2 text-xs">
                  <div>
                    <label className="block font-mono text-[10px] text-muted uppercase mb-0.5">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      value={m.full_name}
                      onChange={(e) => updateField(m.index, "full_name", e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-alabaster border border-ink/15 text-ink font-medium focus:bg-white focus:border-royal"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-1.5">
                    <div>
                      <label className="block font-mono text-[10px] text-muted uppercase mb-0.5">
                        Panggilan
                      </label>
                      <input
                        type="text"
                        value={m.nickname}
                        onChange={(e) => updateField(m.index, "nickname", e.target.value)}
                        className="w-full px-2 py-1 rounded-lg bg-alabaster border border-ink/15 text-ink focus:bg-white focus:border-royal"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[10px] text-muted uppercase mb-0.5">
                        Jurusan
                      </label>
                      <select
                        value={m.class_group}
                        onChange={(e) =>
                          updateField(m.index, "class_group", e.target.value as ClassGroup)
                        }
                        className="w-full px-2 py-1 rounded-lg bg-alabaster border border-ink/15 text-ink font-mono text-[11px] focus:bg-white focus:border-royal"
                      >
                        <option value="SAINTEK">SAINTEK</option>
                        <option value="SOSHUM">SOSHUM</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] text-muted uppercase mb-0.5">
                      Peran / Jabatan
                    </label>
                    <input
                      type="text"
                      value={m.role}
                      onChange={(e) => updateField(m.index, "role", e.target.value)}
                      className="w-full px-2.5 py-1 rounded-lg bg-alabaster border border-ink/15 text-ink focus:bg-white focus:border-royal"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] text-muted uppercase mb-0.5">
                      Instagram
                    </label>
                    <input
                      type="text"
                      value={m.instagram}
                      onChange={(e) => updateField(m.index, "instagram", e.target.value)}
                      className="w-full px-2.5 py-1 rounded-lg bg-alabaster border border-ink/15 font-mono text-[11px] text-ink focus:bg-white focus:border-royal"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
