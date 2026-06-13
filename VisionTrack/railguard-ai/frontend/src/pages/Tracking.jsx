import React, { useEffect, useState } from 'react'
import { Crosshair, RefreshCw } from 'lucide-react'
import { fetchTracking } from '../api.js'

export default function Tracking() {
  const [tracks, setTracks] = useState([])

  const load = async () => {
    try {
      setTracks(await fetchTracking())
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    load()
    const interval = setInterval(load, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Crosshair className="text-rail-accent" />
          <h2 className="text-lg font-semibold text-white">Object Tracking</h2>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* <p className="text-sm text-slate-500">
        Assigns persistent tracking IDs via DeepSORT, monitors movement history, and calculates speed &amp; direction.
      </p> */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tracks.map((t) => (
          <div key={t.tracking_id} className="bg-rail-panel border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white">Track #{t.tracking_id}</h3>
              <span className="text-xs px-2 py-0.5 rounded border border-slate-700 text-slate-400">{t.object_type}</span>
            </div>
            <div className="text-sm space-y-1 text-slate-400">
              <p>Position: <span className="text-slate-200">{t.x.toFixed(1)}, {t.y.toFixed(1)}</span></p>
              <p>Speed: <span className="text-slate-200">{t.speed} units/s</span></p>
              <p>Direction: <span className="text-slate-200">{t.direction}°</span></p>
            </div>
            <div className="mt-3">
              <p className="text-xs text-slate-500 mb-1">Movement History</p>
              <div className="flex gap-1">
                {t.history.map((p, i) => (
                  <span key={i} className="text-[10px] px-1.5 py-0.5 bg-slate-800 rounded text-slate-400">
                    ({p[0].toFixed(0)},{p[1].toFixed(0)})
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
