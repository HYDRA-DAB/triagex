import { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { supabase } from "./lib/supabaseClient"

import Navbar from "./components/NavBar"
import Hero from "./components/Hero"
import FeatureShowcase from "./components/FeatureShowcase"
import WhyTriageX from "./components/WhyTriageX"
import Auth from "./pages/Auth"
import Dashboard from "./pages/Dashboard"

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

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={user ? <Dashboard user={user} /> : <Auth />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App