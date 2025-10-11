"use client";
import React, { useState } from "react";


const Page = () => {
    const [prompt , setPrompt] = useState('');// user input
    const [loading , setLoading] = useState(false)
    const [completion , setCompletion] = useState("") // ai response
    const [error , setError] = useState<string | null>(null)

    const complete = async(e: React.FormEvent)=>{
        e.preventDefault()
        setLoading(true);
        try {
            const response = await fetch("/api/completion" ,{
                method: "POST",
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({prompt})
            })
            const data = await response.json();
            console.log('data' , data)
            if(!response.ok){
                throw new Error(data.error || "something went wrong")
            }
            setCompletion(data.data)
            setPrompt("")
        } catch (error) {
            console.error('error' , error)
            setPrompt("")
            setError(error instanceof Error ? error.message :"Something went wrong , please try again")
        }finally{
            setLoading(false)
            setPrompt("")
        }
    }
  return (
    <div className="min-h-screen w-full bg-black flex flex-col items-center justify-between">
      <div className="w-full max-w-md py-24 flex-1 text-white">
        {/* content here */}
        {error && <div className="text-red-500">{error}</div>}
        {
         loading ? (
         <div>  Loading... </div>
         ): completion ?(
            <div className="whitespace-pre-wrap "> {completion} </div>
         ):null
        }

      </div>

      <form onSubmit={complete} className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto p-2 bg-zinc-50">
        <div className="flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={e=> setPrompt(e.target.value)}
            placeholder="Enter your text"
            className="flex-1 dark:bg-zinc-700 border px-3 dark:border-zinc-900"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-2xl text-white rounded px-4 py-2 hover:bg-blue-600 transition"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default Page;
