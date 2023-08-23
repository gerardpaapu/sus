import { useCallback, useState } from 'react'

export default function Home() {
  const [thingy, setThingy] = useState<any>(null)

  const doSomething = useCallback(async () => {
    try {
      const res = await fetch('/api/v1/friends')
      if (res.ok) {
        const { ...data } = await res.json()
        setThingy(data)
      } else {
        setThingy({ error: res.statusText })
      }
    } catch (e) {
      console.error(e)
    }
  }, [])

  return (
    <>
      <h1>Home</h1>
      <pre>
        <code>{JSON.stringify(thingy, null, 2)}</code>
      </pre>
      <button onClick={doSomething}>Friends?</button>
    </>
  )
}
