"use client";

import { FormEvent, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

const Page = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const myGeminiApi = (e: FormEvent) => {
    e.preventDefault();
    fetch("https://gemini-stream.vercel.app/api/gemini-stream", {
      method: "POST",
      body: JSON.stringify({
        prompt: input,
      }),
    }).then(async (response) => {
      //@ts-ignore
      const reader = response.body.getReader();
      const textDecoder = new TextDecoder("utf-8");

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          return;
        }
        const decodedText = textDecoder.decode(value);
        setOutput((prev) => prev + decodedText);
        console.log(decodedText);
      }
    });
  };

  return (
    <main className="flex min-h-screen w-full flex-col p-24 bg-white gap-2">
      <p className="text-gray-600 mt-10"> ASK GEMINI ✨ </p>
      <form
        onSubmit={(e) => {
          myGeminiApi(e);
        }}
      >
        <div className="w-full flex flex-row gap-2 items-center">
          <input
            onChange={(e) => {
              setInput(e.target.value);
            }}
            className="w-full p-2  text-gray-600 outline-none ring-0 rounded-md text-sm border border-gray-200"
          />
          <button
            type="submit"
            className="text-gray-600 border rounded-md hover:bg-gray-50 px-3 py-2"
            onClick={() => {
              setOutput("");
              //   myGeminiApi(input);
            }}
          >
            Ask
          </button>
        </div>
      </form>
      <div className="text-gray-600 text-sm">
        <Markdown remarkPlugins={[remarkGfm]}>{output}</Markdown>
      </div>
    </main>
  );
};

export default Page;
