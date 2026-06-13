import React, { useEffect, useState } from 'react'
import { Clock, Radio } from 'lucide-react'

export default function TopBar() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-rail-panel/60">
      <div>
        <h2 className="text-xl font-semibold text-white">Railway Hazard Intelligence</h2>
        <p className="text-sm text-slate-500">Real-time monitoring &amp; risk forecasting</p>
      </div>
      <div className="flex items-center gap-6 text-sm text-slate-400">
        <div className="flex items-center gap-2">
          <Radio size={16} className="text-rail-safe animate-pulse" />
          <span>Live Feed Active</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={16} />
          <span>{time.toLocaleTimeString()}</span>
        </div>
      </div>
    </header>
  )
}
