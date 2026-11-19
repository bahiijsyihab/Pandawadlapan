export type ClassGroup = "SAINTEK" | "SOSHUM";

export interface Member {
  id: string;
  index: string;
  full_name: string;
  nickname: string;
  class_group: ClassGroup;
  role: string;
  photo_url: string;
  quote: string;
  instagram: string;
  interests?: string[];
  story?: string;
}

export interface AlbumPhoto {
  url: string;
  caption: string;
}

export interface Album {
  id: string;
  title: string;
  date: string;
  cover_url: string;
  description?: string;
  photos: AlbumPhoto[];
}

export interface VideoItem {
  id: string;
  title: string;
  category: string;
  duration: string;
  youtube_id: string;
  thumbnail_url: string;
  description?: string;
}

export type WorkCategory = "Desain Visual" | "Karya Tulis" | "Audio/Musik" | "Proyek";
export type WorkContentType = "text" | "image" | "audio" | "pdf";

export interface WorkItem {
  id: string;
  title: string;
  category: WorkCategory;
  author_id: string;
  preview_url: string;
  content_type: WorkContentType;
  content_body: string;
  subtitle?: string;
  year?: string;
}
