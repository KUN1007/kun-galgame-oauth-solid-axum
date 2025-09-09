import { createSignal, onMount } from 'solid-js'
import './App.css'

export default function Kun() {
  const [moe, setMoe] = createSignal('')
  onMount(async () => {
    const res = await fetch('/api/moe')
    const data = await res.json()
    setMoe(data.message)
  })

  return (
    <>
      <button>{moe()}</button>
    </>
  )
}
