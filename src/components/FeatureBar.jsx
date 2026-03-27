import { MapPin, Brain, BookOpen, Pill } from "lucide-react";
import { useNavigate } from "react-router-dom";

function FeatureBar() {
  const navigate = useNavigate();
  return (
    <div className="feature-bar">

      <div className="feature-card cursor-pointer" onClick={() => navigate("/finderx")}>
        <MapPin size={18}/>
        FinderX
      </div>

      <div className="feature-card cursor-pointer" onClick={() => navigate("/symptomx")}>
        <Brain size={18}/>
        SymptomX
      </div>

      <div className="feature-card cursor-pointer" onClick={() => navigate("/dictionaryx")}>
        <BookOpen size={18}/>
        DictionaryX
      </div>

    </div>
  )
}

export default FeatureBar;