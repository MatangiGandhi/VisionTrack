import React, { useEffect, useRef, useState } from 'react'
import { BellRing, Wifi, WifiOff } from 'lucide-react'
import { fetchAlerts, ALERTS_WS_URL } from '../api.js'
import RiskBadge from '../components/RiskBadge.jsx'

export default function Alerts() {
  const [alerts, setAlerts] = useState([])
  const [connected, setConnected] = useState(false)
  const wsRef = useRef(null)

  useEffect(() => {
    // Initial fetch via REST
    fetchAlerts().then(setAlerts).catch(console.error)

    // Real-time updates via WebSocket
    const ws = new WebSocket(ALERTS_WS_URL)
    wsRef.current = ws

    ws.onopen = () => setConnected(true)
    ws.onclose = () => setConnected(false)
    ws.onerror = () => setConnected(false)
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        setAlerts(data.alerts || [])
      } catch (e) {
        console.error('Invalid WS message', e)
      }
    }

    return () => ws.close()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BellRing className="text-rail-accent" />
          <h2 className="text-lg font-semibold text-white">Smart Alert</h2>
        </div>
        <div className="flex items-center gap-2 text-sm">
          {connected ? (
            <span className="flex items-center gap-1 text-rail-safe"><Wifi size={14} /> Live</span>
          ) : (
            <span className="flex items-center gap-1 text-slate-500"><WifiOff size={14} /> Connecting...</span>
          )}
        </div>
      </div>

      {/* <p className="text-sm text-slate-500">
        Real-time alerts for Medium and High risk situations, pushed via WebSocket to operators.
      </p> */}

      {alerts.length === 0 && (
        <div className="bg-rail-panel border border-slate-800 rounded-xl p-8 text-center text-slate-500">
          No active alerts. All monitored zones are within safe thresholds.
        </div>
      )}

      <div className="space-y-3">
        {alerts.map((a) => (
          <div
            key={a.alert_id}
            className={`bg-rail-panel border rounded-xl p-4 ${
              a.classification === 'High Risk' ? 'border-rail-danger/50' : 'border-rail-warning/50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white">Alert #{a.alert_id}</h3>
              <RiskBadge classification={a.classification} />
            </div>
            <p className="text-sm text-slate-300">{a.message}</p>
            <div className="mt-2 text-xs text-slate-500 space-y-0.5">
              <p>Location: {a.location}</p>
              <p>Recommended Action: <span className="text-slate-300">{a.recommended_action}</span></p>
              <p>Timestamp: {new Date(a.timestamp * 1000).toLocaleTimeString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
