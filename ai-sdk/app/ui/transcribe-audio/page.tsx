"use client";
import React, { useRef, useState } from "react";

interface TranscriptResult {
  text: string;
  segments?: Array<{ start: number; end: number; text: string }>;
  language?: string;
  durationInSeconds: number;
}

const TranscribeAudioPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<TranscriptResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("No file selected");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("audio", selectedFile);

      const response = await fetch("/api/transcribe-audio", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to transcribe audio");

      const data = await response.json();
      setTranscript(data);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong, please try again"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      setTranscript(null);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setError(null);
    setTranscript(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-zinc-800/60 backdrop-blur-md rounded-2xl shadow-2xl border border-zinc-700 p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center mb-4">
          🎙️ Audio Transcription
        </h1>
        <p className="text-center text-sm text-zinc-400 mb-6">
          Upload an audio file and get the transcript instantly.
        </p>

        {error && (
          <div className="text-red-400 text-sm bg-red-500/10 border border-red-400/40 rounded-lg p-2 text-center">
            {error}
          </div>
        )}

        {loading && (
          <div className="text-blue-400 text-sm bg-blue-500/10 border border-blue-400/40 rounded-lg p-2 text-center">
            Transcribing...
          </div>
        )}

        {transcript && !loading && (
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 space-y-2">
            <h2 className="font-semibold text-lg text-blue-400 mb-2">
              Transcript
            </h2>
            <p className="whitespace-pre-wrap text-sm text-zinc-200">
              {transcript.text}
            </p>

            {transcript.language && (
              <div className="text-sm text-zinc-400">
                Language: {transcript.language}
              </div>
            )}
            {transcript.durationInSeconds && (
              <div className="text-sm text-zinc-400">
                Duration: {transcript.durationInSeconds}s
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {selectedFile && (
            <div className="flex items-center justify-between text-sm text-zinc-400 border border-zinc-600 rounded-lg p-2 bg-zinc-900/50">
              <span>{selectedFile.name}</span>
              <button
                type="button"
                onClick={resetForm}
                className="text-red-400 hover:text-red-500 font-medium"
              >
                Remove
              </button>
            </div>
          )}

          <div className="flex gap-3">
            <input
              type="file"
              className="hidden"
              ref={fileInputRef}
              id="audio-upload"
              accept="audio/*"
              onChange={handleFileChange}
            />

            <label
              htmlFor="audio-upload"
              className="flex-1 text-center bg-zinc-900 hover:bg-zinc-700 transition rounded-lg p-3 border border-zinc-600 cursor-pointer font-medium"
            >
              {selectedFile ? "Change File" : "Select Audio File"}
            </label>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold px-4 py-2 rounded-lg transition"
            >
              {loading ? "..." : "Transcribe"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TranscribeAudioPage;
