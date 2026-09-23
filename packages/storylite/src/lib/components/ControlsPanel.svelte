<script lang="ts">
  import { onDestroy } from 'svelte'
  import Check from '@lucide/svelte/icons/check'
  import Code from '@lucide/svelte/icons/code'
  import RefreshCw from '@lucide/svelte/icons/refresh-cw'
  import { inferControlType } from '../storylite/normalize'
  import { resolveStorySource } from '../storylite/source'
  import type { StoryArgType, StoryArgs, StoryLiteStory } from '../storylite/types'
  import JsonControl from './JsonControl.svelte'

  type Props = {
    readonly activeStory: StoryLiteStory | undefined
    readonly activeArgs: StoryArgs
    readonly onResetArgs: () => void
    readonly onUpdateArg: (name: string, value: unknown) => void
  }

  let { activeStory, activeArgs, onResetArgs, onUpdateArg }: Props = $props()
  let copiedStoryId: string | null = $state(null)
  let copyResetTimer: ReturnType<typeof setTimeout> | null = null

  const activeArgNames = $derived(
    activeStory ? Object.keys({ ...activeStory.argTypes, ...activeStory.args }).sort() : [],
  )
  const sourceSnippet = $derived(activeStory ? resolveStorySource(activeStory, activeArgs) : null)
  const didCopySource = $derived(Boolean(activeStory && copiedStoryId === activeStory.id))

  onDestroy(() => {
    if (copyResetTimer) {
      window.clearTimeout(copyResetTimer)
    }
  })

  function controlType(name: string): string {
    return inferControlType(activeStory?.argTypes[name], activeArgs[name])
  }

  function argType(name: string): StoryArgType | undefined {
    return activeStory?.argTypes[name]
  }

  async function copyStorySource(): Promise<void> {
    if (!activeStory || !sourceSnippet) {
      return
    }

    try {
      await navigator.clipboard.writeText(sourceSnippet)
      copiedStoryId = activeStory.id

      if (copyResetTimer) {
        window.clearTimeout(copyResetTimer)
      }

      const copiedId = activeStory.id
      copyResetTimer = window.setTimeout(() => {
        if (copiedStoryId === copiedId) {
          copiedStoryId = null
        }
        copyResetTimer = null
      }, 1200)
    } catch {
      copiedStoryId = null
    }
  }
</script>

<aside class="inspector" aria-label="Story controls">
  <header class="inspector__header">
    <div>
      <span>Controls</span>
      <strong>{activeStory?.name ?? 'No story'}</strong>
    </div>
    <button type="button" aria-label="Reset controls" title="Reset controls" onclick={onResetArgs}>
      <RefreshCw size={16} aria-hidden="true" />
    </button>
  </header>

  <div class="inspector__body">
    {#if activeStory}
      <dl class="story-meta">
        <div>
          <dt>Group</dt>
          <dd>{activeStory.title}</dd>
        </div>
        <div>
          <dt>Renderer</dt>
          <dd>{activeStory.renderer}</dd>
        </div>
      </dl>
    {/if}

    <form class="controls">
      {#each activeArgNames as name (name)}
        {@const type = controlType(name)}
        {@const metadata = argType(name)}
        <label class="control" class:control--boolean={type === 'boolean'}>
          {#if type === 'boolean'}
            <input
              type="checkbox"
              checked={Boolean(activeArgs[name])}
              onchange={(event) => onUpdateArg(name, event.currentTarget.checked)}
            />
            <span>{name}</span>
          {:else if type === 'textarea'}
            <span>{name}</span>
            <textarea
              rows="4"
              value={String(activeArgs[name] ?? '')}
              oninput={(event) => onUpdateArg(name, event.currentTarget.value)}
            ></textarea>
          {:else if type === 'number'}
            <span>{name}</span>
            <input
              type="number"
              value={Number(activeArgs[name] ?? 0)}
              oninput={(event) => onUpdateArg(name, event.currentTarget.valueAsNumber)}
            />
          {:else if type === 'color'}
            <span>{name}</span>
            <input
              type="color"
              value={String(activeArgs[name] ?? '#000000')}
              oninput={(event) => onUpdateArg(name, event.currentTarget.value)}
            />
          {:else if type === 'select' && metadata?.options}
            <span>{name}</span>
            <select
              value={String(activeArgs[name] ?? '')}
              onchange={(event) => onUpdateArg(name, event.currentTarget.value)}
            >
              {#each metadata.options as option (String(option))}
                <option value={String(option)}>{String(option)}</option>
              {/each}
            </select>
          {:else if type === 'json'}
            <JsonControl
              {name}
              value={activeArgs[name]}
              updateArg={(data) => onUpdateArg(name, data)}
            />
          {:else}
            <span>{name}</span>
            <input
              type="text"
              value={String(activeArgs[name] ?? '')}
              oninput={(event) => onUpdateArg(name, event.currentTarget.value)}
            />
          {/if}
        </label>
      {:else}
        <p class="empty">This story has no controls.</p>
      {/each}
    </form>

    {#if sourceSnippet}
      <footer class="inspector__footer">
        <button
          type="button"
          class="inspector__copy-button"
          class:active={didCopySource}
          aria-label={didCopySource ? 'Copied snippet' : 'Copy snippet'}
          onclick={copyStorySource}
        >
          {#if didCopySource}
            <Check size={14} aria-hidden="true" />
            <span>Copied</span>
          {:else}
            <Code size={14} aria-hidden="true" />
            <span>Copy snippet</span>
          {/if}
        </button>
      </footer>
    {/if}
  </div>
</aside>
