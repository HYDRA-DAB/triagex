import { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { supabase } from "./lib/supabaseClient"

import Navbar from "./components/NavBar"
import Hero from "./components/Hero"
import FeatureShowcase from "./components/FeatureShowcase"
import WhyTriageX from "./components/WhyTriageX"
import Auth from "./pages/Auth"
import Dashboard from "./pages/Dashboard"
import SymptomX from "./pages/SymptomX" // ✅ added
import DictionaryX from "./pages/DictionaryX"
import FinderX from "./pages/FinderX"

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <FeatureShowcase />
      <WhyTriageX />
    </>
  )
}

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) return null

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={user ? <Navigate to="/dashboard" replace /> : <Auth />} />
        <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/auth" replace />} />
        <Route path="/symptomx" element={<SymptomX />} /> {/* ✅ added */}
        <Route path="/dictionaryx" element={<DictionaryX />} />
        <Route path="/finderx" element={<FinderX />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App