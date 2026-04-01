import { useState } from "react";
import { analyzeDictionary } from "./api";

export function useDictionary() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [type, setType] = useState("search");

  const handleSearch = async (text) => {
    try {
      if (!text || text.trim() === "") {
        throw new Error("Input string is entirely empty");
      }
      setLoading(true);
      setError(null);

      const res = await analyzeDictionary({ text });
      
      if (!res.data && res.message) {
        // Fallback GET trigger diagnostic fallback to console
        console.log("Server Debug Payload:", res.message);
      }

      setResult(res.data);
      setType("search");

    } catch (err) {
      console.error("Hook Network/Render Failure:", err);
      setError(err?.message || "Internal Dictionary hook catch failure");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file) => {
    try {
      if (!file) throw new Error("No file explicitly selected");
      setLoading(true);
      setError(null);

      const res = await analyzeDictionary({ file });

      setResult(res.data);
      setType("report");

    } catch (err) {
      console.error("Hook Network/Render Failure:", err);
      setError(err?.message || "Internal File mapping hook crash");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return {
    result,
    loading,
    error,
    type,
    handleSearch,
    handleFileUpload,
  };
}
