"use client";

import React, { useState } from "react";
import { encode } from "plantuml-encoder";

interface TranslationResponse {
  translation: string;
  error?: string; // Optional error message from the backend
}

function Translator() {
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [URL, setURL] = useState("");
  const [loading, setLoading] = useState(false);
  const img_link = "http://www.plantuml.com/plantuml/img/";

  const encodeToUml = (text: string) => {
    setURL(img_link + encode(text));
  };

  const translate = async () => {
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input }),
      });

      if (!response.ok) {
        const errorData: { error?: string } = await response.json(); // Type the error response
        const errorMessage = errorData.error || "Translation failed";
        throw new Error(errorMessage); // Throw the error to be caught
      }

      const data: TranslationResponse = await response.json(); // Type the successful response
      encodeToUml(data.translation);
    } catch (err: unknown) {
      // Use 'unknown' type
      console.error("Error fetching /api/ask: ", err);

      if (err instanceof Error) {
        // Type guard to check if it is an error
        setError(err.message);
      } else if (typeof err === "string") {
        // Check if the error is a string
        setError(err);
      } else {
        setError("An unknown error occurred.");
      }

      setURL("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="text-black p-2 border rounded w-3/4"
        placeholder="Enter description..."
      />
      <button
        onClick={translate}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Translate
      </button>
      {loading && (
        <p className="text-gray-500">
          Please wait while the API is being generated...
        </p>
      )}
      {URL && !loading && (
        <div className="w-full flex flex-col items-center gap-2">
          <a href={URL} target="_blank" className="border p-2 rounded-full">
            Click Kar BC
          </a>
          <iframe
            src={URL}
            className="w-full h-[100vh] border rounded shadow-lg"
          />
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}

export default Translator;
