/** Styles for printed documents (receipts, shift reports), sized for 58/80mm thermal printers. */
export const PRINT_CSS = `
.print-doc { font-family: 'Courier New', monospace; font-size: 12px; color: #000; background: #fff;
  width: 72mm; max-width: 100%; margin: 0 auto; padding: 4mm 2mm; line-height: 1.35; }
.print-doc .center { text-align: center; }
.print-doc .title { font-size: 16px; font-weight: bold; }
.print-doc .muted { font-size: 11px; }
.print-doc .row { display: flex; justify-content: space-between; gap: 8px; }
.print-doc .row > span:last-child { text-align: right; white-space: nowrap; }
.print-doc .bold { font-weight: bold; }
.print-doc .big { font-size: 15px; font-weight: bold; }
.print-doc .sep { border-top: 1px dashed #000; margin: 6px 0; }
.print-doc .item { margin-bottom: 4px; }
.print-doc .banner { border: 1px solid #000; text-align: center; font-weight: bold; padding: 2px; margin: 6px 0; }
.print-doc img.logo { max-width: 40mm; max-height: 20mm; display: block; margin: 0 auto 4px; }
`

const PAGE_CSS = `
@page { margin: 0; }
body { margin: 0; }
`

/**
 * Prints HTML through a hidden iframe (no popup window, so popup blockers don't interfere).
 */
export function printHtml(title: string, html: string) {
  const iframe = document.createElement("iframe")
  iframe.style.position = "fixed"
  iframe.style.right = "0"
  iframe.style.bottom = "0"
  iframe.style.width = "0"
  iframe.style.height = "0"
  iframe.style.border = "0"
  document.body.appendChild(iframe)

  const doc = iframe.contentDocument
  const win = iframe.contentWindow
  if (!doc || !win) {
    iframe.remove()
    return
  }
  doc.open()
  doc.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title>
<style>${PRINT_CSS}${PAGE_CSS}</style></head><body>${html}</body></html>`)
  doc.close()

  const print = () => {
    win.focus()
    win.print()
    // give the print dialog time to read the document before removing it
    setTimeout(() => iframe.remove(), 1000)
  }
  const images = Array.from(doc.images)
  if (images.every((image) => image.complete)) {
    print()
  } else {
    Promise.all(images.map((image) => new Promise((resolve) => {
      image.onload = resolve
      image.onerror = resolve
    }))).then(print)
  }
}
