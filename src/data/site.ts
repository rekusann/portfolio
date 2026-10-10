/* ==========================================================================
   サイト全体の設定
   ========================================================================== */

export const site = {
  name: "nihilnovem.work",
  author: "reku",
  description: "Portfolio // Graphic Design, Video Production, ...",
  ogImage: "images/og.webp",
  xHandle: "@nihilnovem",
  links: {
    x: "https://x.com/nihilnovem",
    studio: "https://studio.revati.jp/"
  },
  contact: {
    email: "abarabon3@gmail.com",
    discord: {
      name: "REVATI Studio",
      url: "https://discord.gg/GVKB5TvR3N"
    }
  }
};

/* ==========================================================================
   カテゴリ
   ここに追加すると、作品データの検証・絞り込みボタンの両方に反映されます
   ========================================================================== */

export const categoryKeys = ["graphic", "video", "web", "others"] as const;

export type CategoryKey = (typeof categoryKeys)[number];

export const categoryLabels: Record<CategoryKey, string> = {
  graphic: "グラフィックデザイン",
  video: "映像制作",
  web: "Webデザイン",
  others: "その他"
};
