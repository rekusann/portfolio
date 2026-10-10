/* ==========================================================================
   サイト全体の設定
   ========================================================================== */

export const site = {
  name: "nihilnovem.work",
  author: "reku",
  description: "reku のポートフォリオ。グラフィックデザイン・映像制作・Webデザインなどの制作実績を掲載しています。",
  /** OGP のデフォルト画像（public 以下）。1200×630 の画像を用意したら差し替えてください */
  ogImage: "images/logo.png",
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
