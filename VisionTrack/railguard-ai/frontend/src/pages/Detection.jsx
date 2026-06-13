import React, { useEffect, useState } from 'react'
import { RefreshCw, Eye } from 'lucide-react'
import { fetchDetections } from '../api.js'

const typeColors = {
  human: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  animal: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  vehicle: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  foreign_object: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
}

export default function Detection() {
  const [data, setData] = useState(null)

  const load = async () => {
    try {
      const res = await fetchDetections()
      setData(res)
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
          <Eye className="text-rail-accent" />
          <h2 className="text-lg font-semibold text-white">Hazard Detection</h2>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      <div className="bg-rail-panel border border-slate-800 rounded-xl p-4">
        <p className="text-sm text-slate-500 mb-4">
          Frame #{data?.frame_id ?? '--'} · Detects humans, animals, vehicles, and foreign objects near track
        </p>

        <div className="aspect-video bg-slate-950 rounded-lg border border-slate-800 relative overflow-hidden flex items-center justify-center">
          {/* <span className="text-slate-600 text-sm">Live CCTV / Drone Feed Preview</span> */}
          {data?.objects?.map((obj) => (
            <div
              key={obj.object_id}
              className="absolute border-2 border-rail-accent rounded"
              style={{
                left: `${(obj.x / 1280) * 100}%`,
                top: `${(obj.y / 720) * 100}%`,
                width: `${(obj.width / 1280) * 100}%`,
                height: `${(obj.height / 720) * 100}%`,
              }}
            >
              <span className="absolute -top-5 left-0 text-[10px] bg-rail-accent text-black px-1 rounded">
                {obj.object_type} {(obj.confidence * 100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-rail-panel border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-800/50 text-slate-400 text-left">
            <tr>
              <th className="px-4 py-2">Object ID</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Position (x, y)</th>
              <th className="px-4 py-2">Size (w x h)</th>
              <th className="px-4 py-2">Confidence</th>
            </tr>
          </thead>
          <tbody>
            {data?.objects?.map((obj) => (
              <tr key={obj.object_id} className="border-t border-slate-800">
                <td className="px-4 py-2">{obj.object_id}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-0.5 rounded border text-xs ${typeColors[obj.object_type]}`}>
                    {obj.object_type}
                  </span>
                </td>
                <td className="px-4 py-2">{obj.x.toFixed(1)}, {obj.y.toFixed(1)}</td>
                <td className="px-4 py-2">{obj.width.toFixed(1)} x {obj.height.toFixed(1)}</td>
                <td className="px-4 py-2">{(obj.confidence * 100).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
