import type { Metadata } from "next";
import { notFound } from "next/navigation";
import membersData from "@/data/members.json";
import worksData from "@/data/works.json";
import type { Member, WorkItem } from "@/types/pandawa";
import { YearbookProfileClient } from "@/components/YearbookProfileClient";

const MEMBERS = membersData as Member[];
const WORKS = worksData as WorkItem[];

export function generateStaticParams() {
  return MEMBERS.map((m) => ({ id: m.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const member = MEMBERS.find((m) => m.id === id);
  if (!member) {
    return { title: "Anggota Tidak Ditemukan — PANDAWA" };
  }
  return {
    title: `${member.full_name} (#${member.index}) — Yearbook PANDAWA`,
    description: `${member.role} • ${member.class_group} — "${member.quote}"`,
  };
}

export default async function MemberYearbookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const idx = MEMBERS.findIndex((m) => m.id === id);
  if (idx === -1) notFound();

  const member = MEMBERS[idx];
  const prevMember = MEMBERS[(idx - 1 + MEMBERS.length) % MEMBERS.length];
  const nextMember = MEMBERS[(idx + 1) % MEMBERS.length];
  const memberWorks = WORKS.filter((w) => w.author_id === member.id);

  return (
    <YearbookProfileClient
      member={member}
      works={memberWorks}
      prevMember={prevMember}
      nextMember={nextMember}
    />
  );
}
