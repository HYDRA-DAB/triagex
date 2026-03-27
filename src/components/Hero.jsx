import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import FeatureBar from "./FeatureBar"

function Hero() {
  const navigate = useNavigate()
  const heroRef = useRef(null)

  useEffect(() => {
    const el = heroRef.current
    if (!el) return

    // STATIC HERO (NO SCROLL ANIMATION)
    el.style.setProperty("--hero-progress", "0")
  }, [])

  return (
    <section className="hero" ref={heroRef}>
      <div className="hero-bg" aria-hidden="true" />
      <div className="hero-submerge" aria-hidden="true" />

      <div className="hero-container">

        <div className="hero-left">

          <div className="brand">
            TRIAGE-X
          </div>

          <h1 className="hero-title">
            Smarter Health <br />
            Starts With <span>Understanding</span>
          </h1>

          <p className="hero-subtitle">
            TriageX helps you analyze symptoms, find the right care,
            understand medical information, and track treatments
            with intelligent AI assistance.
          </p>

          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => navigate("/symptomx")}>Check Symptoms</button>
            <button className="btn-secondary" onClick={() => navigate("/finderx")}>Find Doctor</button>
          </div>

        </div>

        <div className="hero-right">

          <div className="dashboard-preview">
            <h4>AI Health Scan</h4>

            <ul>
              <li>Symptoms detected</li>
              <li>Risk level analysis</li>
              <li>Recommended care</li>
            </ul>
          </div>

        </div>

      </div>

      <div className="hero-features">
        <FeatureBar />
      </div>

    </section>
  )
}

export default Hero