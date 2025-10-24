"use client";
import { useCompletion } from "@ai-sdk/react";
import React from "react";

const StreamPage = () => {
  const {
    input,
    completion,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    setInput,
    stop
  } = useCompletion({
    api: "/api/stream", 
  });
  

  return (
    <div className="min-h-screen w-full bg-black flex flex-col items-center justify-between">
      {/* Chat output section */}
      <div className="w-full max-w-md flex-1 py-24 px-4 text-white overflow-y-auto">
        <h1 className="text-2xl font-semibold mb-6 text-center">
          🤖 AI Stream Chat
        </h1>

        {isLoading && !completion && (
          <div className="text-gray-400 animate-pulse">Loading...</div>
        )}

        {completion && (
          <div className="whitespace-pre-wrap bg-zinc-800 rounded-xl p-4 shadow-md">
            {completion}
          </div>
        )}

        {error && (
          <div className="text-red-500 mt-4">
             {error.message || "Something went wrong"}
          </div>
        )}
      </div>

     
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(e);
          setInput(""); // clear input after submit
        }}
        className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto p-4 bg-zinc-900 border-t border-zinc-700"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Ask me anything..."
            className="flex-1 px-3 py-2 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {isLoading ? (
            <button
              onClick={stop}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            >
              Stop
            </button>
          ) : (
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              Send
            </button>
          )}
         
        </div>
      </form>
    </div>
  );
};

export default StreamPage;


