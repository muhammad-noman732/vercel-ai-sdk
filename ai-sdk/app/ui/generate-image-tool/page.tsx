"use client";
import { useChat } from "@ai-sdk/react";
import React, { useRef, useState } from "react";
import { DefaultChatTransport } from "ai";
import Image from "next/image";
import { Paperclip, Send, StopCircle } from "lucide-react";
import type { ChatMessages } from "@/app/api/generate-image-tool/route";

const MultiModalChatPage = () => {
  const [input, setInput] = useState("");
  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { error, messages, sendMessage, status, stop } = useChat<ChatMessages>({
    transport: new DefaultChatTransport({
      api: "/api/generate-image-tool",
    }),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() && !files?.length) return;
    sendMessage({ text: input, files });
    setFiles(undefined);
    setInput("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-gray-100 to-white p-6">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6 flex flex-col space-y-6">
        {/* Header */}
        <h1 className="text-2xl font-bold text-center text-blue-700">
          🧠 AI Multi-Modal Chat
        </h1>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto max-h-[65vh] space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
          {messages.length === 0 && (
            <p className="text-gray-400 text-center">
              Start chatting with the AI... 💬
            </p>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex flex-col ${
                message.role === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
                  message.role === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-900 rounded-bl-none"
                }`}
              >
                {message.parts.map((part, index) => {
                  switch (part.type) {
                    case "text":
                      return (
                        <p key={`${message.id}-${index}`} className="whitespace-pre-line">
                          {part.text}
                        </p>
                      );
                    case "file":
                      if (part.mediaType?.startsWith("image/")) {
                        return (
                          <div key={`${message.id}-${index}`} className="mt-2">
                            <Image
                              src={part.url}
                              alt={part.filename ?? `attachment-${index}`}
                              width={300}
                              height={300}
                              className="rounded-lg border border-gray-300"
                            />
                          </div>
                        );
                      }
                      if(part.mediaType ==="application/pdf"){
                       return ( 
                         <iframe
                            key={`${message.id}-${index}`}
                            src={part.url}
                            width={400}
                            height={500}
                            title={part.filename ?? `attatchment-${index}`}
                          />
                   )}
                      return (
                        <a
                          key={`${message.id}-${index}`}
                          href={part.url}
                          target="_blank"
                          className="text-sm underline"
                          rel="noopener noreferrer"
                        >
                          {part.filename ?? `File ${index + 1}`}
                        </a>
                      );
                      // tool case for image
                    case "tool-generateImage":
                      switch(part.state){
                          case "input-streaming":
                          return (
                            <div
                              key={`${message.id}-getWeather-${index}`}
                              className="animate-pulse"
                            >
                              <div>Receiving Generate Image Request</div>
                              <pre className="text-xs text-gray-300 bg-gray-800 p-2 rounded-lg mt-1">
                                {JSON.stringify(part.input, null, 2)}
                              </pre>
                            </div>
                          );

                        case "input-available":
                          return (
                            <div
                              key={`${message.id}-generateImage-${index}`}
                              className="text-gray-200"
                            >
                              Generating Image for{" "}
                              <span className="font-semibold text-teal-300">
                                {part.input.prompt}
                              </span>
                              ...
                            </div>
                          );

                        case "output-available":
                          return (
                            <div
                              key={`${message.id}-generateImage-${index}`}
                              className="bg-gray-800 rounded-lg p-2 mt-2"
                            >
                              <div className="flex items-center gap-2 text-teal-300 font-semibold">
                                Generated Image 
                              </div>
                              <Image 
                                className="rounded-lg"
                                src={`data:image/png;base64,${part.output}`}
                                alt="Generatd Image"
                                height={500}
                                width={500}
                                /> 
                            </div>
                          );

                        case "output-error":
                          return (
                            <div
                              key={`${message.id}-generateImage-${index}`}
                              className="text-red-400"
                            >
                               {part.errorText}
                            </div>
                          );

                        default:
                          return null
                      }
                    default:
                      return null;
                  }
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="text-red-500 text-sm text-center">
            {error.message || "Something went wrong."}
          </div>
        )}

        {/* Input Form */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-3 bg-gray-100 rounded-xl p-3 shadow-inner"
        >
          {/* File Upload */}
          <label
            htmlFor="file-upload"
            className="flex items-center justify-center p-2 bg-white rounded-lg border border-gray-300 hover:bg-gray-200 cursor-pointer"
          >
            <Paperclip className="w-5 h-5 text-gray-600" />
          </label>
          <input
            id="file-upload"
            type="file"
            multiple
            onChange={(e) => e.target.files && setFiles(e.target.files)}
            className="hidden"
            ref={fileInputRef}
          />

          {/* Input Field */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message or upload a file..."
            className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Send / Stop Buttons */}
          {status === "submitted" || status === "streaming" ? (
            <button
              onClick={stop}
              title="stop"
              className="flex items-center justify-center p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              <StopCircle className="w-5 h-5" />
            </button>
          ) : (
            <button
              type="submit"
              title="send"
              disabled={status !== "ready"}
              className="flex items-center justify-center p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          )}
        </form>

        {/* File preview info */}
        {files?.length ? (
          <div className="text-sm text-gray-600 mt-2 text-center">
            📎 {files.length} file(s) attached
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default MultiModalChatPage;
