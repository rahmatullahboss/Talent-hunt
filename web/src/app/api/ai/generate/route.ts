import { NextRequest } from "next/server";
import { createGroqClient, generateContent, type ContentType, CONTENT_TYPES } from "@/lib/ai/groq";

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
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

    const client = createGroqClient(apiKey);
    
    // Create a readable stream for the response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of generateContent(client, contentType, context, instructions)) {
            controller.enqueue(encoder.encode(chunk));
          }
          controller.close();
        } catch (error) {
          console.error("AI generation error:", error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("AI generate route error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate content" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
