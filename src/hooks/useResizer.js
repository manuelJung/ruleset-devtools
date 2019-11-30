// @flow
import * as React from 'react'

export default function useResizer (init:number=0, axis:'x'|'y'='x') {
  const [value, setValue] = React.useState(init)
  const ref = React.useRef<any>()

  React.useEffect(() => {
    if(!ref.current) return
    const el = ref.current
    let startPosition = 0
    let endPosition = 0
    let diff = 0
    const drag = (e:any) => {
      endPosition = axis === 'x' ? e.x : -e.y
      const delta = endPosition-startPosition
      setValue(delta+init+diff)
    }
    const mouseup = (e:any) => {
      diff = diff+endPosition-startPosition
      document.removeEventListener('mouseup', mouseup)
      document.removeEventListener('mousemove', drag)
    }
    const mousedown = (e:any) => {
      startPosition = axis === 'x' ? e.x : -e.y
      document.addEventListener('mouseup', mouseup)
      document.addEventListener('mousemove', drag)
    }
    el.addEventListener('mousedown', mousedown)
    return () => {
      el.removeEventListener('mousedown', mousedown)
    }
  }, [init])

  return [value, ref]
}