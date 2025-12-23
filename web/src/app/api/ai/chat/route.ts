import { NextRequest } from "next/server";
import { generateChatResponse, type ChatMessage } from "@/lib/ai/groq";

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "AI service not configured. Please set GROQ_API_KEY." }),
        { status: 503, headers: { "Content-Type": "application/json" } }
      );
    }

    const body = await request.json();
    const { messages, userContext } = body as {
      messages: ChatMessage[];
      userContext?: string;
    };

    // Validate messages
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Messages are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Generate chat response using REST API
    const response = await generateChatResponse(apiKey, messages, userContext);

    return new Response(response, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("AI chat route error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to process chat";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
