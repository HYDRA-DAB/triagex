const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

// ══════════════════════════════════════════════════════
// BODY-PART-SPECIFIC DIAGNOSIS MAP
// Ordered MOST SPECIFIC → LEAST SPECIFIC
// The matching engine checks specific body parts FIRST
// to prevent systemic diseases being suggested for local symptoms
// ══════════════════════════════════════════════════════

const DIAGNOSIS_ENTRIES = [
  // ── NAILS ──
  {
    keywords: ["nail", "toenail", "fingernail", "cuticle"],
    conditions: [
      { name: "Paronychia (Nail Bed Infection)", description: "Bacterial or fungal infection of the skin around the nail, causing redness, swelling, and tenderness at the nail fold." },
      { name: "Ingrown Nail", description: "A condition where the nail edge grows into the surrounding skin, causing localized pain, swelling, and possible infection." },
      { name: "Nail Trauma (Subungual Hematoma)", description: "Blood collection under the nail from direct injury, causing throbbing pain and dark discoloration beneath the nail plate." }
    ],
    severity: "Low",
    specialist: "Dermatologist"
  },

  // ── FINGERS / HAND ──
  {
    keywords: ["finger", "thumb", "knuckle", "hand pain"],
    conditions: [
      { name: "Trigger Finger (Stenosing Tenosynovitis)", description: "Inflammation of the flexor tendon sheath causing the finger to catch or lock when bending." },
      { name: "Mallet Finger", description: "Injury to the extensor tendon at the fingertip, causing inability to straighten the distal joint." },
      { name: "De Quervain's Tenosynovitis", description: "Inflammation of the tendons on the thumb side of the wrist, causing pain with gripping or twisting motions." }
    ],
    severity: "Low",
    specialist: "Orthopedic Surgeon"
  },

  // ── WRIST ──
  {
    keywords: ["wrist"],
    conditions: [
      { name: "Carpal Tunnel Syndrome", description: "Compression of the median nerve at the wrist causing numbness, tingling, and weakness in the thumb and fingers." },
      { name: "Wrist Sprain", description: "Stretching or tearing of the ligaments in the wrist from a fall or sudden twist, causing pain and swelling." },
      { name: "Ganglion Cyst", description: "A fluid-filled lump on the wrist joint or tendon sheath, which may cause localized discomfort or limited motion." }
    ],
    severity: "Low",
    specialist: "Orthopedic Surgeon"
  },

  // ── ELBOW ──
  {
    keywords: ["elbow"],
    conditions: [
      { name: "Lateral Epicondylitis (Tennis Elbow)", description: "Overuse injury of the forearm extensor tendons at the lateral elbow, causing pain with gripping and wrist extension." },
      { name: "Medial Epicondylitis (Golfer's Elbow)", description: "Overuse injury of the forearm flexor tendons at the medial elbow, causing pain with wrist flexion and gripping." },
      { name: "Olecranon Bursitis", description: "Inflammation of the bursa at the tip of the elbow, causing swelling, redness, and tenderness." }
    ],
    severity: "Low",
    specialist: "Orthopedic Surgeon"
  },

  // ── SHOULDER ──
  {
    keywords: ["shoulder"],
    conditions: [
      { name: "Rotator Cuff Tendinitis", description: "Inflammation of the rotator cuff tendons causing pain with overhead movements and at night when lying on the affected side." },
      { name: "Frozen Shoulder (Adhesive Capsulitis)", description: "Progressive stiffness and pain in the shoulder joint with reduced range of motion in all directions." },
      { name: "Shoulder Impingement Syndrome", description: "Compression of the rotator cuff tendons and bursa between the humeral head and acromion during arm elevation." }
    ],
    severity: "Medium",
    specialist: "Orthopedic Surgeon"
  },

  // ── NECK ──
  {
    keywords: ["neck"],
    conditions: [
      { name: "Cervical Muscle Strain", description: "Injury to the neck muscles from poor posture, sudden movement, or sleeping awkwardly, causing pain and stiffness." },
      { name: "Cervical Spondylosis", description: "Age-related wear of the cervical spine discs and vertebrae, causing neck stiffness and occasional radiating pain." },
      { name: "Torticollis (Wry Neck)", description: "Involuntary contraction of neck muscles causing the head to tilt to one side with pain and restricted movement." }
    ],
    severity: "Medium",
    specialist: "Orthopedic Surgeon"
  },

  // ── KNEE ──
  {
    keywords: ["knee", "kneecap"],
    conditions: [
      { name: "Patellofemoral Pain Syndrome", description: "Pain around the kneecap aggravated by climbing stairs, squatting, or prolonged sitting, common in active individuals." },
      { name: "Meniscus Tear", description: "Tear of the cartilage pad in the knee joint causing pain, swelling, and locking or catching sensations." },
      { name: "Knee Ligament Sprain", description: "Stretching or partial tear of knee ligaments (MCL/LCL) from twisting or impact, causing instability and swelling." }
    ],
    severity: "Medium",
    specialist: "Orthopedic Surgeon"
  },

  // ── ANKLE / FOOT ──
  {
    keywords: ["ankle", "foot pain", "heel", "sole"],
    conditions: [
      { name: "Ankle Sprain", description: "Stretching or tearing of ankle ligaments, most commonly the lateral ligaments, from rolling or twisting the foot." },
      { name: "Plantar Fasciitis", description: "Inflammation of the plantar fascia causing stabbing heel pain, worst with the first steps in the morning." },
      { name: "Achilles Tendinitis", description: "Overuse injury of the Achilles tendon causing pain and stiffness at the back of the heel, worsened by activity." }
    ],
    severity: "Low",
    specialist: "Orthopedic Surgeon"
  },

  // ── TOE ──
  {
    keywords: ["toe", "big toe"],
    conditions: [
      { name: "Ingrown Toenail", description: "The toenail edge grows into the surrounding skin causing pain, redness, and swelling, most common on the big toe." },
      { name: "Acute Gout", description: "Sudden onset of intense pain, swelling, and redness in a joint — most commonly the big toe — caused by urate crystal deposition." },
      { name: "Toe Fracture", description: "Break in one of the toe bones from stubbing or dropping something, causing sharp pain, swelling, and bruising." }
    ],
    severity: "Low",
    specialist: "Orthopedic Surgeon"
  },

  // ── HIP ──
  {
    keywords: ["hip"],
    conditions: [
      { name: "Hip Bursitis (Trochanteric Bursitis)", description: "Inflammation of the bursa on the outer hip causing pain when lying on the affected side, walking, or climbing stairs." },
      { name: "Hip Osteoarthritis", description: "Degenerative wear of the hip joint cartilage causing groin/hip pain, stiffness, and reduced mobility." },
      { name: "Hip Flexor Strain", description: "Strain of the muscles at the front of the hip from overuse or sudden movement, common in runners and athletes." }
    ],
    severity: "Medium",
    specialist: "Orthopedic Surgeon"
  },

  // ── HEAD / HEADACHE ──
  {
    keywords: ["headache", "head pain", "migraine", "head ache"],
    conditions: [
      { name: "Tension-Type Headache", description: "A bilateral pressing headache triggered by stress, fatigue, or poor posture, typically mild to moderate in intensity." },
      { name: "Migraine Without Aura", description: "Recurrent moderate-to-severe unilateral pulsating headache often accompanied by nausea and sensitivity to light." },
      { name: "Cervicogenic Headache", description: "Headache originating from the cervical spine, often worsened by neck movement or sustained postures." }
    ],
    severity: "Medium",
    specialist: "Neurologist"
  },

  // ── EAR ──
  {
    keywords: ["ear", "hearing", "earache"],
    conditions: [
      { name: "Acute Otitis Media", description: "Middle ear infection causing ear pain, pressure, and sometimes fever, common after upper respiratory infections." },
      { name: "Otitis Externa (Swimmer's Ear)", description: "Infection of the outer ear canal causing pain worsened by pulling on the ear, itching, and discharge." },
      { name: "Cerumen Impaction (Earwax Blockage)", description: "Buildup of earwax causing muffled hearing, ear fullness, and discomfort." }
    ],
    severity: "Low",
    specialist: "ENT Specialist"
  },

  // ── EYE ──
  {
    keywords: ["eye", "vision", "blurry"],
    conditions: [
      { name: "Allergic Conjunctivitis", description: "Inflammation of the conjunctiva from allergen exposure, causing itchy, red, and watery eyes." },
      { name: "Digital Eye Strain", description: "Ocular fatigue from prolonged screen use causing dryness, blurred vision, and headaches." },
      { name: "Stye (Hordeolum)", description: "A painful red lump on the eyelid caused by a blocked oil gland infection, resembling a boil." }
    ],
    severity: "Low",
    specialist: "Ophthalmologist"
  },

  // ── NOSE ──
  {
    keywords: ["nose", "sinus", "nasal", "congestion", "runny nose", "stuffy"],
    conditions: [
      { name: "Acute Sinusitis", description: "Infection or inflammation of the paranasal sinuses causing facial pain, nasal congestion, and thick nasal discharge." },
      { name: "Allergic Rhinitis", description: "IgE-mediated nasal inflammation from allergens causing sneezing, clear runny nose, and nasal itching." },
      { name: "Nasal Septum Deviation", description: "Displacement of the nasal septum causing chronic one-sided nasal obstruction and breathing difficulty." }
    ],
    severity: "Low",
    specialist: "ENT Specialist"
  },

  // ── THROAT ──
  {
    keywords: ["throat", "sore throat", "swallow", "tonsil"],
    conditions: [
      { name: "Acute Pharyngitis", description: "Inflammation of the pharynx causing sore throat, pain on swallowing, and sometimes fever." },
      { name: "Acute Tonsillitis", description: "Infection of the tonsils presenting with severe sore throat, difficulty swallowing, and swollen lymph nodes." },
      { name: "Laryngopharyngeal Reflux", description: "Acid reflux reaching the throat area, causing throat clearing, hoarseness, and a sensation of a lump in the throat." }
    ],
    severity: "Low",
    specialist: "ENT Specialist"
  },

  // ── CHEST ──
  {
    keywords: ["chest", "chest pain", "heart", "palpitation"],
    conditions: [
      { name: "Costochondritis", description: "Inflammation of the rib-sternum cartilage causing sharp, localized chest wall pain worsened by touch or movement." },
      { name: "Gastroesophageal Reflux Disease (GERD)", description: "Chronic acid reflux causing burning chest pain (heartburn), especially after meals or when lying down." },
      { name: "Anxiety-Related Chest Tightness", description: "Non-cardiac chest discomfort triggered by anxiety or panic, often with palpitations and hyperventilation." }
    ],
    severity: "Medium",
    specialist: "Cardiologist"
  },

  // ── ABDOMEN / STOMACH ──
  {
    keywords: ["stomach", "abdomen", "abdominal", "belly", "tummy", "gastric"],
    conditions: [
      { name: "Acute Gastritis", description: "Inflammation of the stomach lining from NSAIDs, alcohol, or H. pylori, causing epigastric pain and nausea." },
      { name: "Functional Dyspepsia", description: "Chronic upper abdominal discomfort without structural cause, often aggravated by meals." },
      { name: "Irritable Bowel Syndrome (IBS)", description: "Functional GI disorder with abdominal cramping, bloating, and altered bowel habits." }
    ],
    severity: "Low",
    specialist: "Gastroenterologist"
  },

  // ── BACK ──
  {
    keywords: ["back", "lower back", "lumbar", "spine", "spinal"],
    conditions: [
      { name: "Mechanical Low Back Pain", description: "Musculoskeletal lumbar pain from strain, poor posture, or prolonged sitting without structural cause." },
      { name: "Lumbar Muscle Strain", description: "Acute injury to lumbar muscles from overexertion, lifting, or sudden movement causing localized pain and spasm." },
      { name: "Lumbar Disc Herniation", description: "Protrusion of a lumbar disc pressing on a spinal nerve, causing back pain radiating to the leg." }
    ],
    severity: "Medium",
    specialist: "Orthopedic Surgeon"
  },

  // ── SKIN / RASH ──
  {
    keywords: ["skin", "rash", "itch", "hives", "bump", "pimple", "acne", "redness"],
    conditions: [
      { name: "Contact Dermatitis", description: "Skin inflammation from direct contact with an irritant or allergen, causing redness, itching, and blistering." },
      { name: "Atopic Dermatitis (Eczema)", description: "Chronic inflammatory skin condition with dry, itchy, inflamed patches, commonly on flexural surfaces." },
      { name: "Urticaria (Hives)", description: "Raised, itchy welts triggered by allergic reactions, medications, or infections, which come and go." }
    ],
    severity: "Low",
    specialist: "Dermatologist"
  },

  // ── TEETH / MOUTH / JAW ──
  {
    keywords: ["tooth", "teeth", "dental", "jaw", "gum", "mouth", "tongue"],
    conditions: [
      { name: "Dental Caries (Tooth Decay)", description: "Bacterial destruction of tooth enamel and dentin causing sensitivity, pain, and cavitations." },
      { name: "Gingivitis", description: "Inflammation of the gums caused by plaque buildup, presenting with redness, swelling, and bleeding on brushing." },
      { name: "Temporomandibular Joint Disorder (TMJ)", description: "Dysfunction of the jaw joint causing jaw pain, clicking, difficulty chewing, and headaches." }
    ],
    severity: "Low",
    specialist: "Dentist"
  },

  // ── COUGH ──
  {
    keywords: ["cough", "coughing"],
    conditions: [
      { name: "Acute Bronchitis", description: "Viral inflammation of the bronchial tubes causing persistent cough with mucus production for several weeks." },
      { name: "Post-Nasal Drip Syndrome", description: "Chronic cough from mucus dripping from the nose into the throat, often linked to allergies or sinusitis." },
      { name: "Allergic Rhinitis with Cough", description: "Allergen-triggered nasal inflammation producing a reflex cough from post-nasal drip." }
    ],
    severity: "Low",
    specialist: "Pulmonologist"
  },

  // ── BREATHING / SHORTNESS OF BREATH ──
  {
    keywords: ["breath", "breathing", "shortness of breath", "wheeze", "asthma"],
    conditions: [
      { name: "Asthma", description: "Chronic airway inflammation causing episodic wheezing, cough, chest tightness, and shortness of breath." },
      { name: "Acute Anxiety Episode", description: "Hyperventilation from anxiety or panic attacks causing perceived breathlessness and chest tightness." },
      { name: "Exercise-Induced Bronchoconstriction", description: "Airway narrowing triggered by exercise, causing temporary wheezing and dyspnea." }
    ],
    severity: "Medium",
    specialist: "Pulmonologist"
  },

  // ── FEVER ──
  {
    keywords: ["fever", "temperature", "chills"],
    conditions: [
      { name: "Viral Upper Respiratory Infection", description: "Common viral illness with fever, sore throat, nasal congestion, and general malaise." },
      { name: "Influenza", description: "Acute respiratory infection with high fever, body aches, fatigue, and cough." },
      { name: "Acute Pharyngitis", description: "Pharyngeal inflammation from viral or bacterial pathogens causing sore throat and fever." }
    ],
    severity: "Medium",
    specialist: "Internal Medicine Physician"
  },

  // ── NAUSEA / VOMITING ──
  {
    keywords: ["nausea", "vomit", "throwing up", "queasy"],
    conditions: [
      { name: "Acute Gastroenteritis", description: "Stomach and intestinal inflammation (usually viral) causing nausea, vomiting, diarrhea, and cramps." },
      { name: "Food Poisoning", description: "Illness from consuming contaminated food, causing sudden onset nausea, vomiting, and diarrhea." },
      { name: "Gastroesophageal Reflux Disease (GERD)", description: "Chronic acid reflux causing nausea, heartburn, and discomfort worsened by meals or lying down." }
    ],
    severity: "Low",
    specialist: "Gastroenterologist"
  },

  // ── DIZZINESS ──
  {
    keywords: ["dizzy", "vertigo", "lightheaded", "faint"],
    conditions: [
      { name: "Benign Paroxysmal Positional Vertigo (BPPV)", description: "Brief vertigo episodes triggered by head position changes, caused by displaced inner ear crystals." },
      { name: "Orthostatic Hypotension", description: "Blood pressure drop upon standing causing lightheadedness, weakness, or fainting." },
      { name: "Vestibular Neuritis", description: "Inner ear nerve inflammation causing sudden severe vertigo, nausea, and balance problems." }
    ],
    severity: "Medium",
    specialist: "Neurologist"
  },

  // ── FATIGUE / TIREDNESS ──
  {
    keywords: ["fatigue", "tired", "exhaustion", "weakness", "lethargy"],
    conditions: [
      { name: "Iron Deficiency Anemia", description: "Insufficient red blood cells from low iron causing fatigue, pallor, and reduced exercise tolerance." },
      { name: "Hypothyroidism", description: "Underactive thyroid gland causing fatigue, weight gain, cold intolerance, and sluggishness." },
      { name: "Vitamin D Deficiency", description: "Inadequate vitamin D levels causing fatigue, muscle weakness, and bone pain." }
    ],
    severity: "Medium",
    specialist: "Endocrinologist"
  },

  // ── ANXIETY / MENTAL HEALTH ──
  {
    keywords: ["anxiety", "panic", "stress", "nervous", "worry", "depression", "sad", "insomnia", "sleep"],
    conditions: [
      { name: "Generalized Anxiety Disorder (GAD)", description: "Persistent excessive worry about everyday situations causing restlessness, tension, and difficulty concentrating." },
      { name: "Panic Disorder", description: "Recurrent unexpected panic attacks with palpitations, sweating, trembling, and fear of losing control." },
      { name: "Adjustment Disorder with Anxiety", description: "Anxiety symptoms developing in response to an identifiable life stressor within three months of onset." }
    ],
    severity: "Medium",
    specialist: "Psychiatrist"
  },

  // ── URINARY ──
  {
    keywords: ["urine", "urination", "burning pee", "bladder", "kidney"],
    conditions: [
      { name: "Urinary Tract Infection (UTI)", description: "Bacterial infection of the urinary tract causing painful urination, frequency, urgency, and cloudy urine." },
      { name: "Kidney Stones (Nephrolithiasis)", description: "Hard mineral deposits in the kidneys causing severe flank pain, blood in urine, and painful urination." },
      { name: "Overactive Bladder Syndrome", description: "Sudden, uncontrollable urge to urinate with increased frequency, with or without urge incontinence." }
    ],
    severity: "Medium",
    specialist: "Urologist"
  },

  // ── DIARRHEA / CONSTIPATION ──
  {
    keywords: ["diarrhea", "constipation", "bowel", "stool", "bloating", "gas"],
    conditions: [
      { name: "Irritable Bowel Syndrome (IBS)", description: "Functional GI disorder with abdominal cramping, bloating, and alternating diarrhea and constipation." },
      { name: "Acute Gastroenteritis", description: "Infectious inflammation of the GI tract causing diarrhea, cramping, nausea, and sometimes fever." },
      { name: "Lactose Intolerance", description: "Inability to digest lactose causing bloating, gas, diarrhea, and abdominal cramps after dairy consumption." }
    ],
    severity: "Low",
    specialist: "Gastroenterologist"
  },
];

