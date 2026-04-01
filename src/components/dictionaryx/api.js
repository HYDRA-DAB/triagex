export async function analyzeText(text) {
  try {
    const res = await fetch("http://localhost:3001/api/dictionary/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    console.log("SERVER RESPONSE:", data);
    return data;
  } catch (err) {
    console.error("FETCH ERROR:", err);
    throw err;
  }
}

// Preserve existing component interface for file if needed
export async function analyzeDictionary({ text, file }) {
  if (file) {
    let body = new FormData();
    body.append("file", file);
    try {
      const res = await fetch("http://localhost:3001/api/dictionary/analyze", {
        method: "POST",
        body,
      });
      return await res.json();
    } catch (err) {
      console.error("FILE UPLOAD ERROR:", err);
      throw err;
    }
  } else {
    // Pipeline to our text analyzer natively returning standard Dictionary format.
    return await analyzeText(text);
  }
}
