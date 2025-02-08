"use client";

import React, { useEffect, useRef } from "react";

const DiagramEditor: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.draw.io/js/viewer.min.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleNewDiagram = () => {
    window.open("https://app.diagrams.net/", "_blank");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Optional chaining

    if (file) {
      // Check if a file was selected
      const reader = new FileReader();

      reader.onload = (e) => {
        const diagramXml = e.target?.result as string; // Type assertion

        if (editorRef.current) {
          editorRef.current.innerHTML = diagramXml;
        }
      };

      reader.readAsText(file);
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <button
          onClick={handleNewDiagram}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          Create New Diagram
        </button>
        <input
          type="file"
          accept=".xml"
          onChange={handleFileUpload}
          className="mt-2"
        />
      </div>
      <div ref={editorRef} className="border-2 border-gray-300 min-h-[400px]">
        Diagram will be displayed here
      </div>
    </div>
  );
};

export default DiagramEditor;
