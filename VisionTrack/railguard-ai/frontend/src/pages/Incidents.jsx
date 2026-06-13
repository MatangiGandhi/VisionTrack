import React, { useEffect, useState } from 'react'
import { History, RefreshCw } from 'lucide-react'
import { fetchIncidents } from '../api.js'
import RiskBadge from '../components/RiskBadge.jsx'

export default function Incidents() {
  const [incidents, setIncidents] = useState([])

  const load = async () => {
    try {
      setIncidents(await fetchIncidents())
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="text-rail-accent" />
          <h2 className="text-lg font-semibold text-white">Incident History</h2>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      <div className="bg-rail-panel border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-800/50 text-slate-400 text-left">
            <tr>
              <th className="px-4 py-2">Incident ID</th>
              <th className="px-4 py-2">Location</th>
              <th className="px-4 py-2">Object Type</th>
              <th className="px-4 py-2">Risk Score</th>
              <th className="px-4 py-2">Classification</th>
              <th className="px-4 py-2">Time</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map((i) => (
              <tr key={i.incident_id} className="border-t border-slate-800">
                <td className="px-4 py-2 font-mono text-xs">{i.incident_id}</td>
                <td className="px-4 py-2">{i.location}</td>
                <td className="px-4 py-2 capitalize">{i.object_type}</td>
                <td className="px-4 py-2">{i.risk_score}</td>
                <td className="px-4 py-2"><RiskBadge classification={i.classification} /></td>
                <td className="px-4 py-2 text-slate-400">{new Date(i.timestamp * 1000).toLocaleString()}</td>
                <td className="px-4 py-2">
                  {i.resolved ? (
                    <span className="text-rail-safe text-xs">Resolved</span>
                  ) : (
                    <span className="text-rail-warning text-xs">Open</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
