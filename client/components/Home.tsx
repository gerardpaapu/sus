import { useCallback, useState } from 'react'

export default function Home() {
  const [thingy, setThingy] = useState(null as any)


  const doSomething = useCallback(async () => {
    const res = await fetch(new URL('/api/v1/friends', document.baseURI).toString())
    if (res.ok) {
      const { ...data } = await res.json()
      setThingy(data)
    } else {
      setThingy({ error: res.statusText })
    }
  }, [])

  return (
    <>
      <h1>Home</h1>
      <pre>
        <code>{JSON.stringify(thingy, null, 2)}</code>
      </pre>
      <button onClick={doSomething}> Friends ? </button>
    </>
  )
}
