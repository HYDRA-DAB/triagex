import { MapPin, Brain, BookOpen, Pill } from "lucide-react";

function FeatureBar() {
  return (
    <div className="feature-bar">

      <div className="feature-card">
        <MapPin size={18}/>
        FinderX
      </div>

      <div className="feature-card">
        <Brain size={18}/>
        SymptomX
      </div>

      <div className="feature-card">
        <BookOpen size={18}/>
        DictionaryX
      </div>

      <div className="feature-card">
        <Pill size={18}/>
        TreatX
      </div>

    </div>
  )
}

export default FeatureBar;