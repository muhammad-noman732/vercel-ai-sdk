"use client"
import { useChat } from '@ai-sdk/react';
import React, { useState } from 'react'

const ChatPage = () => {
    const[input , setInput] = useState("");
    const {messages , sendMessage , status , error , stop} = useChat()

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        sendMessage({text: input});
        setInput("")
    }
  return (

    <div className="min-h-screen w-full bg-black flex flex-col items-center justify-between">
       <div className="w-full max-w-md flex-1 py-24 px-4 text-white overflow-y-auto">
         {
            messages.map((message)=>(
                <div key={message.id} className='mb-4'>
                  
                 <div className='font-semibold'>
                    {message.role === "user" ? "You" :"Ai"}
                 </div>
                  {message.parts.map((part , index)=>{
                     switch (part.type){
                        case "text":
                         return <div key={`${message.id}-${index}`} className='whitespace-pre-wrap'>
                            {part.text}
                               </div>
                     }
                  })}   
                </div>
            ))
         }
         {(status ==="submitted" || status=== "streaming") &&(
                <div className='mb-4'>
                    <div className='flex items-center gap-2'>
                        <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400'></div>
                    </div>
                </div>
            )
         }
         {error && <div className='text-red-500  text-xl'>{error.message} </div>}

      </div>
      <form onSubmit={handleSubmit} className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto p-4 bg-zinc-900 border-t border-zinc-700">
         <input
          type="text"
          value={input}
          onChange={(e)=>setInput(e.target.value)} 
              className="flex-1 px-3 py-2 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {(status === 'submitted' || status === "streaming")?(
           <button 
             onClick={stop}
             className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
             >
                Stop
          </button>
          ):
           ( <button 
            type='submit'
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={status !="ready"}>
                Send
          </button>)
          }
        
      </form>
    </div>
  )
}

export default ChatPage
