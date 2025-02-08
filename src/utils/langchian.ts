import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";


const llm = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash-001",
    temperature: 0,
    apiKey : process.env.GEMINI_API_KEY,
    maxRetries: 2,
  });

const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "You are a helpful assistant that translates {input_language} to {output_language}.",
    ],
    ["human", "{input}"],
  ]);
  
  const chain = prompt.pipe(llm);
  const result = await chain.invoke({
    input_language: "English",
    output_language: "German",
    input: "I love programming.",
  });

  console.log(result);
//   return result;

