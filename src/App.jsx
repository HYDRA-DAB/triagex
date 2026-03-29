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
      <div className="w-full bg-[#0B0F19]">
        <FeatureShowcase />
      </div>
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

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("AUTH EVENT:", event);
        console.log("SESSION:", session);

        setUser(session?.user ?? null);
        setLoading(false);

        // Hard redirect if we are on the auth page to break React Router loops
        if (session && window.location.pathname === "/auth") {
          window.location.href = "/dashboard";
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, [])

  if (loading) return null;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Let Auth component handle its own redirect flow and processing */}
        <Route path="/auth" element={<Auth />} />
        {/* Protect Dashboard explicitly */}
        <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/auth" replace />} />
        <Route path="/symptomx" element={<SymptomX />} />
        <Route path="/dictionaryx" element={<DictionaryX />} />
        <Route path="/finderx" element={<FinderX />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App