import { useEffect, useState } from 'react'

import { useStoryLiteState } from '@/app/context/StoriesDataContext'
import { SLAddonProps, SLAddonState, SLNativeScalarType } from '@/types'

import { Btn } from '../Btn'

export function ToolbarAddon(props: SLAddonProps<false>) {
  const ctx = useStoryLiteState()
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
    if (onIFrameReady) {
      onIFrameReady(ctx)
    }
  }, [onIFrameReady, ctx.iframeLoadState, ctx.iframeRef])

  useEffect(() => {
    if (isActive) {
      setActive(isActive(ctx))
    }
  }, [isActive, ctx])

  useEffect(() => {
    if (onRender) {
      return onRender(ctx)
    }
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
  const ctx = useStoryLiteState()
  const { parameters, setParameter } = ctx
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
    isActive,
    render,
    id,
    tooltip,
    buttonProps,
  } = props
  const defaultNode = defaultContent ?? '⬜️'
  const activeNode = activeContent ?? defaultContent ?? `🔳`
  const [state, setState] = useState<SLNativeScalarType | undefined>(
    persistent ? (parameters[id].value as any) : undefined,
  )

  const setPersistentState = (value: SLNativeScalarType | undefined) => {
    if (persistent) {
      setParameter(id, value)
      setState(value)

      return
    }
    setState(value)
  }

  const stateTuple: SLAddonState = [state, setPersistentState]
  const _visible = isVisible ? isVisible(ctx, stateTuple) : true
  const [active, setActive] = useState(isActive ? isActive(ctx, stateTuple) : false)

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
    if (onIFrameReady) {
      onIFrameReady(ctx, stateTuple)
    }
  }, [onIFrameReady, ctx.iframeLoadState, ctx.iframeRef])

  useEffect(() => {
    if (isActive) {
      setActive(isActive(ctx, stateTuple))
    }
  }, [isActive, ctx])

  useEffect(() => {
    if (onRender) {
      return onRender(ctx, stateTuple)
    }
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
