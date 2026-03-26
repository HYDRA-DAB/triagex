import { useEffect, useRef } from "react"
import FeatureBar from "./FeatureBar"

function Hero() {
  const heroRef = useRef(null)

  useEffect(() => {
    const el = heroRef.current
    if (!el) return

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    if (prefersReducedMotion) {
      el.style.setProperty("--hero-progress", "0")
      return
    }

    let ticking = false

    const update = () => {
      ticking = false
      const rect = el.getBoundingClientRect()
      const end = rect.height * 0.85 // finish submerge before hero fully leaves viewport
      const progress = Math.max(0, Math.min(1, (0 - rect.top) / end))
      el.style.setProperty("--hero-progress", String(progress))
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)

    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
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
            <button className="btn-primary">Check Symptoms</button>
            <button className="btn-secondary">Find Doctor</button>
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