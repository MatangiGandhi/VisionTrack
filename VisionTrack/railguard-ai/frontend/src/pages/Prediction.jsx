import React, { useEffect, useState } from 'react'
import { TrendingUp, RefreshCw, AlertCircle } from 'lucide-react'
import { fetchPredictions } from '../api.js'

export default function Prediction() {
  const [predictions, setPredictions] = useState([])

  const load = async () => {
    try {
      setPredictions(await fetchPredictions())
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
          <TrendingUp className="text-rail-accent" />
          <h2 className="text-lg font-semibold text-white">Trajectory Prediction</h2>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* <p className="text-sm text-slate-500">
        LSTM-based forecasting of future object positions and time-to-track estimation.
      </p> */}

      <div className="bg-rail-panel border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-800/50 text-slate-400 text-left">
            <tr>
              <th className="px-4 py-2">Tracking ID</th>
              <th className="px-4 py-2">Predicted Path (next 5 steps)</th>
              <th className="px-4 py-2">Moving Toward Track?</th>
              <th className="px-4 py-2">Time to Risk (s)</th>
            </tr>
          </thead>
          <tbody>
            {predictions.map((p) => (
              <tr key={p.tracking_id} className="border-t border-slate-800">
                <td className="px-4 py-2">#{p.tracking_id}</td>
                <td className="px-4 py-2">
                  <div className="flex gap-1 flex-wrap">
                    {p.future_positions.map((pos, i) => (
                      <span key={i} className="text-[10px] px-1.5 py-0.5 bg-slate-800 rounded text-slate-400">
                        ({pos[0].toFixed(0)},{pos[1].toFixed(0)})
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-2">
                  {p.moving_toward_track ? (
                    <span className="flex items-center gap-1 text-rail-warning">
                      <AlertCircle size={14} /> Yes
                    </span>
                  ) : (
                    <span className="text-slate-500">No</span>
                  )}
                </td>
                <td className="px-4 py-2">
                  {p.time_to_track_seconds !== null ? `${p.time_to_track_seconds}s` : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
