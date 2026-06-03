import { describe, expect, it } from 'vitest'
import { Button, Card, Field, ImportedCss } from './components/basic.stories'
import { Button as WebComponentButton, Meter } from './components/elements.stories'

describe('storylite-html demo', () => {
  it('exports plain HTML stories', () => {
    expect(Button.render?.(Button.args ?? {})).toContain('demo-btn')
    expect(Card.render?.(Card.args ?? {})).toContain('demo-card')
    expect(Field.render?.(Field.args ?? {})).toContain('demo-field')
    expect(ImportedCss.render?.(ImportedCss.args ?? {})).toContain('imported-css-demo')
  })

  it('exports light-DOM web component stories', () => {
    expect(WebComponentButton.component).toBe('sl-demo-button')
    expect(Meter.component).toBe('sl-demo-meter')
  })
})
