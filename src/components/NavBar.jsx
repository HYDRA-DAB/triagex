import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

export default function Navbar() {

  const navigate = useNavigate();

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[85%] max-w-6xl z-50">

      <div className="
      flex items-center justify-between
      px-8 py-3
      rounded-xl
      bg-[rgba(11,15,25,0.75)]
      backdrop-blur-xl
      border border-white/10
      ">

        {/* LOGO + BRAND */}

        <div className="flex items-center gap-3">

          <img
            src={logo}
            alt="TriageX Logo"
            className="w-10 h-10 object-contain"
          />

          <span className="text-[#C4B5FD] font-semibold text-lg tracking-wide">
            TRIAGEX
          </span>

        </div>


        {/* CENTER NAV */}

        <div className="flex items-center gap-10 text-sm text-[#F3F4F6]">

          <a href="#home" className="hover:text-[#A78BFA] transition">
            Home
          </a>

          {/* FEATURES */}

          <div className="relative group">

            <span className="cursor-pointer hover:text-[#A78BFA] transition">
              Features
            </span>

            <div className="
            absolute
            left-1/2 -translate-x-1/2
            top-10
            opacity-0 invisible translate-y-2
            group-hover:opacity-100
            group-hover:visible
            group-hover:translate-y-0
            transition-all duration-300
            flex flex-col gap-3 p-4 w-52
            rounded-lg bg-[#12131a]
            border border-white/10 backdrop-blur-xl
            ">

              <a href="#finder" className="hover:text-[#A78BFA] transition">
                FinderX
              </a>

              <a href="#symptom" className="hover:text-[#A78BFA] transition">
                SymptomX
              </a>

              <a
                href="#prevention"
                className="ml-4 text-[#9CA3AF] hover:text-[#A78BFA] transition text-xs"
              >
                └ PreventionX
              </a>

              <a href="#dictionary" className="hover:text-[#A78BFA] transition">
                DictionaryX
              </a>

              <a href="#treat" className="hover:text-[#A78BFA] transition">
                TreatX
              </a>

            </div>

          </div>

          <a href="#dashboard" className="hover:text-[#A78BFA] transition">
            Dashboard
          </a>

          <a href="#about" className="hover:text-[#A78BFA] transition">
            About
          </a>

        </div>


        {/* RIGHT SIDE ACTIONS */}

        <div className="flex items-center gap-4">

          {/* SOS */}

          <div className="relative group">

            <button
              className="
              px-4 py-1.5
              rounded-lg
              text-red-400
              border border-red-500/30
              hover:text-white
              hover:bg-red-500
              transition duration-300
              shadow-[0_0_8px_rgba(239,68,68,0.25)]
              "
            >
              🚨 SOS
            </button>

            <div className="
            absolute
            right-0
            top-10
            opacity-0 invisible translate-y-2
            group-hover:opacity-100
            group-hover:visible
            group-hover:translate-y-0
            transition-all duration-300
            flex flex-col gap-3 p-4 w-56
            rounded-lg bg-[#12131a]
            border border-red-500/30 backdrop-blur-xl
            ">

              <button className="text-left hover:text-red-400 transition">
                Call Ambulance
              </button>

              <button className="text-left hover:text-red-400 transition">
                Nearby Hospitals
              </button>

              <button className="text-left hover:text-red-400 transition">
                Emergency Doctor
              </button>

              <button className="text-left hover:text-red-400 transition">
                Share Location
              </button>

            </div>

          </div>


          {/* LOGIN */}

          <button
            onClick={() => navigate("/auth")}
            className="text-[#F3F4F6] hover:text-[#A78BFA] transition"
          >
            Login
          </button>

        </div>

      </div>

    </nav>
  );
}