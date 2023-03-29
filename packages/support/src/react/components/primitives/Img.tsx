import React, { ImgHTMLAttributes, useEffect, useState } from 'react'

export type ImgProps = {
  src: string
  fallbackSrc?: string
  onLoad?: () => void
} & ImgHTMLAttributes<HTMLImageElement>

export function Img({ src, fallbackSrc, ...rest }: ImgProps) {
  const [imageSrc, setImageSrc] = useState(fallbackSrc || src)

  useEffect(() => {
    if (!fallbackSrc || imageSrc === fallbackSrc) {
      return
    }

    const img = new Image()
    img.src = src
    img.onload = () => setImageSrc(src)
    img.onerror = () => {
      if (fallbackSrc) {
        setImageSrc(fallbackSrc)
      }
    }
  }, [src, fallbackSrc])

  return <img src={imageSrc} alt="" {...rest} />
}
