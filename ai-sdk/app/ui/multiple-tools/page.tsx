"use client";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import React, { useState } from "react";
import { ChatMessages } from "@/app/api/multiple-tools/route";
import { Cloud, Loader2, SendHorizontal, XCircle } from "lucide-react";

const MultiToolCallingPage = () => {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { error, messages, sendMessage, status, stop } = useChat<ChatMessages>({
    transport: new DefaultChatTransport({
      api: "/api/multiple-tools",
    }),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      sendMessage({ text });
      setText("");
    } catch {
      console.error("Failed to send tool call");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center justify-between text-white p-6">
      <div className="w-full max-w-2xl bg-gray-850 rounded-2xl shadow-lg p-4 flex flex-col flex-grow overflow-hidden">
        <h1 className="text-center text-2xl font-semibold mb-4 text-teal-400">
          Tool Calling Chat
        </h1>

        {/* Chat Messages */}
        <div className="flex-grow overflow-y-auto space-y-4 mb-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 p-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] p-3 rounded-2xl shadow-md ${
                  message.role === "user"
                    ? "bg-teal-600 text-white rounded-br-none"
                    : "bg-gray-700 text-gray-100 rounded-bl-none"
                } transition-all duration-300`}
              >
                {message.parts.map((part, index) => {
                  switch (part.type) {
                    case "text":
                      return (
                        <div key={`${message.id}-${index}`}>{part.text}</div>
                      );

                      // locaton tool
                    case "tool-getLocation":
                      switch (part.state) {
                        case "input-streaming":
                          return (
                            <div
                              key={`${message.id}-getLocation-${index}`}
                              className="animate-pulse"
                            >
                              <div>Receiving location request...</div>
                              <pre className="text-xs text-gray-300 bg-gray-800 p-2 rounded-lg mt-1">
                                {JSON.stringify(part.input, null, 2)}
                              </pre>
                            </div>
                          );

                        case "input-available":
                          return (
                            <div
                              key={`${message.id}-getLocation-${index}`}
                              className="text-gray-200"
                            >
                              🌍 Getting Location for{" "}
                              <span className="font-semibold text-teal-300">
                                {part.input.name}
                              </span>
                              ...
                            </div>
                          );

                        case "output-available":
                          return (
                            <div
                              key={`${message.id}-getLocation-${index}`}
                              className="bg-gray-800 rounded-lg p-2 mt-2"
                            >
                              <div className="flex items-center gap-2 text-teal-300 font-semibold">
                                <Cloud size={18} /> Location Report
                              </div>
                              <div className="text-gray-200 mt-1 text-sm">
                                {part.output}
                              </div>
                            </div>
                          );

                        case "output-error":
                          return (
                            <div
                              key={`${message.id}-getLocation-${index}`}
                              className="text-red-400"
                            >
                               {part.errorText}
                            </div>
                          );

                        default:
                          return null;
                      }

                    case "tool-getWeather":
                      switch (part.state) {
                        case "input-streaming":
                          return (
                            <div
                              key={`${message.id}-getWeather-${index}`}
                              className="animate-pulse"
                            >
                              <div>🌦 Receiving weather request...</div>
                              <pre className="text-xs text-gray-300 bg-gray-800 p-2 rounded-lg mt-1">
                                {JSON.stringify(part.input, null, 2)}
                              </pre>
                            </div>
                          );

                        case "input-available":
                          return (
                            <div
                              key={`${message.id}-getWeather-${index}`}
                              className="text-gray-200"
                            >
                              🌍 Getting weather for{" "}
                              <span className="font-semibold text-teal-300">
                                {part.input.city}
                              </span>
                              ...
                            </div>
                          );

                        case "output-available":
                          return (
                            <div
                              key={`${message.id}-getWeather-${index}`}
                              className="bg-gray-800 rounded-lg p-2 mt-2"
                            >
                              <div className="flex items-center gap-2 text-teal-300 font-semibold">
                                <Cloud size={18} /> Weather Report
                              </div>
                              <div className="text-gray-200 mt-1 text-sm">
                                {part.output}
                              </div>
                            </div>
                          );

                        case "output-error":
                          return (
                            <div
                              key={`${message.id}-getWeather-${index}`}
                              className="text-red-400"
                            >
                               {part.errorText}
                            </div>
                          );

                        default:
                          return null;
                      }

                    default:
                      return null;
                  }
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-3 bg-gray-700 rounded-xl p-3 shadow-inner"
        >
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow bg-transparent outline-none text-gray-200 placeholder-gray-400 px-2"
          />

          {status === "streaming" || status === "submitted" ? (
            <button
              type="button"
              onClick={stop}
              className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1 transition"
            >
              <XCircle size={16} /> Stop
            </button>
          ) : (
            <button
              type="submit"
              disabled={status !== "ready" || !text.trim() || isLoading}
              className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-1 transition ${
                status !== "ready" || !text.trim() || isLoading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-teal-500 hover:bg-teal-600"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Sending...
                </>
              ) : (
                <>
                  <SendHorizontal size={16} /> Send
                </>
              )}
            </button>
          )}
        </form>

        {error && (
          <div className="text-red-400 text-sm mt-2 text-center">
            {error.message || "Something went wrong"}
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiToolCallingPage;
