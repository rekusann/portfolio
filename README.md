# nihilnovem.work

reku のポートフォリオサイト。https://nihilnovem.work/

- [Astro](https://astro.build/) 5 で作った静的サイト（サーバー不要）
- `main` ブランチに push すると GitHub Actions がビルドし、GitHub Pages に公開される

---

## よくある作業

### 作品を追加する

1. 画像を `public/images/` に置く（例：`public/images/gra-022.webp`）
2. `src/content/works.yaml` の末尾に作品を追記する

```yaml
- id: gra-022                       # 英数字とハイフン。URL が /works/gra-022/ になる
  title: 作品タイトル
  type: Graphic Design / Poster     # 一覧・詳細に出る制作タイプ（自由入力）
  category: graphic                 # graphic / video / web / others のどれか
  date: "2026.10.12"                # 必ず "" で囲む（"2026" / "2026.10" も可）
  duration: 3日                      # 省略可
  client: クライアント名              # 省略可
  thumbnail: images/gra-022.webp    # 一覧のサムネイル兼 SNS 共有画像
  description: |                    # 省略可。| を使うと複数行
    1行目
    2行目
  media:                            # 詳細に表示するもの。複数並べるとギャラリーになる
    - type: image
      src: images/gra-022.webp
      alt: 画像の説明
    - type: youtube
      src: https://youtu.be/xxxxxxxxxxx
    - type: x
      src: https://x.com/nihilnovem/status/0000000000
```

3. push する（数分で公開される）

> 並び順は `date` で自動的に決まる（新しい順）。日付が同じ作品同士は `works.yaml` に書いた順。

### カテゴリを増やす・名前を変える

`src/data/site.ts` の `categoryKeys` と `categoryLabels` の2か所を編集する。
絞り込みボタン・スマホ用の選択リスト・データのチェックすべてに自動で反映される。

### プロフィール・連絡先・サイト説明を変える

| 変えたいもの | 場所 |
|---|---|
| サイト名・説明文・OGP画像・X のアカウント・メール・Discord | `src/data/site.ts` |
| プロフィール吹き出しの文章、contact の文言 | `src/components/SiteHeader.astro` |
| フッター（© 表記など） | `src/components/SiteFooter.astro` |
| 色・余白・フォント | `src/styles/global.css` 冒頭の `:root` |

---

## フォルダ構成

```
public/                       そのまま公開されるファイル
├─ favicon.png                ブラウザのタブのアイコン
├─ apple-touch-icon.png       iPhone のホーム画面アイコン（180×180）
└─ images/                    作品画像・ロゴ・OGP画像

src/
├─ content/works.yaml         ★ 作品データ（ふだん触るのはほぼここだけ）
├─ content.config.ts          作品データの項目と書き方のルール（チェック用）
├─ data/site.ts               サイト全体の設定・カテゴリ
├─ lib/works.ts               作品データの読み込み・並び替え・URL 変換など
├─ layouts/BaseLayout.astro   全ページ共通の枠（<head>・OGP・ヘッダー・フッター）
├─ components/
│  ├─ SiteHeader.astro        ロゴ・キャラクター（プロフィール）・contact
│  ├─ SiteFooter.astro        フッター
│  ├─ WorkDetail.astro        作品詳細の中身（モーダルと個別ページで共用）
│  └─ Lightbox.astro          画像の全画面表示
├─ pages/
│  ├─ index.astro             トップ（一覧・検索・絞り込み・並び替え・モーダル）
│  └─ works/[id].astro        作品ごとの個別ページ（作品の数だけ自動生成）
├─ scripts/ui.ts              スワイプ検出・コピー・X 埋め込みなどの共通処理
└─ styles/global.css          全スタイル
```

---

## 仕組み

### データからページができるまで

```
works.yaml ──(content.config.ts でチェック)──> lib/works.ts で並び替え
      ├─> pages/index.astro       … 一覧 + 各作品の詳細を <template> に埋め込む
      └─> pages/works/[id].astro  … /works/{id}/ のページを1作品ずつ生成
```

- `works.yaml` の書き間違い（存在しないカテゴリ、日付の形式違い、必須項目の抜け）は**ビルド時にエラー**になり、どの作品のどの項目が悪いか表示される。
- 作品詳細の見た目は `WorkDetail.astro` の1か所だけで定義していて、モーダルと個別ページの両方で使い回している。

### トップページの動き

| 機能 | 仕組み |
|---|---|
| 検索・カテゴリ・並び替え | ブラウザ側でカードの表示/非表示・並び順を切り替える。状態は URL に残る（例：`/?category=video&sort=asc&q=poster`）ので、リロード・共有しても同じ表示になる |
| 作品をクリック | ページ移動せずモーダルで開き、URL だけ `/works/{id}/` に変わる。ブラウザの「戻る」で閉じる |
| モーダル内の移動 | ←/→ キー・スワイプ・下部ボタンで前後の作品へ。順番は「いま一覧に表示されている順」 |
| Ctrl/⌘ + クリック | 新しいタブで個別ページが開く |
| 旧リンク `/?project={id}` | 自動で該当作品のモーダルを開く |

### 個別ページ（`/works/{id}/`）

- モーダルの URL をコピー・共有・リロードしたときに表示されるページ。
- 作品ごとに OGP（タイトル・説明・サムネイル）が設定されるので、SNS に貼ると作品画像のカードになる。
- 前後の作品へのリンク、←/→ キー・スワイプでの移動あり。

### SNS 共有（OGP）

`BaseLayout.astro` で全ページに出力している。

| ページ | タイトル | 画像 |
|---|---|---|
| トップ | サイト名 | `site.ts` の `ogImage` |
| 作品ページ | `作品名 \| nihilnovem.work` | その作品の `thumbnail` |

---

## 開発

Node.js（20 以上）が必要。

```bash
npm install
```

```bash
npm run dev
```

http://localhost:4321/ で確認できる。ファイルを保存すると自動で反映される。

```bash
npm run build
```

公開前に、エラーが出ないかこれで確認できる（出力先は `dist/`）。

### 公開（デプロイ）

`main` に push するだけ。`.github/workflows/deploy.yml` がビルドして GitHub Pages に公開する。
進み具合・エラーは GitHub リポジトリの **Actions** タブで確認できる。

---

## ハマりどころ

- **`date` は必ず `"` で囲む。** YAML は `2026.10` を数値 2026.1 と解釈してしまう。
- **YAML の値に `: ` や `#` を含むときも `"` で囲む。** インデント（字下げ）はスペースで揃える（タブ不可）。
- **画像パスは `public/` を含めずに書く。** `public/images/a.webp` → `images/a.webp`
- **`WorkDetail.astro` に `<script>` を書かない。** トップでは `<template>` の中に置かれるため実行されない。動きを足すときは `pages/` 側か `scripts/ui.ts` に書く。
- **SNS のプレビューが更新されない。** Discord や X はカードをしばらくキャッシュする。URL の末尾に `?v=2` などを付けて貼ると取り直される。
- **OGP 画像は 1200×630 の PNG / JPG が無難。** webp は LINE など一部のサービスで表示されないことがある。
- **ファビコンが変わらない。** ブラウザが強くキャッシュするので、シークレットウィンドウで確認する。
