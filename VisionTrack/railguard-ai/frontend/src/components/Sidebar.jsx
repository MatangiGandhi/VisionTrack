import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Eye,
  Crosshair,
  TrendingUp,
  ShieldAlert,
  BellRing,
  History,
  TrainTrack,
  Menu,
} from 'lucide-react'

const links = [
  { to: '/', label: 'Overview', icon: LayoutDashboard },
  { to: '/detection', label: 'Hazard Detection', icon: Eye },
  { to: '/tracking', label: 'Object Tracking', icon: Crosshair },
  { to: '/prediction', label: 'Trajectory Forecast', icon: TrendingUp },
  { to: '/risk', label: 'Risk Intelligence', icon: ShieldAlert },
  { to: '/alerts', label: 'Smart Alerts', icon: BellRing },
  { to: '/incidents', label: 'Incident History', icon: History },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={`${
        collapsed ? 'w-20' : 'w-64'
      } shrink-0 bg-rail-panel border-r border-slate-800 flex flex-col transition-all duration-300`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-slate-800">
        <div className="flex items-center gap-2 overflow-hidden">
          
          {!collapsed && (
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white">
                VisionTrack
              </h1>
              <p className="text-xs text-slate-500">
                Hazard Intelligence System
              </p>
            </div>
          )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-slate-400 hover:text-white"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center ${
                collapsed ? 'justify-center' : 'gap-3 px-3'
              } py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-rail-accent/10 text-rail-accent border border-rail-accent/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`
            }
          >
            <Icon size={18} />
            {!collapsed && label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="px-4 py-4 border-t border-slate-800 text-xs text-slate-500">
          {/* <p>
            System Status:{' '}
            <span className="text-green-400 font-semibold">
              Operational
            </span>
          </p> */}
          {/* <p className="mt-1">v1.0.0 — Predictive Mode</p> */}
        </div>
      )}
    </aside>
  )
}