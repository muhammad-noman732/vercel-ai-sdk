"use client";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import React, { useState } from "react";
import { ChatMessages } from "@/app/api/web-search-tool/route";
import { Loader2, SendHorizontal, XCircle, Globe } from "lucide-react";

const ToolCallingPage = () => {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { error, messages, sendMessage, status, stop } = useChat<ChatMessages>({
    transport: new DefaultChatTransport({
      api: "/api/web-search-tool",
    }),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text.trim()) return;
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
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 flex flex-col items-center justify-center text-white px-4 py-6">
      <div className="w-full max-w-2xl bg-gray-850/60 backdrop-blur-lg rounded-2xl shadow-xl flex flex-col overflow-hidden border border-gray-700/50">
        {/* Header */}
        <div className="bg-gray-800/80 px-6 py-4 border-b border-gray-700 flex items-center justify-center">
          <h1 className="text-xl font-semibold text-teal-400 tracking-wide">
            🌐 Web Search Chat
          </h1>
        </div>

        {/* Messages */}
        <div className="flex-grow overflow-y-auto space-y-5 p-5 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
          {messages.map((message) => {
            const sources = message.parts.filter(
              (part) => part.type === "source-url"
            );
            return (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl shadow-md transition-all duration-300 text-sm sm:text-base leading-relaxed ${
                    message.role === "user"
                      ? "bg-teal-600 text-white rounded-br-none"
                      : "bg-gray-800 text-gray-100 rounded-bl-none"
                  }`}
                >
                  {message.parts.map((part, index) => {
                    switch (part.type) {
                      case "text":
                        return (
                          <div key={`${message.id}-${index}`}>{part.text}</div>
                        );

                      case "tool-web_search_preview":
                        switch (part.state) {
                          case "input-streaming":
                            return (
                              <div
                                key={`${message.id}-websearch-${index}`}
                                className="animate-pulse mt-2"
                              >
                                <div>🔍 Preparing web search...</div>
                                <pre className="text-xs text-gray-300 bg-gray-900/80 p-2 rounded-md mt-1 overflow-x-auto">
                                  {JSON.stringify(part.input, null, 2)}
                                </pre>
                              </div>
                            );

                          case "input-available":
                            return (
                              <div
                                key={`${message.id}-websearch-${index}`}
                                className="text-gray-300 mt-2 italic"
                              >
                                Searching online sources...
                              </div>
                            );

                          case "output-available":
                            return (
                              <React.Fragment
                                key={`${message.id}-websearch-${index}`}
                              >
                                <div className="bg-gray-900/80 rounded-md p-3 mt-3 border border-gray-700/60">
                                  <div className="flex items-center gap-2 text-teal-300 font-semibold">
                                    <Globe size={16} /> Web Search Summary
                                  </div>
                                  <div className="text-gray-200 mt-1 text-sm">
                                    Web search completed successfully.
                                  </div>
                                </div>

                                {/* Sources */}
                                {message.role === "assistant" &&
                                  sources.length > 0 && (
                                    <div className="mt-3 bg-gray-900/70 rounded-lg p-3 border border-gray-700/50">
                                      <div className="text-gray-300 font-medium mb-1">
                                        🔗 Sources ({sources.length})
                                      </div>
                                      <ul className="list-disc pl-4 space-y-1 text-sm text-teal-400">
                                        {sources.map((part, i) => {
                                          if (part.type === "source-url") {
                                            return (
                                              <li key={`${message.id}-${i}`}>
                                                <a
                                                  href={part.url}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="hover:underline hover:text-teal-300 transition-colors"
                                                >
                                                  {part.title || part.url}
                                                </a>
                                              </li>
                                            );
                                          }
                                        })}
                                      </ul>
                                    </div>
                                  )}
                              </React.Fragment>
                            );

                          case "output-error":
                            return (
                              <div
                                key={`${message.id}-websearch-${index}`}
                                className="text-red-400 mt-2"
                              >
                                ⚠️ Web search failed: {part.errorText}
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
            );
          })}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-3 bg-gray-800/80 px-4 py-3 border-t border-gray-700"
        >
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow bg-transparent outline-none text-gray-200 placeholder-gray-500 px-2 text-sm sm:text-base"
          />

          {status === "streaming" || status === "submitted" ? (
            <button
              type="button"
              onClick={stop}
              className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-1 transition"
            >
              <XCircle size={16} /> Stop
            </button>
          ) : (
            <button
              type="submit"
              disabled={status !== "ready" || !text.trim() || isLoading}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-1 transition ${
                status !== "ready" || !text.trim() || isLoading
                  ? "bg-gray-600 cursor-not-allowed"
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
          <div className="text-red-400 text-sm text-center py-2 border-t border-gray-700 bg-gray-800/70">
            {error.message || "Something went wrong"}
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolCallingPage;
