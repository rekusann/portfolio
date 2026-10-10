/* ==========================================================================
   ブラウザ側で共通して使う小さなユーティリティ
   ========================================================================== */

declare global {
  interface Window {
    twttr?: { widgets?: { load?: (element?: Element) => void } };
  }
}

/** 横スワイプを検出する。縦スクロールやピンチ操作は無視 */
export function onSwipe(
  element: HTMLElement,
  handlers: { left?: () => void; right?: () => void },
  threshold = 60
): void {
  let startX = 0;
  let startY = 0;
  let tracking = false;

  element.addEventListener(
    "touchstart",
    (event) => {
      tracking = event.touches.length === 1;
      if (!tracking) return;
      startX = event.touches[0].clientX;
      startY = event.touches[0].clientY;
    },
    { passive: true }
  );

  element.addEventListener(
    "touchend",
    (event) => {
      if (!tracking) return;
      tracking = false;
      const touch = event.changedTouches[0];
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;
      if (Math.abs(dx) < threshold || Math.abs(dx) < Math.abs(dy) * 1.5) return;
      (dx < 0 ? handlers.left : handlers.right)?.();
    },
    { passive: true }
  );
}

/** ←/→ キーでの移動。入力欄にフォーカスがあるときや修飾キー付きは無視 */
export function isNavigationKey(event: KeyboardEvent): "prev" | "next" | null {
  if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return null;
  const target = event.target as HTMLElement | null;
  if (target?.closest("input, textarea, select, [contenteditable]")) return null;
  if (event.key === "ArrowLeft") return "prev";
  if (event.key === "ArrowRight") return "next";
  return null;
}

/** X公式ウィジェットで root 内の投稿を埋め込み表示 */
export function loadXWidgets(root: Element): void {
  if (!root.querySelector(".twitter-tweet")) return;

  if (window.twttr?.widgets?.load) {
    window.twttr.widgets.load(root);
    return;
  }

  const src = "https://platform.twitter.com/widgets.js";
  const load = () => window.twttr?.widgets?.load?.(root);
  const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
  if (existing) {
    existing.addEventListener("load", load, { once: true });
    return;
  }

  const script = document.createElement("script");
  script.src = src;
  script.async = true;
  script.charset = "utf-8";
  script.addEventListener("load", load, { once: true });
  document.head.append(script);
}

/**
 * [data-copy="コピーする文字列"] のボタンをクリックでコピーできるようにする。
 * ボタンのラベルは一時的に data-copied-label（既定「コピーしました」）に変わる。
 */
export function initCopyButtons(): void {
  document.addEventListener("click", async (event) => {
    const button = (event.target as HTMLElement | null)?.closest<HTMLButtonElement>("[data-copy]");
    if (!button) return;

    const text = button.dataset.copy ?? "";
    const label = button.dataset.label ?? button.textContent ?? "";
    button.dataset.label = label;

    try {
      await navigator.clipboard.writeText(text);
      button.textContent = button.dataset.copiedLabel ?? "コピーしました";
    } catch {
      window.prompt("コピーしてください", text);
    }
    window.setTimeout(() => {
      button.textContent = label;
    }, 1800);
  });
}
