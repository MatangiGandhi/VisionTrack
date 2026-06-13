import React from 'react'

const colorMap = {
  accent: 'text-rail-accent border-rail-accent/30 bg-rail-accent/5',
  danger: 'text-rail-danger border-rail-danger/30 bg-rail-danger/5',
  warning: 'text-rail-warning border-rail-warning/30 bg-rail-warning/5',
  safe: 'text-rail-safe border-rail-safe/30 bg-rail-safe/5',
  neutral: 'text-slate-300 border-slate-700 bg-slate-800/40',
}

export default function StatCard({ label, value, icon: Icon, color = 'neutral', suffix = '' }) {
  const classes = colorMap[color] || colorMap.neutral
  return (
    <div className={`rounded-xl border p-4 flex items-center justify-between ${classes}`}>
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
        <p className="text-2xl font-bold mt-1">
          {value}
          {suffix && <span className="text-sm font-normal ml-1">{suffix}</span>}
        </p>
      </div>
      {Icon && <Icon size={28} className="opacity-70" />}
    </div>
  )
}
