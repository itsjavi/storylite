import './ReactImportedCssCard.css'

export type ReactImportedCssCardProps = {
  readonly label: string
  readonly detail: string
}

export function ReactImportedCssCard({ label, detail }: ReactImportedCssCardProps) {
  return (
    <article className="react-imported-css-card">
      <strong>{label}</strong>
      <p>{detail}</p>
    </article>
  )
}