// Default diagnosis — used ONLY when no body part matches at all
const DEFAULT_DIAGNOSIS = {
  conditions: [
    { name: "Acute Viral Illness", description: "A common viral infection causing a combination of systemic symptoms including malaise, discomfort, and mild fever." },
    { name: "Musculoskeletal Strain", description: "Injury to muscles or tendons from overuse or sudden movement, causing localized pain and tenderness." },
    { name: "Stress-Related Somatic Symptoms", description: "Physical symptoms arising from emotional or psychological stress, warranting clinical evaluation." }
  ],
  severity: "Low",
  specialist: "General Physician"
};

/**
 * Matches symptom text to the MOST SPECIFIC body-part category.
 * Checks more specific keywords first (nail, finger, ankle) before
 * broader ones (pain, skin) to prevent systemic disease suggestions
 * for localized symptoms.
 */
function findBestDiagnosis(text) {
  const lower = text.toLowerCase();
  for (const entry of DIAGNOSIS_ENTRIES) {
    for (const keyword of entry.keywords) {
      if (lower.includes(keyword)) {
        return entry;
      }
    }
  }
  return null;
}

/**
 * Generates a symptom-aware local diagnosis from the collected history.
 * Matches body-part-specific conditions and adjusts severity from answers.
 */
function generateLocalDiagnosis(symptom, history) {
  const combined = `${symptom} ${history.map(h => `${h.question} ${h.answer}`).join(' ')}`;

  // Match the PRIMARY symptom first, then fall back to combined text
  const match = findBestDiagnosis(symptom) || findBestDiagnosis(combined) || DEFAULT_DIAGNOSIS;

  // Adjust severity from answers
  let severity = match.severity;
  const historyText = history.map(h => h.answer).join(' ').toLowerCase();

  const scaleAnswer = history.find(h =>
    h.question.toLowerCase().includes('scale') || h.question.toLowerCase().includes('severity')
  );
  if (scaleAnswer) {
    const num = parseInt(scaleAnswer.answer);
    if (!isNaN(num)) {
      if (num >= 8) severity = "High";
      else if (num >= 5) severity = "Medium";
    }
  }

  if (historyText.includes('more than a week') || historyText.includes('chronic') || historyText.includes('months')) {
    if (severity === "Low") severity = "Medium";
  }

  // Build structured reasoning
  const reasoningParts = [`Patient presented with: ${symptom}.`];
  for (const h of history) {
    reasoningParts.push(`${h.question} → ${h.answer}.`);
  }
  reasoningParts.push(`Based on symptom location and clinical pattern, the following conditions are most consistent with the presentation.`);

  return {
    type: "result",
    conditions: match.conditions,
    severity,
    specialist: match.specialist,
    reasoning: reasoningParts.join(' ')
  };
}

