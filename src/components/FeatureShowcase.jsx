import { Brain, MapPin, BookOpen, Pill, ShieldCheck } from "lucide-react"

const features = [
  {
    title: "SymptomX",
    icon: Brain,
    image: "/symptomx.jpeg",
    desc: "Symptom helps users analyze their symptoms intelligently before visiting a doctor. The system asks follow-up questions and evaluates potential health risks using AI-assisted reasoning.",
    points: [
      "Interactive symptom input",
      "Follow-up medical questions",
      "Risk level classification",
      "Symptom history tracking"
    ],
    impact:
      "This helps users understand whether their condition may require medical attention or simple self-care."
  },

  {
    title: "FinderX",
    icon: MapPin,
    image: "/finderx.jpeg",
    desc: "Finder helps users quickly locate nearby hospitals, clinics, and healthcare providers. The system uses location awareness to suggest the most relevant medical facilities.",
    points: [
      "Nearby hospital discovery",
      "Emergency care suggestions",
      "Distance and availability filtering",
      "Quick navigation support"
    ],
    impact:
      "Users can immediately find the right healthcare facility during urgent or uncertain situations."
  },

  {
    title: "DictionaryX",
    icon: BookOpen,
    image: "/dictionaryx.jpeg",
    desc: "Dictionary simplifies complex medical language. It explains prescriptions, reports, and medical terminology in clear everyday language.",
    points: [
      "Prescription explanation",
      "Medical report interpretation",
      "Terminology simplification",
      "Patient-friendly definitions"
    ],
    impact:
      "Patients gain clarity and confidence when reading medical information that is normally difficult to understand."
  }
]

import { useNavigate } from "react-router-dom"

export default function FeatureShowcase() {
  const navigate = useNavigate()

  return (

    <section className="feature-showcase">

      <h2 className="showcase-heading">
        Core Features
      </h2>

      {features.map((feature,index)=>{

        const Icon = feature.icon

        return (

          <div
            key={index}
            onClick={
              feature.title === "SymptomX" ? () => navigate("/symptomx") :
              feature.title === "DictionaryX" ? () => navigate("/dictionaryx") :
              feature.title === "FinderX" ? () => navigate("/finderx") :
              undefined
            }
            className={`showcase-row ${index % 2 !== 0 ? "reverse" : ""} ${feature.title === "SymptomX" || feature.title === "DictionaryX" || feature.title === "FinderX" ? "cursor-pointer" : ""}`}
          >

            <div className="feature-text">

              <Icon size={40} className="feature-icon"/>

              <h3>{feature.title}</h3>

              <p>{feature.desc}</p>

              <ul>
                {feature.points.map((point,i)=>(
                  <li key={i}>{point}</li>
                ))}
              </ul>

              <p style={{marginTop:"14px", color:"#C4B5FD"}}>
                {feature.impact}
              </p>

            </div>

            <div className="feature-image">

              <div className="image-box">
                <img src={feature.image} alt={feature.title} />
              </div>

            </div>

          </div>

        )

      })}

    </section>

  )

}