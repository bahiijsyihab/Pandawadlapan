import membersData from "@/data/members.json";
import albumsData from "@/data/albums.json";
import videosData from "@/data/videos.json";
import worksData from "@/data/works.json";
import type { Album, Member, VideoItem, WorkItem } from "@/types/pandawa";
import { PandawaPortal } from "@/components/PandawaPortal";

export default function HomePage() {
  return (
    <PandawaPortal
      members={membersData as Member[]}
      albums={albumsData as Album[]}
      videos={videosData as VideoItem[]}
      works={worksData as WorkItem[]}
    />
  );
}