// ── Safety-net questions focused on clinical indicators ──
const SAFETY_QUESTIONS = [
  {
    type: "question",
    question: "How long have you been experiencing this symptom?",
    inputType: "multi",
    options: ["Less than 24 hours", "1-3 days", "4-7 days", "More than a week"]
  },
  {
    type: "question",
    question: "Is there any visible swelling, redness, or signs of injury?",
    inputType: "yesno",
    options: []
  },
  {
    type: "question",
    question: "How would you rate the severity on a scale of 1 to 10?",
    inputType: "scale",
    options: []
  },
  {
    type: "question",
    question: "Was there a specific injury, strain, or triggering event?",
    inputType: "yesno",
    options: []
  },
  {
    type: "question",
    question: "Are you experiencing any other symptoms alongside this?",
    inputType: "text",
    options: []
  }
];

function getSafetyQuestion(stepNumber) {
  const idx = Math.min(stepNumber - 1, SAFETY_QUESTIONS.length - 1);
  return { ...SAFETY_QUESTIONS[idx] };
}

// ══════════════════════════════════════════════════════
// MAIN TRIAGE ENGINE
// ══════════════════════════════════════════════════════

export async function getNextStep({ symptom, history, stepNumber }) {
  const mustAskQuestion = history.length < 2;

  // ── No API key → offline triage ──
  if (!apiKey) {
    console.warn("⚠️ No OpenAI API Key. Using offline triage mode.");
    if (mustAskQuestion || stepNumber <= SAFETY_QUESTIONS.length) {
      return getSafetyQuestion(stepNumber);
    }
    return generateLocalDiagnosis(symptom, history);
  }

  // ── Build history string ──
  const historyString = history.length > 0
    ? history.map((h, i) => `Q${i + 1}: ${h.question}\nA${i + 1}: ${h.answer}`).join("\n\n")
    : "None yet.";

  // ── CLINICALLY-AWARE PROMPT ──
  const systemPrompt = `You are a highly experienced clinical doctor.

Your job is to diagnose based on symptoms with strong contextual reasoning.

--------------------------------------------------

INPUT:

Primary Symptom:
${symptom}

History:
${historyString}

Step:
${stepNumber}

--------------------------------------------------

CRITICAL RULES — SYMPTOM LOCATION AWARENESS:

1. You MUST understand the LOCATION of the symptom.

Examples:
- "nail pain" → nail / finger → dermatological / local trauma
- "chest pain" → cardiovascular / respiratory
- "stomach pain" → gastrointestinal
- "ankle pain" → musculoskeletal / local injury
- "ear pain" → otological

2. You MUST ONLY suggest diseases relevant to that exact body part.

3. STRICT FILTERING — You are NOT allowed to suggest:
- Systemic diseases (like Fibromyalgia, Peripheral Neuropathy) for localized symptoms
- Unrelated conditions from other body systems
- Rare conditions unless strongly justified by the history
- Generic terms like "pain disorder" or "general condition"

GOOD examples for "nail pain":
- Ingrown Toenail ✅
- Paronychia (Nail Bed Infection) ✅
- Nail Trauma ✅

BAD examples for "nail pain":
- Fibromyalgia ❌
- Peripheral Neuropathy ❌
- Myofascial Pain Syndrome ❌

--------------------------------------------------

QUESTION RULES:

1. You MUST ask at least ONE question before giving a diagnosis.
2. Ask ONLY ONE question per step.
3. Focus questions on: injury, swelling, redness, infection signs, duration, triggers.
4. Do NOT skip directly to result unless stepNumber >= 5 OR enough information is clearly available.
5. If inputType is "multi", include an "options" array with 2-4 short choices.
6. If inputType is "scale", the scale is 1-10.

--------------------------------------------------

FINAL OUTPUT RULES:

- Return EXACTLY 2-3 diseases
- Must be COMMON and REALISTIC
- Must match the symptom's body location
- Always think: "Does this make sense clinically?" If not → DO NOT include it

--------------------------------------------------

OUTPUT FORMAT (STRICT):

IF ASKING QUESTION:
{
  "type": "question",
  "question": "Your question here",
  "inputType": "yesno | scale | text | multi",
  "options": ["opt1", "opt2"]
}

IF FINAL RESULT:
{
  "type": "result",
  "conditions": [
    {
      "name": "Disease name matching the body part",
      "description": "Short clinical explanation"
    }
  ],
  "severity": "Low | Medium | High",
  "specialist": "Correct specialist for this body area",
  "reasoning": "Explain WHY these diseases match the symptom location and history"
}

--------------------------------------------------

IMPORTANT:
- NEVER return plain text. ALWAYS return valid JSON only.
- NEVER skip directly to result at step 1.
- Return ONLY raw JSON. No markdown, no code fences, no explanations.`;

  // ── API call ──
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Analyze and respond for step ${stepNumber}. Return ONLY JSON.` }
        ],
        temperature: 0.3,
      })
    });

    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`);
      if (mustAskQuestion || stepNumber <= SAFETY_QUESTIONS.length) {
        return getSafetyQuestion(stepNumber);
      }
      return generateLocalDiagnosis(symptom, history);
    }

    const data = await response.json();
    const raw = data?.choices?.[0]?.message?.content;

    if (!raw) {
      console.error("Empty API response content");
      if (mustAskQuestion) return getSafetyQuestion(stepNumber);
      return generateLocalDiagnosis(symptom, history);
    }

    const cleaned = raw.replace(/```json/g, "").replace(/```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error("JSON parse failed:", parseErr, "\nRaw:", raw);
      if (mustAskQuestion) return getSafetyQuestion(stepNumber);
      return generateLocalDiagnosis(symptom, history);
    }

    // GUARD: If AI returned "result" too early, override
    if (mustAskQuestion && parsed.type === "result") {
      console.warn("⚠️ AI tried to return result at step", stepNumber, "— overriding with safety question");
      return getSafetyQuestion(stepNumber);
    }

    // Handle "question" response
    if (parsed.type === "question" && typeof parsed.question === "string" && parsed.question.length > 0) {
      const validInputTypes = ["yesno", "scale", "text", "multi"];
      const inputType = validInputTypes.includes(parsed.inputType) ? parsed.inputType : "yesno";

      let options = [];
      if (inputType === "multi") {
        options = (Array.isArray(parsed.options) && parsed.options.length >= 2)
          ? parsed.options
          : ["Yes", "No", "Not sure"];
      }

      return { type: "question", question: parsed.question, inputType, options };
    }

    // Handle "result" response
    if (parsed.type === "result" && Array.isArray(parsed.conditions) && parsed.conditions.length > 0) {
      const safeConditions = parsed.conditions.slice(0, 3).map(c => ({
        name: typeof c === "string" ? c : (c?.name || "Unspecified Condition"),
        description: typeof c === "string" ? "Further evaluation recommended." : (c?.description || "Further evaluation recommended.")
      }));

      return {
        type: "result",
        conditions: safeConditions,
        severity: ["Low", "Medium", "High"].includes(parsed.severity) ? parsed.severity : "Low",
        specialist: parsed.specialist || "General Physician",
        reasoning: parsed.reasoning || "Clinical evaluation based on reported symptoms."
      };
    }

    // Unrecognized response shape
    console.warn("⚠️ Unrecognized response shape:", parsed);
    if (mustAskQuestion) return getSafetyQuestion(stepNumber);
    return generateLocalDiagnosis(symptom, history);

  } catch (error) {
    console.error("Critical getNextStep failure:", error);
    if (mustAskQuestion || stepNumber <= SAFETY_QUESTIONS.length) {
      return getSafetyQuestion(stepNumber);
    }
    return generateLocalDiagnosis(symptom, history);
  }
}
