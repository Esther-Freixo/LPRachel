import { useEffect, useRef } from 'react'

// Revela o elemento (.reveal -> .visible) quando ele entra no viewport.
export default function useScrollReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) { el.classList.add('visible'); obs.unobserve(el) }
    }, { threshold: 0, rootMargin: '50px' })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}
