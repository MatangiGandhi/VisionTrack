import React from 'react'

const styles = {
  'Low Risk': 'bg-rail-safe/10 text-rail-safe border-rail-safe/30',
  'Medium Risk': 'bg-rail-warning/10 text-rail-warning border-rail-warning/30',
  'High Risk': 'bg-rail-danger/10 text-rail-danger border-rail-danger/30',
}

export default function RiskBadge({ classification }) {
  const style = styles[classification] || styles['Low Risk']
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${style}`}>
      {classification}
    </span>
  )
}
