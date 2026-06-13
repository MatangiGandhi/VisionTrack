import React, { useEffect, useState } from 'react'
import { ShieldAlert, RefreshCw } from 'lucide-react'
import { fetchRisks } from '../api.js'
import RiskBadge from '../components/RiskBadge.jsx'

export default function Risk() {
  const [risks, setRisks] = useState([])
  const [trainSpeed, setTrainSpeed] = useState(80)

  const load = async (speed = trainSpeed) => {
    try {
      setRisks(await fetchRisks(speed))
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    load()
    const interval = setInterval(() => load(), 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="text-rail-accent" />
          <h2 className="text-lg font-semibold text-white">Risk Intelligence</h2>
        </div>
        <button
          onClick={() => load()}
          className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      <div className="bg-rail-panel border border-slate-800 rounded-xl p-4 flex items-center gap-4">
        <label className="text-sm text-slate-400">Train Speed (km/h)</label>
        <input
          type="range"
          min="20"
          max="160"
          value={trainSpeed}
          onChange={(e) => {
            const v = Number(e.target.value)
            setTrainSpeed(v)
            load(v)
          }}
          className="flex-1"
        />
        <span className="text-sm font-semibold text-white w-12">{trainSpeed}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {risks.map((r) => (
          <div key={r.tracking_id} className="bg-rail-panel border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-white">Track #{r.tracking_id} · {r.object_type}</h3>
              <RiskBadge classification={r.classification} />
            </div>
            <div className="text-sm space-y-1 text-slate-400">
              <p>Distance to track: <span className="text-slate-200">{r.distance_to_track} units</span></p>
              <p>Train speed: <span className="text-slate-200">{r.train_speed} km/h</span></p>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>Risk Score</span>
                <span>{r.risk_score}/100</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full ${
                    r.risk_score >= 70 ? 'bg-rail-danger' : r.risk_score >= 35 ? 'bg-rail-warning' : 'bg-rail-safe'
                  }`}
                  style={{ width: `${r.risk_score}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
