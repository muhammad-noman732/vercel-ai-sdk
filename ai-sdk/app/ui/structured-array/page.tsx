"use client"
import { pokemonUiSchema } from "@/app/api/structured-array/schema";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import React, { useState } from "react";

const StructuredArrayPage = () => {
  const [type, setType] = useState("");
  const { object, submit, error, isLoading } = useObject({
    api: "/api/structured-array",
    schema: pokemonUiSchema,
  });

  const handleSubmit = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    if (!type.trim()) return;
    submit({ type });
    setType("");
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 py-10 px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6 flex flex-col space-y-4">
        <h1 className="text-2xl font-semibold text-center text-blue-600">
          🧠 Pokémon Info Chat
        </h1>

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm">
            {error.message}
          </div>
        )}

        {/* Chat Responses */}
        <div className="flex flex-col space-y-4 overflow-y-auto max-h-[400px] p-2">
          {object?.map((pokemon) => (
            <div
              key={pokemon?.name}
              className="self-start bg-blue-50 border border-blue-200 rounded-2xl p-4 shadow-sm max-w-[80%]"
            >
              <h2 className="text-lg font-semibold text-blue-700">
                {pokemon?.name}
              </h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {pokemon?.abilities?.map((ability) => (
                  <span
                    key={ability}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {ability}
                  </span>
                ))}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="self-start text-gray-500 italic">Thinking...</div>
          )}
        </div>

        {/* Input Section */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 border-t pt-4"
        >
          <input
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder="Enter Pokémon type..."
            className="flex-1 px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-60"
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StructuredArrayPage;
