const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

// Generic word blocklist — any condition name containing these gets replaced
const GENERIC_BLOCKLIST = ["general", "infection", "emergency", "condition", "cluster", "unspecified", "non-specific", "unknown", "evaluation", "further"];

const FALLBACK_CONDITIONS = [
  {
    name: "Probable Infection",
    description: "Symptoms indicate a likely infectious condition requiring evaluation."
  },
  {
    name: "Localized Inflammatory Condition",
    description: "Symptoms suggest localized inflammation in the affected area."
  }
];

const FALLBACK_QUESTIONS = [
  { question: "How long have you been experiencing this symptom?", type: "multi", options: ["Less than 24 hours", "1-3 days", "4-7 days", "More than a week"] },
  { question: "Rate your overall discomfort level:", type: "scale" },
  { question: "Have you taken any medication for this?", type: "yesno" }
];

const makeFallback = () => ({
  conditions: [...FALLBACK_CONDITIONS],
  severity: "Low",
  specialist: "General Physician",
  reasoning: "Insufficient structured data to confidently determine condition.",
  confidenceScore: 60
});

const isGenericName = (name) => {
  const lower = name.toLowerCase();
  return GENERIC_BLOCKLIST.some(word => lower.includes(word));
};

// ---------- QUESTION ENGINE ----------

export const generateFollowUpQuestions = async (primarySymptom) => {
  if (!apiKey) return FALLBACK_QUESTIONS;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{
          role: "system",
          content: `You are a clinical triage assistant. Given a primary symptom, generate 3 to 5 clinically relevant follow-up questions to narrow down the diagnosis.

Return ONLY a valid JSON array in this exact format:
[
  {
    "question": "Clinically specific question text",
    "type": "scale | yesno | multi",
    "options": ["option1", "option2"]
  }
]

RULES:
- EXACTLY 3 to 5 questions
- Each question must be medically useful for differential diagnosis
- type "scale" = discomfort/severity rating (0-6), no options needed
- type "yesno" = yes/no question, no options needed
- type "multi" = multiple choice, MUST include 2-4 options array
- Questions must help distinguish between possible conditions
- Do NOT ask about pain level (already captured separately)
- Do NOT return markdown or explanations`
        }, {
          role: "user",
          content: primarySymptom
        }],
        temperature: 0.3,
      })
    });

    if (!response.ok) return FALLBACK_QUESTIONS;

    const data = await response.json();
    const raw = data?.choices?.[0]?.message?.content;
    if (!raw) return FALLBACK_QUESTIONS;

    const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    if (Array.isArray(parsed) && parsed.length >= 2) {
      // Validate structure of each question
      return parsed.filter(q => q.question && q.type).slice(0, 7);
    }
    return FALLBACK_QUESTIONS;
  } catch (err) {
    console.error("Failed to generate follow-up questions:", err);
    return FALLBACK_QUESTIONS;
  }
};

// ---------- DIAGNOSIS ENGINE ----------

