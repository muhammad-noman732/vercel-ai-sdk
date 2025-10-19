"use client"
import React, { useState } from "react";

const StructuredEnumPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [sentiment, setSentiment] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsLoading(true);
    setError(null);
    setSentiment("");

    try {
      const response = await fetch("/api/structured-enum", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      setSentiment(data);
    } catch (error) {
      console.error("Error:", error);
      setError(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md flex flex-col space-y-6">
        <h1 className="text-2xl font-semibold text-center text-indigo-600">
          🧠 Sentiment Analyzer
        </h1>

        {/* Error message */}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm text-center">
            {error}
          </div>
        )}

        {/* Sentiment display */}
        <div className="flex justify-center items-center min-h-[100px]">
          {isLoading ? (
            <div className="text-gray-500 italic animate-pulse">
              Analyzing sentiment...
            </div>
          ) : sentiment ? (
            <div
              className={`text-2xl font-bold ${
                sentiment === "positive"
                  ? "text-green-600"
                  : sentiment === "negative"
                  ? "text-red-600"
                  : "text-yellow-500"
              }`}
            >
              {sentiment === "positive" && "✌🏻 Positive"}
              {sentiment === "negative" && "👇 Negative"}
              {sentiment === "neutral" && "👌 Neutral"}
            </div>
          ) : (
            <div className="text-gray-400 italic">
              Type a sentence to analyze its mood.
            </div>
          )}
        </div>

        {/* Input form */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 border-t pt-4"
        >
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type something like 'I love coding!'"
            className="flex-1 px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-5 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition disabled:opacity-60"
          >
            {isLoading ? "..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StructuredEnumPage;
