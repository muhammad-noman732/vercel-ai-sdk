"use client";
import Image from "next/image";
import React, { useState } from "react";

const GenerateImage = () => {
  const [prompt, setPrompt] = useState("");
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError("");
    setImageSrc(null);

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
          throw new Error(data.error || "Error generating image");
      }

     setImageSrc(`data:image/png;base64,${data.image}`);

    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 via-white to-blue-50 px-6 py-10">
      {/* Outer Card */}
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center space-y-6 border border-blue-100">
        {/* Header */}
        <h1 className="text-3xl font-extrabold text-blue-700 text-center drop-shadow-sm">
           AI Image Generator
        </h1>
        <p className="text-gray-500 text-center text-sm">
          Enter a creative prompt and let AI bring your imagination to life!
        </p>

        {/* Error Message */}
        {error && (
          <div className="text-red-600 bg-red-50 border border-red-200 rounded-lg py-2 px-4 w-full text-center text-sm font-medium">
            {error}
          </div>
        )}

        {/* Image Display Area */}
        <div className="w-full flex items-center justify-center bg-gray-100 rounded-2xl p-4 min-h-[400px] border border-gray-200">
          {isLoading ? (
            <div className="w-full h-[400px] animate-pulse bg-gray-300 rounded-xl" />
          ) : imageSrc ? (
            <Image
              src={imageSrc}
              alt="AI Generated Image"
              width={512}
              height={512}
              className="rounded-xl shadow-md object-contain w-full max-h-[512px]"
            />
          ) : (
            <p className="text-gray-400 italic">No image generated yet.</p>
          )}
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleSubmit}
          className="w-full flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl p-3 shadow-inner"
        >
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your image idea... (e.g. a cat astronaut)"
            className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400 text-gray-800"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Generating..." : "Generate"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GenerateImage;
