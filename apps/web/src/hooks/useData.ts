import { useState, useEffect } from 'react'

// Busca uma coleção via `getterFunc` e expõe { data, loading, setData }.
// Mantém o array vazio como estado inicial para os consumidores usarem direto.
export default function useData<T>(getterFunc: () => Promise<T[]>) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    const fetchData = async () => {
      setLoading(true)
      try {
        const result = await getterFunc()
        if (isMounted) setData(result)
      } catch (err) {
        console.error('Error fetching data:', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    fetchData()
    return () => { isMounted = false }
  }, [getterFunc])

  return { data, loading, setData }
}
