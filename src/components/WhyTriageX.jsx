import { Zap, Brain, MapPin, BookOpen, ShieldCheck, HeartHandshake } from "lucide-react"

export default function WhyTriageX() {

  const items = [
    {
      icon: Zap,
      title: "Faster Health Insights",
      text: "Understand symptoms quickly with AI-assisted guidance before visiting a doctor."
    },
    {
      icon: Brain,
      title: "Smarter Healthcare Decisions",
      text: "Receive insights that help determine when medical attention may be required."
    },
    {
      icon: MapPin,
      title: "Quick Access to Medical Care",
      text: "Locate nearby hospitals and clinics instantly during urgent situations."
    },
    {
      icon: BookOpen,
      title: "Clear Medical Information",
      text: "Prescriptions and reports explained in simple everyday language."
    },
    {
      icon: ShieldCheck,
      title: "Preventive Health Awareness",
      text: "Track fatigue, sleep, and health patterns to detect risks early."
    },
    {
      icon: HeartHandshake,
      title: "Patient Empowerment",
      text: "Helps users feel confident and informed when understanding their health."
    }
  ]

  return (

    <section className="why-triagex">

      <h2 className="why-heading">
        Why TriageX?
      </h2>

      <div className="why-scroll">

        {items.map((item,index)=>{

          const Icon = item.icon

          return(

            <div key={index} className="why-card">

              <Icon size={28} className="why-icon"/>

              <h3>{item.title}</h3>

              <p>{item.text}</p>

            </div>

          )

        })}

      </div>

    </section>

  )

}