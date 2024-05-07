"use client";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { FormEvent, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

function removePrefixAndSpaceAndQuotes(inputString: string) {
  if (inputString.startsWith(`0:"`)) {
    return inputString.slice(3).trim().replace(/"$/, "");
  } else {
    return inputString;
  }
}

const Page = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const chatGemini = (e: FormEvent) => {
    e.preventDefault();
    fetch("/api/chat-gemini", {
      method: "POST",
      body: JSON.stringify({
        prompt: `Please act as a survey bot. Please administer an open survey where the respondent will submit the feedback about "Market for cosmetics in Bangalore Survey". To assess consumer preferences and purchasing behaviors in the cosmetics market of Bangalore, aiming to understand trends and demands for potential market strategies. The survey should seek the point of view of the participants and to what extent they will be happy or unhappy. Every time you administrate the bot sees the same set of questions. Ask only one question at a time. Ask a question only once. Upon a suitable response only, move to the second question. Where there is no option, just ask for the answer in the text. End the survey with the last question. Never give notes. Never repeat the same question. Note: Please only use the following set of questions in your survey.
        #1 Please indicate your preferred method of purchasing cosmetics:
        Options: In-store; Online; Both
        #2 Could you specify the primary factor influencing your choice of cosmetics purchase?
        Option: User will give text answer
        #3 Would you be willing to pay a premium for cosmetics made with natural ingredients? Please specify 'Yes' or 'No'.
        No Option: User will give text answer`,
        response: input,
        previousHistory: JSON.stringify([
          {
            user: "Please act as a survey bot. Please administer an open survey where the respondent will submit the feedback about Market for cosmetics in Bangalore Survey. To assess consumer preferences and purchasing behaviors in the cosmetics market of Bangalore, aiming to understand trends and demands for potential market strategies. The survey should seek the point of view of the participants and to what extent they will be happy or unhappy. Every time you administrate the bot sees the same set of questions. Ask only one question at a time. Ask a question only once. Upon a suitable response only, move to the second question. Where there is no option, just ask for the answer in the text. End the survey with the last question. Never give notes. Never repeat the same question. Note: Please only use the following set of questions in your survey.\n        #1 Please indicate your preferred method of purchasing cosmetics:\n        Options: In-store; Online; Both\n        #2 Could you specify the primary factor influencing your choice of cosmetics purchase?\n        Option: User will give text answer\n        #3 Would you be willing to pay a premium for cosmetics made with natural ingredients? Please specify 'Yes' or 'No'.\n        No Option: User will give text answerStart survey",
            model:
              "**#1 Please indicate your preferred method of purchasing cosmetics:**\n\n[ ] In-store\n[ ] Online\n[ ] Both",
          },
        ]),
      }),
    }).then(async (response) => {
      console.log(response);
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

  const myGeminiApi = (e: FormEvent) => {
    e.preventDefault();
    fetch("/api/gemini-stream", {
      method: "POST",
      body: JSON.stringify({
        prompt: input,
      }),
    }).then(async (response) => {
      console.log(response);
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
