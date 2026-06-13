import React, { useEffect, useState } from 'react'
import { Camera, TrainFront, AlertTriangle, CheckCircle2, Activity } from 'lucide-react'
import { Line, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import StatCard from '../components/StatCard.jsx'
import { fetchSummary, fetchHeatmap } from '../api.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend)

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [heatmap, setHeatmap] = useState([])
  const [riskTrend, setRiskTrend] = useState([])

  useEffect(() => {
    const load = async () => {
      try {
        const [s, h] = await Promise.all([fetchSummary(), fetchHeatmap()])
        setSummary(s)
        setHeatmap(h)
        setRiskTrend(prev => [...prev.slice(-9), Math.round(Math.random() * 100)])
      } catch (e) {
        console.error('Failed to load dashboard data', e)
      }
    }
    load()
    const interval = setInterval(load, 5000)
    return () => clearInterval(interval)
  }, [])

  const doughnutData = {
    labels: ['Low Risk', 'Medium Risk', 'High Risk'],
    datasets: [
      {
        data: summary ? [summary.low_risk, summary.medium_risk, summary.high_risk] : [0, 0, 0],
        backgroundColor: ['#22c55e', '#f59e0b', '#f43f5e'],
        borderWidth: 0,
      },
    ],
  }

  const lineData = {
    labels: riskTrend.map((_, i) => `T-${riskTrend.length - i}`),
    datasets: [
      {
        label: 'Avg Risk Score',
        data: riskTrend,
        borderColor: '#22d3ee',
        backgroundColor: 'rgba(34, 211, 238, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  }

  const chartOptions = {
    plugins: { legend: { labels: { color: '#94a3b8' } } },
    scales: {
      x: { ticks: { color: '#64748b' }, grid: { color: '#1e293b' } },
      y: { ticks: { color: '#64748b' }, grid: { color: '#1e293b' } },
    },
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Cameras" value={summary?.active_cameras ?? '--'} icon={Camera} color="accent" />
        <StatCard label="Trains Monitored" value={summary?.trains_monitored ?? '--'} icon={TrainFront} color="neutral" />
        <StatCard label="High Risk Events (7d)" value={summary?.high_risk ?? '--'} icon={AlertTriangle} color="danger" />
        <StatCard label="Resolved Incidents" value={summary?.resolved ?? '--'} icon={CheckCircle2} color="safe" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-rail-panel border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Activity size={18} className="text-rail-accent" />
            <h3 className="font-semibold text-white">Live Risk Score Trend</h3>
          </div>
          <Line data={lineData} options={chartOptions} height={220} />
        </div>

        <div className="bg-rail-panel border border-slate-800 rounded-xl p-4">
          <h3 className="font-semibold text-white mb-3">Hazard Classification (7d)</h3>
          <Doughnut data={doughnutData} options={{ plugins: { legend: { labels: { color: '#94a3b8' } } } }} />
        </div>
      </div>

      <div className="bg-rail-panel border border-slate-800 rounded-xl p-4">
        <h3 className="font-semibold text-white mb-3">Hazard Heatmap</h3>
        <div className="h-96 rounded-lg overflow-hidden">
          <MapContainer center={[22.0, 73.0]} zoom={8} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            {heatmap.map((point, idx) => (
              <CircleMarker
                key={idx}
                center={[point.lat, point.lng]}
                radius={6 + point.intensity * 14}
                pathOptions={{
                  color: point.intensity > 0.6 ? '#f43f5e' : point.intensity > 0.3 ? '#f59e0b' : '#22c55e',
                  fillOpacity: 0.5,
                }}
              >
                <Popup>Hazard intensity: {(point.intensity * 100).toFixed(0)}%</Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  )
}