export const analyzeSymptoms = async (symptoms) => {
  console.log("Sending symptoms:", symptoms);

  const fallbackResult = makeFallback();

  try {
    if (!apiKey) {
      console.warn("⚠️ Missing OpenAI API Key. Operating in mock fallback mode.");
      return fallbackResult;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content: `You are a clinical triage assistant.

Analyze the patient's data:
- Primary symptom and pain level
- Follow-up question answers
- Additional symptoms
- Medical literature references (if provided)

Return ONLY valid JSON in this exact format:

{
  "conditions": [
    {
      "name": "Specific disease name",
      "description": "1-2 line clinical explanation"
    }
  ],
  "severity": "Low | Medium | High",
  "specialist": "Doctor type",
  "reasoning": "Detailed symptom-based clinical reasoning",
  "confidenceScore": number (0-100)
}

STRICT RULES:
- MUST return EXACTLY 2-3 SPECIFIC diseases
- MUST use real, recognized disease names
  GOOD: Typhoid Fever, Viral Gastroenteritis, Kidney Stones, Tension Headache, Acute Bronchitis
  BAD: General Condition, Infection, Emergency, Unknown, Non-Specific
- MUST NOT return generic or vague terms
- MUST NOT return an empty conditions array
- MUST align diseases with the reported symptoms
- Each condition MUST have both name and description
- Reasoning MUST connect specific symptoms to each condition
- Severity MUST be based on clinical risk, not guesswork`
          },
          {
            role: "user",
            content: symptoms
          }
        ],
        temperature: 0.1,
      })
    });

    if (!response.ok) {
      console.error(`API Error HTTP: ${response.status} ${response.statusText}`);
      const errText = await response.text();
      console.log("Raw Error API trace:", errText);
      return fallbackResult;
    }

    const data = await response.json();
    console.log("RAW RESPONSE:", data);

    let parsed = null;

    try {
      const messageContent = data?.choices?.[0]?.message?.content;
      if (!messageContent) {
        console.error("No message content in API response");
        return fallbackResult;
      }
      console.log("OPENAI RAW RESPONSE:", messageContent);
      
      const cleanedJson = messageContent.replace(/```json/g, '').replace(/```/g, '').trim();
      parsed = JSON.parse(cleanedJson);
      console.log("PARSED:", parsed);
    } catch (parseError) {
      console.error("Parse failed:", parseError);
      parsed = null;
    }

    // FORCE FALLBACK — guarantee conditions are never empty or missing
    if (!parsed || !parsed.conditions || !Array.isArray(parsed.conditions) || parsed.conditions.length === 0) {
      console.warn("⚠️ Parsed result missing conditions, using full fallback");
      return fallbackResult;
    }

    // Ensure each condition has both name and description
    parsed.conditions = parsed.conditions.map(c => ({
      name: (c && c.name) ? c.name : "Unspecified",
      description: (c && c.description) ? c.description : "Further evaluation recommended."
    }));

    // HARD VALIDATION: reject generic names
    const hasGeneric = parsed.conditions.some(c => isGenericName(c.name));
    const allValid = parsed.conditions.filter(c => !isGenericName(c.name));

    if (allValid.length === 0 || hasGeneric && allValid.length < 2) {
      // Replace entirely with fallback conditions
      parsed.conditions = [...FALLBACK_CONDITIONS];
    } else {
      parsed.conditions = allValid.slice(0, 3);
    }

    // Guarantee severity and specialist are never undefined
    parsed.severity = parsed.severity || "Low";
    parsed.specialist = parsed.specialist || "General Physician";
    parsed.reasoning = parsed.reasoning || "Clinical evaluation based on reported symptoms.";
    parsed.confidenceScore = typeof parsed.confidenceScore === 'number' ? parsed.confidenceScore : 60;

    return parsed;
    
  } catch (error) {
    console.error("Critical OpenAI network or execution failure:", error);
    return fallbackResult;
  }
};

export const getSuggestedSymptoms = async (mainSymptom) => {
  const fallback = ["fatigue", "pain", "discomfort"];
  if (!apiKey) return fallback;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{
          role: "system",
          content: "You are a clinical assistant. Given the main symptom, list exactly 5 commonly associated symptoms. Return ONLY a valid JSON array of strings (short phrases). Do not output markdown, explanations, or objects."
        }, {
          role: "user",
          content: mainSymptom
        }],
        temperature: 0.3,
      })
    });

    if (!response.ok) return fallback;

    const data = await response.json();
    const cleanedJson = data.choices[0].message.content.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanedJson);
    
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    return fallback;
  } catch (err) {
    console.error("Failed to fetch suggested symptoms", err);
    return fallback;
  }
};

export const getSymptomSuggestions = async (partialInput, mainSymptom) => {
  const fallback = [];
  if (!apiKey || !partialInput || partialInput.length < 2) return fallback;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{
          role: "system",
          content: "Given a main symptom and partial user input, return 5 relevant medical symptoms that match the input as autocomplete suggestions. Return ONLY a valid JSON array of short string phrases. No markdown."
        }, {
          role: "user",
          content: `Main symptom: ${mainSymptom}. User is typing: ${partialInput}`
        }],
        temperature: 0.2,
      })
    });

    if (!response.ok) return fallback;

    const data = await response.json();
    const cleanedJson = data.choices[0].message.content.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanedJson);
    
    if (Array.isArray(parsed)) return parsed.slice(0, 5);
    return fallback;
  } catch (err) {
    console.error("Autocomplete fetch failed:", err);
    return fallback;
  }
};
