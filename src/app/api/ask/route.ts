import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { NextResponse } from "next/server"; // Import NextResponse

const llm = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash-001",
    temperature: 0,
    apiKey: process.env.GEMINI_API_KEY,
    maxRetries: 2,
});

const prompt = ChatPromptTemplate.fromMessages([
    ["system", "generate plantuml code for given statement it must be detailed and self explinatory use only class diagrams make the full database as well as the backend connections for the given statement but all the code must be correct according the plantuml syntax. Also make proper packages and connect them if required. Generate the output without any "],
    ["human", "{input}"],
]);

const chain = prompt.pipe(llm);

function removePlantUMLTags(text : string) {
    return text.replace(/```plantuml\s*/g, '').replace(/```\s*$/g, '');
}

export async function POST(req: Request) {
    try {
        const { input } = await req.json(); // Get data from request body

        console.log("Hit kia")

        const result = await chain.invoke({
            input: input || "Bank Management system.",
        });

        const res = removePlantUMLTags(String(result.content))

        return NextResponse.json({ translation: res }); // Use NextResponse.json()

    } catch (error) {
        console.error("Error in /api/ask:", error);
        return new NextResponse(JSON.stringify({ message: "Error processing request" }), { status: 500 }); // Proper error response
    }
}