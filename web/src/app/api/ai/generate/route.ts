import { NextRequest } from "next/server";
import { generateContent, CONTENT_TYPES, type ContentType } from "@/lib/ai/groq";

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
    const { contentType, context, instructions } = body as {
      contentType: ContentType;
      context: string;
      instructions?: string;
    };

    // Validate content type
    if (!contentType || !CONTENT_TYPES[contentType]) {
      return new Response(
        JSON.stringify({ error: "Invalid content type" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate context
    if (!context || context.trim().length < 3) {
      return new Response(
        JSON.stringify({ error: "Context is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Generate content using REST API
    const generatedText = await generateContent(apiKey, contentType, context, instructions);

    return new Response(generatedText, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("AI generate route error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to generate content";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
