import { useEffect, useState } from 'react'

import { useStoryLiteStore } from '@/app/stores/global'
import type { StoryLiteParamValue, StoryLiteStore } from '@/app/stores/global.types'
import type { SLAddonContext, SLAddonProps, SLAddonState } from '@/types'

import { Btn } from '../Btn'

const sliceAddonContext = (state: StoryLiteStore): SLAddonContext => {
  return {
    parameters: state.parameters,
    setParameter: state.setParameter,
    currentStoryId: state.currentStoryId,
    canvas: state.canvas,
  }
}

export function ToolbarAddon(props: SLAddonProps<false>) {
  const ctx = useStoryLiteStore(sliceAddonContext)
  const {
    activeContent,
    defaultContent,
    onClick,
    onIFrameReady,
    onRender,
    getHref,
    hrefTarget,
    isVisible,
    buttonProps,
    isActive,
    render,
    tooltip,
  } = props
  const [active, setActive] = useState(isActive ? isActive(ctx) : false)
  const defaultNode = defaultContent ?? '⬜️'
  const activeNode = activeContent ?? defaultContent ?? `🔳`

  const handleOnClick = () => {
    if (onClick) {
      onClick(ctx)
    }
  }

  const handleRender = () => {
    if (render) {
      return render(ctx)
    }

    return <>{activeNode && active ? activeNode : defaultNode}</>
  }

  useEffect(() => {
    if (ctx.canvas.element) {
      onIFrameReady?.(ctx)
    }
  }, [onIFrameReady, ctx.canvas.element])

  useEffect(() => {
    if (isActive) {
      setActive(isActive(ctx))
    }
  }, [isActive, ctx])

  useEffect(() => {
    onRender?.(ctx)
  }, [onRender, ctx])

  const _visible = isVisible ? isVisible(ctx) : true
  if (!_visible) {
    return null
  }

  const href = getHref ? getHref(ctx) : undefined

  return (
    <Btn
      title={tooltip}
      isActive={active}
      href={href}
      target={hrefTarget}
      {...buttonProps}
      onClick={handleOnClick}
    >
      {handleRender()}
    </Btn>
  )
}

export function ToolbarStatefulAddon(props: SLAddonProps<true>) {
  const ctx = useStoryLiteStore(sliceAddonContext)
  const {
    defaultContent,
    activeContent,
    onClick,
    onIFrameReady,
    onRender,
    getHref,
    hrefTarget,
    isVisible,
    persistent,
    isActive: isActiveFn,
    render,
    id,
    tooltip,
    buttonProps,
  } = props
  const defaultNode = defaultContent ?? '⬜️'
  const activeNode = activeContent ?? defaultContent ?? `🔳`
  const [state, setState] = useState<StoryLiteParamValue | undefined>(
    persistent ? (ctx.parameters[id].value as any) : undefined,
  )

  const combinedSetState = (
    value: Parameters<SLAddonContext['setParameter']>[1],
    options?: Parameters<SLAddonContext['setParameter']>[2],
  ) => {
    ctx.setParameter(id, value, options)
    setState(value)
  }

  const stateTuple: SLAddonState = [state, combinedSetState]
  const _visible = isVisible ? isVisible(ctx, stateTuple) : true
  const [active, setActive] = useState(isActiveFn ? isActiveFn(ctx, stateTuple) : false)

  const handleOnClick = () => {
    if (onClick) {
      onClick(ctx, stateTuple)
    }
  }

  const handleRender = () => {
    if (render) {
      return render(ctx, stateTuple)
    }

    return <>{activeNode && active ? activeNode : defaultNode}</>
  }

  useEffect(() => {
    if (ctx.canvas.element) {
      onIFrameReady?.(ctx, stateTuple)
    }
  }, [onIFrameReady, ctx.canvas.element])

  useEffect(() => {
    if (isActiveFn) {
      setActive(isActiveFn(ctx, stateTuple))
    }
  }, [isActiveFn, ctx, state])

  useEffect(() => {
    if (isActiveFn) {
      setActive(isActiveFn(ctx, stateTuple))
    }
  }, [state])

  useEffect(() => {
    return onRender?.(ctx, stateTuple)
  }, [onRender, ctx])

  if (!_visible) {
    return null
  }

  const href = getHref ? getHref(ctx, stateTuple) : undefined

  return (
    <Btn
      title={tooltip}
      isActive={active}
      href={href}
      target={hrefTarget}
      {...buttonProps}
      onClick={handleOnClick}
    >
      {handleRender()}
    </Btn>
  )
}
