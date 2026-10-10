import { getCollection, type CollectionEntry } from "astro:content";
import { categoryLabels } from "../data/site";

export type WorkData = CollectionEntry<"works">["data"];
export type WorkMedia = WorkData["media"][number];

export interface Work {
  id: string;
  data: WorkData;
  /** /works/{id}/ */
  path: string;
  /** "2026.10.01" → 20261001（並び替え用） */
  dateKey: number;
  year: string;
  /** works.yaml に書かれた順番（日付が同じときの並び順） */
  order: number;
  /** 一覧の検索対象となる文字列（小文字） */
  search: string;
}

const base = import.meta.env.BASE_URL.replace(/\/?$/, "/");

/** public 以下のパス、または外部URLを表示用URLに変換 */
export function assetUrl(path = ""): string {
  return /^https?:\/\//.test(path) ? path : `${base}${path.replace(/^\//, "")}`;
}

/** サイトのドメインを含む絶対URLに変換（OGP・canonical 用） */
export function absoluteUrl(path: string, site: URL): string {
  return new URL(assetUrl(path), site).href;
}

export function workPath(id: string): string {
  return `${base}works/${id}/`;
}

export function toDateKey(date = ""): number {
  const [y = 0, m = 0, d = 0] = date.split(/[./-]/).map((part) => Number(part) || 0);
  return y * 10000 + m * 100 + d;
}

export function youtubeEmbedUrl(url: string): string {
  try {
    const parsed = new URL(url);
    let videoId = "";
    if (parsed.hostname.includes("youtu.be")) {
      videoId = parsed.pathname.slice(1);
    } else if (parsed.hostname.includes("youtube.com")) {
      videoId = parsed.searchParams.get("v") || parsed.pathname.split("/").filter(Boolean).pop() || "";
    }
    return videoId ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}` : "";
  } catch {
    return "";
  }
}

/** 全作品を新しい順（同日は works.yaml の記述順）で取得 */
export async function getWorks(): Promise<Work[]> {
  const entries = await getCollection("works");

  return entries
    .map(({ id, data }, order) => ({
      id,
      data,
      path: workPath(id),
      dateKey: toDateKey(data.date),
      year: data.date.slice(0, 4),
      order,
      search: [data.title, data.type, data.client, data.category, categoryLabels[data.category]]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
    }))
    .sort((a, b) => b.dateKey - a.dateKey || a.order - b.order);
}

/** 一覧のサムネイル用 alt（最初の画像の alt → タイトル） */
export function thumbnailAlt(work: Work): string {
  return work.data.media.find((item) => item.type === "image" && item.alt)?.alt ?? work.data.title;
}
