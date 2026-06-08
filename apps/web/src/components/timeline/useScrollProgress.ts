import { useEffect, useRef } from 'react'

// Scroll-driven progress engine (DOM-driven, no React re-render per frame).
// Wrap a tall container with the returned ref; `apply(progress 0..1)` runs each
// frame with a smoothed value so the variant can manipulate refs directly.
export default function useScrollProgress(
  apply: (p: number) => void,
  { ease = 0.1 }: { ease?: number } = {}
) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const applyRef = useRef(apply)
  applyRef.current = apply

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const target = { v: 0 }
    const current = { v: 0 }
    let raf = 0

    const onScroll = () => {
      const rect = el.getBoundingClientRect()
      const range = Math.max(1, rect.height - window.innerHeight)
      target.v = Math.max(0, Math.min(1, -rect.top / range))
    }

    const tick = () => {
      const diff = target.v - current.v
      if (Math.abs(diff) > 0.00005) {
        current.v += diff * ease
        applyRef.current(current.v)
      }
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    onScroll()
    applyRef.current(0)
    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
    // `apply` is in deps so the effect re-attaches when data arrives late
    // (container mounts only after items load → ref becomes available).
  }, [ease, apply])

  return containerRef
}
