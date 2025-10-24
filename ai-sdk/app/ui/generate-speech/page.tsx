"use client";
import React, { useEffect, useRef, useState } from "react";

const GenerateSpeechPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [hasAudio, setHasAudio] = useState(false);

  // Refs hold mutable objects that don't trigger rerenders
  const audioUrlRef = useRef<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text.trim()) return setError("Please enter text");

    setIsLoading(true);
    setError(null);

    // If previous audio exists - cleanup it before making new one
    if (audioRef.current) {
      audioRef.current.pause();
      // remove any listeners we'll add later
      audioRef.current.removeAttribute("src");
      audioRef.current = null;
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = '';
    }

    try {
      const res = await fetch("/api/generate-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) throw new Error("Failed to generate audio");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      audioUrlRef.current = url;

      const audio = new Audio(url);
      audioRef.current = audio;

    //   // When audio ends, mark that there is no active audio and revoke the URL
    //   const onEnded = () => {
    //     setHasAudio(false);
    //     if (audioUrlRef.current) {
    //       URL.revokeObjectURL(audioUrlRef.current);
    //       audioUrlRef.current = null;
    //     }
    //     // remove listener
    //     audio.removeEventListener("ended", onEnded);
    //   };

    //   audio.addEventListener("ended", onEnded);

      // Play; handle possible autoplay rejection
    //   const playPromise = audio.play();
    //   if (playPromise !== undefined) {
    //     playPromise.catch((err) => {
    //       // Autoplay blocked. Let user manually click replay.
    //       console.warn("Autoplay blocked:", err);
    //       setError("Autoplay blocked — please press Replay to play audio.");
    //     });
      

      setHasAudio(true);
      setText("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setHasAudio(false);
    } finally {
      setIsLoading(false);
    }
  };

  const replayAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((err) => {
        console.warn("Replay failed:", err);
        setError("Playback blocked. Please interact with the page first.");
      });
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.src = "";
          audioRef.current = null;
      }
      if (audioUrlRef.current) {
          URL.revokeObjectURL(audioUrlRef.current); 
          audioUrlRef.current = null;
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800 p-4">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-4">🎙️ Text to Speech</h1>

        {error && <div className="bg-red-100 text-red-600 text-sm p-2 mb-3 rounded-md">{error}</div>}

        {isLoading && <div className="text-center text-blue-600 font-medium mb-3">Generating...</div>}

        {hasAudio && !isLoading && (
          <div className="flex gap-2 mb-3">
            <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={replayAudio}>
              Replay
            </button>
            <button
              className="px-3 py-1 bg-red-500 text-white rounded"
              onClick={() => {
                // manual cleanup
                if (audioRef.current) {
                  audioRef.current.pause();
                  audioRef.current.src = "";
                  audioRef.current = null;
                }
                if (audioUrlRef.current) {
                  URL.revokeObjectURL(audioUrlRef.current);
                  audioUrlRef.current = null;
                }
                setHasAudio(false);
              }}
            >
              Remove
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text..."
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <button type="submit" disabled={isLoading} className={`rounded-md py-2 text-white font-medium ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}>
            {isLoading ? "Generating..." : "Generate Speech"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GenerateSpeechPage;
