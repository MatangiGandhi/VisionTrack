import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar.jsx'
import TopBar from './components/TopBar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Detection from './pages/Detection.jsx'
import Tracking from './pages/Tracking.jsx'
import Prediction from './pages/Prediction.jsx'
import Risk from './pages/Risk.jsx'
import Alerts from './pages/Alerts.jsx'
import Incidents from './pages/Incidents.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen overflow-hidden bg-rail-dark text-slate-200">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-y-auto p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/detection" element={<Detection />} />
              <Route path="/tracking" element={<Tracking />} />
              <Route path="/prediction" element={<Prediction />} />
              <Route path="/risk" element={<Risk />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/incidents" element={<Incidents />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}
