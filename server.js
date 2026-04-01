import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const supabase = process.env.SUPABASE_URL && process.env.SUPABASE_KEY
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)
  : null;

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

app.use(rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false
}));

const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000;
const MAX_CACHE_SIZE = 100;

function setCache(key, value) {
  if (cache.size >= MAX_CACHE_SIZE) {
    const firstKey = cache.keys().next().value;
    cache.delete(firstKey);
  }
  cache.set(key, { data: value, expiry: Date.now() + CACHE_TTL });
}

function getCache(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiry) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function validateData(data, input) {
  return {
    title: data?.title || input,
    core_explanation: data?.core_explanation || "No explanation available.",
    what_it_means: Array.isArray(data?.what_it_means) ? data.what_it_means : ["N/A"],
    risk_level: data?.risk_level || "low",
    medication_context: {
      purpose: data?.medication_context?.purpose || "N/A",
      guidelines: data?.medication_context?.guidelines || "N/A",
      side_effects: Array.isArray(data?.medication_context?.side_effects)
        ? data.medication_context.side_effects
        : []
    }
  };
}

async function getWikiData(query) {
  try {
    const formattedQuery = query.replace(/ /g, "_");

    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${formattedQuery}`
    );

    const data = await res.json();

    return {
      title: data.title || query,
      core_explanation: data.extract || "No information available.",
      what_it_means: ["Information sourced from Wikipedia"],
      risk_level: "low",
      medication_context: {
        purpose: "Educational information",
        guidelines: "Consult a doctor for medical advice",
        side_effects: []
      }
    };
  } catch (err) {
    console.error("WIKI ERROR:", err.message);
    return null;
  }
}

app.get("/", (req, res) => {
  res.send("DictionaryX backend is alive");
});

app.post("/api/dictionary/analyze", async (req, res) => {
  try {
    const input = req.body.text;
    console.log("INPUT:", input);
    if (!input) return res.status(400).json({ error: "Missing input" });

    const key = input.toLowerCase().trim();
    const cached = getCache(key);
    if (cached) return res.json({ type: "search", data: cached });

    let data = null;
    const provider = "Wikipedia";

    data = await getWikiData(input);

    if (!data || typeof data !== "object" || Object.keys(data).length === 0) {
      data = {
        title: input,
        core_explanation: "No information found for this term.",
        what_it_means: ["Try searching with a different term."],
        risk_level: "low",
        medication_context: {
          purpose: "N/A",
          guidelines: "N/A",
          side_effects: []
        }
      };
    }

    const validated = validateData(data, input);
    setCache(key, validated);

    if (supabase) {
      (async () => {
        try {
          const { error } = await supabase.from("dictionary_logs").insert([{
            input,
            result: validated,
            provider,
            created_at: new Date().toISOString()
          }]);
          if (error) console.error("Supabase log error:", error.message);
        } catch (e) {
          console.error("Supabase log crash:", e.message);
        }
      })();
    }

    return res.json({ type: "search", data: validated });

  } catch (err) {
    console.error("FULL API ERROR:", err);
    return res.status(200).json({
      type: "search",
      data: {
        title: "Error",
        core_explanation: "Something went wrong but system is stable.",
        what_it_means: ["Retry request"],
        risk_level: "low",
        medication_context: {
          purpose: "N/A",
          guidelines: "N/A",
          side_effects: []
        }
      }
    });
  }
});

const PORT = process.env.PORT || 3001;

console.log("🚀 Starting DictionaryX server...");

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});