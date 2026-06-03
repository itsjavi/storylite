import './imported-css-demo.css'

type ImportedCssDemoArgs = {
  readonly label: string
  readonly detail: string
}

export function renderImportedCssDemo(args: ImportedCssDemoArgs): string {
  return `<article class="imported-css-demo">
    <strong>${escapeHtml(args.label)}</strong>
    <p>${escapeHtml(args.detail)}</p>
  </article>`
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}
