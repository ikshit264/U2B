"use client";

import React, { useState } from "react";
import { encode } from "plantuml-encoder";

interface TranslationResponse {
  translation: string;
  error?: string;
}

function Translator() {
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [level, setLevel] = useState<"good" | "better" | "best" | "">("");
  const [URL, setURL] = useState("");
  const [output, setoutput] = useState("");
  const [fetching, setfetching] = useState(false);
  const [posting, setposting] = useState(false);
  const [Status, setStatus] = useState("");
  const img_link = "https://www.plantuml.com/plantuml/img/";

  const encodeToUml = (text: string) => {
    setURL(img_link + encode(text));
  };

  const translate = async () => {
    setfetching(true);
    setposting(false);
    setStatus("");
    setError(null); 
    setError(null);
    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input }),
      });

      if (!response.ok) {
        const errorData: { error?: string } = await response.json();
        const errorMessage = errorData.error || "Translation failed";
        throw new Error(errorMessage);
      }

      const data: TranslationResponse = await response.json();
      setoutput(data.translation);
      encodeToUml(data.translation);
    } catch (err: unknown) {
      console.error("Error fetching /api/ask: ", err);

      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === "string") {
        setError(err);
      } else {
        setError("An unknown error occurred.");
      }

      setURL("");
    } finally {
      setfetching(false);
    }
  };

  const addToDb = async () => {
    try {
      setposting(true);
      setStatus(""); // Reset before request

      const response = await fetch("/api/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: input,
          output: output,
          image: URL,
          priority: level,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setStatus(errorData.message || "Failed to add data");
        return;
      }

      const data = await response.json();
      setStatus(data.message);
    } catch (err) {
      console.error("Error fetching /api/data: ", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setposting(false);
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
      disabled = {fetching}
        onClick={translate}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Generate
      </button>
      {fetching && (
        <p className="text-gray-500">
          Please wait while the API is being generated...
        </p>
      )}
      {Status !== "" && <div className="text-green-500">{Status}</div>}

      {URL && !fetching && (
        <div className="w-full flex flex-col items-center gap-2">
          <div className="flex  gap-4">
            <a
              href={URL}
              target="_blank"
              className="flex items-center text-xl text-center border p-2 rounded-full"
            >
              Image URL
            </a>
            {level !== "" && <button
              onClick={addToDb}
              disabled={posting}
              className="text-center border p-2 rounded-full text-xl "
            >
              Add to DB
            </button>}
            <div className="flex flex-row gap-4">
              <button
                disabled={posting}
                className={`p-2 border border-white rounded-full 
      ${level === "good" ? "bg-red-600 border-black" : "bg-red-900"} 
      active:scale-95 transition-all`}
                onClick={() => setLevel("good")}
              >
                Good
              </button>

              <button
                disabled={posting}
                className={`p-2 border border-white rounded-full 
      ${level === "better" ? "bg-blue-600 border-black" : "bg-blue-900"} 
      active:scale-95 transition-all`}
                onClick={() => setLevel("better")}
              >
                Better
              </button>

              <button
                disabled={posting}
                className={`p-2 border border-white rounded-full 
      ${level === "best" ? "bg-green-600 border-black" : "bg-green-900"} 
      active:scale-95 transition-all`}
                onClick={() => setLevel("best")}
              >
                Best
              </button>
            </div>
          </div>
          <iframe
            src={URL}
            allowFullScreen
            className="w-full h-[100vh] border rounded shadow-lg"
          />
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}

export default Translator;
