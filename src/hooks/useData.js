import { useState, useEffect } from 'react'

export default function useData(getterFunc) {
  const [data, setData] = useState([])
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
