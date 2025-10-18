"use client";
import React, { useState } from "react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { recipeSchema } from "@/app/api/structured_data/schema";

const StructuredDataPage = () => {
  const [dish, setDish] = useState("");
  const { submit, object, isLoading, error } = useObject({
    api: "/api/structured_data",
    schema: recipeSchema,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!dish.trim()) return;
    submit({ dish });
    setDish("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center py-12 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-800">
        🍽 Recipe Generator
      </h1>

      {/* Input form */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md flex gap-2 mb-10"
      >
        <input
          type="text"
          value={dish}
          onChange={(e) => setDish(e.target.value)}
          placeholder="Enter a dish name (e.g., Pancakes)"
          className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold shadow-md"
        >
          Generate
        </button>
      </form>

      {/* Error message */}
      {error && (
        <div className="text-red-600 mb-4 font-medium">{error.message || "Something went wrong."}</div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="text-gray-700 mb-4 animate-pulse">Generating recipe...</div>
      )}

      {/* Recipe output */}
      {object?.recipe && (
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8 space-y-6">
          {/* Recipe Title */}
          <h2 className="text-3xl font-bold text-blue-700">{object.recipe.name}</h2>

          {/* Ingredients */}
          {object.recipe.ingredients?.length > 0 && (
            <div className="bg-blue-50 rounded-xl p-4">
              <h3 className="text-xl font-semibold mb-2 text-blue-800">Ingredients</h3>
              <ul className="list-disc list-inside space-y-1">
                {object.recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="text-gray-800">
                    {ingredient.amount} {ingredient.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Steps */}
          {object.recipe.steps?.length > 0 && (
            <div className="bg-green-50 rounded-xl p-4">
              <h3 className="text-xl font-semibold mb-2 text-green-800">Steps</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-800">
                {object.recipe.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StructuredDataPage;
