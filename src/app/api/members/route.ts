import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import type { Member } from "@/types/pandawa";

const DATA_PATH = path.join(process.cwd(), "src", "data", "members.json");

export async function GET() {
  try {
    const raw = fs.readFileSync(DATA_PATH, "utf8");
    return NextResponse.json(JSON.parse(raw));
  } catch {
    return NextResponse.json({ error: "Gagal membaca members.json" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Editor lokal hanya aktif di mode development (npm run dev)." },
      { status: 403 }
    );
  }

  try {
    const body = (await req.json()) as { members?: Member[] };
    if (!Array.isArray(body.members) || body.members.length === 0) {
      return NextResponse.json({ error: "Format data anggota tidak valid." }, { status: 400 });
    }
    fs.writeFileSync(DATA_PATH, JSON.stringify(body.members, null, 2) + "\n", "utf8");
    return NextResponse.json({ ok: true, count: body.members.length });
  } catch {
    return NextResponse.json({ error: "Gagal menyimpan members.json" }, { status: 500 });
  }
}
