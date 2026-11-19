"use client";

import React, { useMemo, useState } from "react";
import type { Album, Member, VideoItem, WorkItem } from "@/types/pandawa";
import { Navbar } from "./Navbar";
import { Hero3DStage } from "./Hero3DStage";
import { PhotoSpoilerStrip } from "./PhotoSpoilerStrip";
import { PhilosophyInspector } from "./PhilosophyInspector";
import { HighlightBar } from "./HighlightBar";
import { MemberDirectory } from "./MemberDirectory";
import { CabinetStructure } from "./CabinetStructure";
import { ArchiveShowcase } from "./ArchiveShowcase";
import { Footer } from "./Footer";
import { IntroSplash } from "./IntroSplash";
import { ScrollVideoBackground } from "./ScrollVideoBackground";
import { MotionReveal } from "./MotionReveal";
import {
  MemberProfileModal,
  PhotoLightboxModal,
  VideoPlayerModal,
  WorkPreviewModal,
} from "./Modals";

interface PandawaPortalProps {
  members: Member[];
  albums: Album[];
  videos: VideoItem[];
  works: WorkItem[];
}

export function PandawaPortal({
  members,
  albums,
  videos,
  works,
}: PandawaPortalProps) {
  const [activeMember, setActiveMember] = useState<Member | null>(null);
  const [activeWork, setActiveWork] = useState<WorkItem | null>(null);
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [lightboxState, setLightboxState] = useState<{
    album: Album;
    index: number;
  } | null>(null);

  const membersById = useMemo(
    () => Object.fromEntries(members.map((m) => [m.id, m])),
    [members]
  );

  const workCountByAuthor = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const w of works) {
      counts[w.author_id] = (counts[w.author_id] ?? 0) + 1;
    }
    return counts;
  }, [works]);

  const activeMemberWorks = useMemo(() => {
    if (!activeMember) return [];
    return works.filter((w) => w.author_id === activeMember.id);
  }, [activeMember, works]);

  const activeWorkAuthor = activeWork ? membersById[activeWork.author_id] ?? null : null;

  return (
    <div className="relative min-h-[400vh] flex flex-col">
      {/* Layer 0 & 1: Fixed Scroll-Driven Background Video + Legibility Overlay */}
      <ScrollVideoBackground />

      <IntroSplash />
      <Navbar />

      <main className="relative z-10 flex-1">
        <Hero3DStage />
        <MotionReveal>
          <PhotoSpoilerStrip
            featuredAlbum={albums[0] ?? null}
            members={members}
            onOpenLightbox={(album, index) => setLightboxState({ album, index })}
            onSelectMember={(m) => setActiveMember(m)}
          />
        </MotionReveal>
        <MotionReveal>
          <PhilosophyInspector />
        </MotionReveal>
        <MotionReveal>
          <HighlightBar />
        </MotionReveal>
        <MotionReveal>
          <MemberDirectory
            members={members}
            workCountByAuthor={workCountByAuthor}
            onSelectMember={(m) => setActiveMember(m)}
          />
        </MotionReveal>
        <MotionReveal>
          <CabinetStructure
            members={members}
            onSelectMember={(m) => setActiveMember(m)}
          />
        </MotionReveal>
        <MotionReveal>
          <ArchiveShowcase
            albums={albums}
            videos={videos}
            works={works}
            membersById={membersById}
            onOpenLightbox={(album, index) => setLightboxState({ album, index })}
            onOpenVideo={(video) => setActiveVideo(video)}
            onOpenWork={(work) => setActiveWork(work)}
            onOpenMember={(member) => setActiveMember(member)}
          />
        </MotionReveal>
      </main>

      <div className="relative z-10">
        <Footer />
      </div>

      {/* Modals with Seamless Cross-Navigation (Member <-> Work) */}
      <MemberProfileModal
        member={activeMember}
        works={activeMemberWorks}
        onClose={() => setActiveMember(null)}
        onOpenWork={(w) => {
          setActiveMember(null);
          setActiveWork(w);
        }}
      />

      <WorkPreviewModal
        work={activeWork}
        author={activeWorkAuthor}
        onClose={() => setActiveWork(null)}
        onOpenMember={(m) => {
          setActiveWork(null);
          setActiveMember(m);
        }}
      />

      <VideoPlayerModal
        video={activeVideo}
        onClose={() => setActiveVideo(null)}
      />

      <PhotoLightboxModal
        album={lightboxState?.album ?? null}
        photoIndex={lightboxState?.index ?? 0}
        onChangeIndex={(nextIdx) =>
          setLightboxState((prev) => (prev ? { ...prev, index: nextIdx } : null))
        }
        onClose={() => setLightboxState(null)}
      />
    </div>
  );
}
